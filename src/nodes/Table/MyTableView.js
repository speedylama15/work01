import { TableView } from "@tiptap/extension-table";
import debounce from "lodash.debounce";

class MyTableView extends TableView {
  constructor(node, cellMinWidth, HTMLAttributes, editor) {
    super(node, cellMinWidth);

    this.editor = editor;

    // Create the main block wrapper
    const blockDiv = document.createElement("div");
    blockDiv.setAttribute("data-id", node.attrs.id);
    blockDiv.setAttribute("data-content-type", "table");
    blockDiv.setAttribute("data-indent-level", node.attrs.indentLevel);
    blockDiv.setAttribute("data-node-type", "block");
    blockDiv.className = "block block-table";

    // Create content wrapper
    const contentDiv = document.createElement("div");
    contentDiv.className = "content content-table";

    // Create toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    const h2 = document.createElement("h2");
    h2.textContent = "Title";
    const toolbarButtonsContainer = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    button1.textContent = "button1";
    button2.textContent = "button2";

    // Create table wrapper (like the example you showed)
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "tableWrapper";

    // Create ProseMirror-managed area
    const tableWrapperInner = document.createElement("div");
    tableWrapperInner.className = "tableWrapper-inner";
    tableWrapperInner.appendChild(this.dom); // Original table goes here

    // Create SAFE portal container (outside ProseMirror control)
    this.portalContainer = document.createElement("div");
    this.portalContainer.className = "table-widgets-container";
    this.portalContainer.style.cssText = `
      position: relative;
      pointer-events: none;
    `;

    // Assemble the table structure
    tableWrapper.appendChild(tableWrapperInner);
    tableWrapper.appendChild(this.portalContainer); // Safe manipulation zone

    // Assemble everything
    contentDiv.append(toolbar);
    toolbar.append(h2, toolbarButtonsContainer);
    toolbarButtonsContainer.append(button1, button2);
    contentDiv.appendChild(tableWrapper);
    blockDiv.appendChild(contentDiv);

    // Set the new root
    this.dom = blockDiv;

    // Store references for easy access
    this.tableWrapper = tableWrapper;
    this.tableWrapperInner = tableWrapperInner;
    this.originalTable = tableWrapperInner.querySelector("table");

    // Initialize the portal system
    this.initializePortalSystem();
    this.setupEventListeners();
    setTimeout(() => {
      this.createDraggableTestButton();
    }, 500);
  }

  initializePortalSystem() {
    // Create portal manager
    this.portals = new Map();
    this.activeButtons = {
      rowHandle: null,
      columnHandle: null,
      rowExtend: null,
      columnExtend: null,
    };
  }

  setupEventListeners() {
    this.originalTable.addEventListener("mouseenter", (e) => {
      this.showHandleButtons();
      this.hideExtendButtons();

      // Dispatch meta for plugin state
      const { tr } = this.editor.state;
      const { dispatch } = this.editor.view;
      tr.setMeta("tableHover", "enter");
      dispatch(tr);
    });

    this.originalTable.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);

      // Your existing mousemove logic
      const table = e.target.closest("table");
      const cell = e.target.closest("td, th");

      if (table && cell) {
        const tablePos = this.editor.view.posAtDOM(table);
        const cellPos = this.editor.view.posAtDOM(cell);

        const { tr } = this.editor.state;
        const { dispatch } = this.editor.view;

        tr.setMeta("tableCoords", {
          table,
          tablePos,
          cell,
          cellPos,
          width: cell.offsetWidth,
          height: cell.offsetHeight,
          left: cell.offsetLeft,
          top: cell.offsetTop,
        });

        dispatch(tr);
      }
    });

    this.originalTable.addEventListener("mouseleave", (e) => {
      this.hideAllButtons();

      const { tr } = this.editor.state;
      const { dispatch } = this.editor.view;
      tr.setMeta("tableCoords", "moved out");
      dispatch(tr);
    });
  }

  // Safe portal manipulation methods
  createPortal(id) {
    const portal = document.createElement("div");
    portal.id = `_${id}_${Math.random().toString(36).substr(2, 9)}`;
    portal.setAttribute("data-floating-ui-portal", "");
    return portal;
  }

  showHandleButtons() {
    this.showRowHandle();
    this.showColumnHandle();
  }

  showRowHandle() {
    if (this.activeButtons.rowHandle) {
      this.activeButtons.rowHandle.remove();
    }

    const portal = this.createPortal("row-handle");
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      transition-property: opacity;
      position: absolute;
      left: 0px;
      top: 0px;
      transform: translate(-7.5px, -66px);
      will-change: transform;
      transition-duration: 250ms;
      pointer-events: auto;
    `;

    const button = this.createHandleButton("row", () => {
      console.log("Row handle clicked");
      this.showRowMenu();
    });

    buttonContainer.appendChild(button);
    portal.appendChild(buttonContainer);

    // Safe to manipulate - outside ProseMirror control!
    this.portalContainer.appendChild(portal);
    this.activeButtons.rowHandle = portal;
  }

  showColumnHandle() {
    if (this.activeButtons.columnHandle) {
      this.activeButtons.columnHandle.remove();
    }

    const tableRect = this.originalTable.getBoundingClientRect();
    const portal = this.createPortal("column-handle");
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      transition-property: opacity;
      position: absolute;
      left: 0px;
      top: 0px;
      transform: translate(${tableRect.width - 68}px, -84.5px);
      will-change: transform;
      transition-duration: 250ms;
      pointer-events: auto;
    `;

    const button = this.createHandleButton("column", () => {
      console.log("Column handle clicked");
      this.showColumnMenu();
    });

    // Rotate for column handle
    button.style.transform = "rotate(0.25turn)";

    buttonContainer.appendChild(button);
    portal.appendChild(buttonContainer);

    // Safe manipulation!
    this.portalContainer.appendChild(portal);
    this.activeButtons.columnHandle = portal;
  }

  hideExtendButtons() {
    if (this.activeButtons.rowExtend) {
      this.activeButtons.rowExtend.querySelector("div").style.opacity = "0";
    }
    if (this.activeButtons.columnExtend) {
      this.activeButtons.columnExtend.querySelector("div").style.opacity = "0";
    }
  }

  hideAllButtons() {
    Object.values(this.activeButtons).forEach((button) => {
      if (button) {
        button.remove();
      }
    });
    this.activeButtons = {
      rowHandle: null,
      columnHandle: null,
      rowExtend: null,
      columnExtend: null,
    };
  }

  handleMouseMove(e) {
    const tableRect = this.originalTable.getBoundingClientRect();
    const x = e.clientX - tableRect.left;
    const y = e.clientY - tableRect.top;

    // Show extend buttons when near edges
    const edgeThreshold = 20;
    const nearTopEdge = y < edgeThreshold;
    const nearRightEdge = x > tableRect.width - edgeThreshold;

    if (nearTopEdge || nearRightEdge) {
      this.showExtendButtons();
    } else {
      this.hideExtendButtons();
    }
  }

  showExtendButtons() {
    // Implementation similar to handles but for extend buttons
    console.log("Show extend buttons");
  }

  createHandleButton(type, onClick) {
    const button = document.createElement("button");
    button.className =
      "mantine-focus-auto bn-table-handle mantine-Button-root mantine-UnstyledButton-root";
    button.type = "button";
    button.draggable = true;
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.style.setProperty("--button-color", "var(--mantine-color-white)");
    button.setAttribute("data-tabindex", "");
    button.tabIndex = -1;

    button.innerHTML = `
      <span class="mantine-Button-inner">
        <span class="mantine-Button-label">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" data-test="tableHandle" height="24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
          </svg>
        </span>
      </span>
    `;

    button.addEventListener("click", onClick);
    return button;
  }

  // Action methods
  showRowMenu() {
    console.log("Show row menu");
  }

  showColumnMenu() {
    console.log("Show column menu");
  }

  // Public API for external portal manipulation
  addToPortal(element) {
    this.portalContainer.appendChild(element);
  }

  clearPortal() {
    this.portalContainer.innerHTML = "";
  }

  getPortalContainer() {
    return this.portalContainer;
  }

  // Add this test method
  createDraggableTestButton() {
    // Create test button
    const testButton = document.createElement("button");
    testButton.textContent = "Drag Me!";
    testButton.className = "draggable-test-button";
    testButton.style.cssText = `
      position: absolute;
      left: 50px;
      top: 50px;
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: move;
      z-index: 1001;
      font-weight: bold;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      user-select: none;
      pointer-events: auto;
      transition: transform 0.1s ease;
    `;

    // Add hover effect
    testButton.addEventListener("mouseenter", () => {
      testButton.style.transform = "scale(1.1)";
    });

    testButton.addEventListener("mouseleave", () => {
      testButton.style.transform = "scale(1)";
    });

    // Make it draggable
    this.makeDraggable(testButton);

    // Add to safe portal container
    this.portalContainer.appendChild(testButton);

    console.log("Draggable test button added to portal container");
    return testButton;
  }

  makeDraggable(element) {
    let isDragging = false;
    let startX, startY, initialX, initialY;

    element.addEventListener("mousedown", (e) => {
      isDragging = true;

      // Get initial positions
      startX = e.clientX;
      startY = e.clientY;

      // Get current element position
      const rect = element.getBoundingClientRect();
      const containerRect = this.portalContainer.getBoundingClientRect();

      initialX = rect.left - containerRect.left;
      initialY = rect.top - containerRect.top;

      // Visual feedback
      element.style.cursor = "grabbing";
      element.style.transform = "scale(1.1)";
      element.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";

      // Prevent text selection
      e.preventDefault();

      console.log("Drag started", { startX, startY, initialX, initialY });
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      // Calculate new position
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      const newX = initialX + deltaX;
      const newY = initialY + deltaY;

      // Update position
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      // Optional: Show coordinates
      element.textContent = `(${Math.round(newX)}, ${Math.round(newY)})`;
    });

    document.addEventListener("mouseup", () => {
      if (!isDragging) return;

      isDragging = false;

      // Reset visual feedback
      element.style.cursor = "move";
      element.style.transform = "scale(1)";
      element.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
      element.textContent = "Drag Me!";

      console.log("Drag ended");
    });
  }

  // Test method to create multiple buttons
  createMultipleDraggableButtons() {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"];
    const positions = [
      { x: 50, y: 50 },
      { x: 150, y: 80 },
      { x: 250, y: 60 },
      { x: 100, y: 120 },
      { x: 200, y: 140 },
    ];

    positions.forEach((pos, index) => {
      const button = document.createElement("button");
      button.textContent = `Button ${index + 1}`;
      button.style.cssText = `
        position: absolute;
        left: ${pos.x}px;
        top: ${pos.y}px;
        background: ${colors[index]};
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 3px;
        cursor: move;
        z-index: 1001;
        font-size: 12px;
        user-select: none;
        pointer-events: auto;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      `;

      this.makeDraggable(button);
      this.portalContainer.appendChild(button);
    });

    console.log("Multiple draggable buttons created");
  }

  // Cleanup test buttons
  clearTestButtons() {
    const testButtons = this.portalContainer.querySelectorAll(
      ".draggable-test-button, button"
    );
    testButtons.forEach((button) => button.remove());
    console.log("Test buttons cleared");
  }

  // Cleanup
  destroy() {
    this.hideAllButtons();
    // Other cleanup
  }
}
// class MyTableView extends TableView {
//   constructor(node, cellMinWidth, HTMLAttributes, editor) {
//     super(node, cellMinWidth);

//     const blockDiv = document.createElement("div");

//     blockDiv.setAttribute("data-id", node.attrs.id);
//     blockDiv.setAttribute("data-content-type", "table");
//     blockDiv.setAttribute("data-indent-level", node.attrs.indentLevel);
//     blockDiv.setAttribute("data-node-type", "block");
//     blockDiv.className = "block block-table";

//     const contentDiv = document.createElement("div");
//     contentDiv.className = "content content-table";

//     const toolbar = document.createElement("div");
//     toolbar.className = "toolbar";
//     const h2 = document.createElement("h2");
//     h2.textContent = "Title";
//     const toolbarButtonsContainer = document.createElement("div");
//     const button1 = document.createElement("button");
//     const button2 = document.createElement("button");
//     button1.textContent = "button1";
//     button2.textContent = "button2";

//     // FIX
//     const tablePortal = document.createElement("div");
//     tablePortal.className = "table-portal";
//     tablePortal.setAttribute("data-node-type", "table-portal");
//     tablePortal.style.cssText = `
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 0;
//       height: 0;
//       pointer-events: none;
//       z-index: 1000;
//       overflow: visible;
//     `;
//     // FIX

//     contentDiv.append(toolbar);
//     toolbar.append(h2, toolbarButtonsContainer);
//     toolbarButtonsContainer.append(button1, button2);

//     blockDiv.appendChild(contentDiv);
//     // FIX: it was originally this.dom but I changed it to this.table
//     // FIX
//     this.dom.append(tablePortal);
//     // FIX
//     contentDiv.append(this.dom);

//     this.dom = blockDiv;

//     // FIX
//     this.table.addEventListener("mouseenter", (e) => {
//       const { tr } = editor.state;
//       const { dispatch } = editor.view;
//     });
//     // FIX

//     // TODO
//     this.table.addEventListener("mousemove", (e) => {
//       const { tr } = editor.state;
//       const { dispatch } = editor.view;

//       const table = e.target.closest("table");
//       const cell = e.target.closest("td, th");
//       const tablePos = editor.view.posAtDOM(table);
//       const cellPos = editor.view.posAtDOM(cell);
//       const tablePortalPos = editor.view.posAtDOM(tablePortal);

//       if (table && cell) {
//         tr.setMeta("tableCoords", {
//           table,
//           tablePos,
//           cell,
//           cellPos,
//           tablePortalPos,
//           width: cell.offsetWidth,
//           height: cell.offsetHeight,
//           left: cell.offsetLeft,
//           top: cell.offsetTop,
//         });

//         dispatch(tr);
//       }
//     });
//     // TODO

//     // TODO
//     this.table.addEventListener("mouseleave", (e) => {
//       const { tr } = editor.state;
//       const { dispatch } = editor.view;

//       tr.setMeta("tableCoords", "moved out");
//       dispatch(tr);
//     });
//     // TODO
//     // IDEA:
//   }
// }

export default MyTableView;

// applyAttributes(HTMLAttributes) {
//   Object.entries(HTMLAttributes).forEach(([key, value]) => {
//     this.dom.setAttribute(key, String(value));
//   });
// }

// update(node) {
//   if (!super.update(node)) return false;

//   const HTMLAttributes = {};
//   if (node.attrs.contentType)
//     HTMLAttributes["data-content-type"] = node.attrs.contentType;
//   if (node.attrs.indentLevel)
//     HTMLAttributes["data-indent-level"] = node.attrs.indentLevel;
//   if (node.attrs.nodeType)
//     HTMLAttributes["data-node-type"] = node.attrs.nodeType;

//   this.applyAttributes(HTMLAttributes);

//   return true;
// }

// destroy() {
//   console.log("DESTROY");
// }
