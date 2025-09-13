import { TableView } from "@tiptap/extension-table";
import { computePosition, autoUpdate } from "@floating-ui/dom";
import debounce from "lodash.debounce";

// FIX: make sure to add contenteditable=false
// FIX: need trailing node
// FIX: not sure what event listeners I need to use for clicking the resizing, row, column buttons and cell button

class MyTableView extends TableView {
  ignoreMutation() {
    // REVIEW: Ignore all DOM mutations in this node view
    return true;
  }

  createColumnButton() {
    const columnButton = document.createElement("button");

    columnButton.textContent = "⋮";
    columnButton.contentEditable = false;
    columnButton.className = "column-button";

    return columnButton;
  }

  createRowButton() {
    const rowButton = document.createElement("button");

    rowButton.textContent = "⋮";
    rowButton.contentEditable = false;
    rowButton.className = "row-button";

    return rowButton;
  }

  constructor(node, cellMinWidth, HTMLAttributes, editor) {
    super(node, cellMinWidth);

    const blockDiv = document.createElement("div");

    blockDiv.setAttribute("data-id", node.attrs.id);
    blockDiv.setAttribute("data-content-type", "table");
    blockDiv.setAttribute("data-indent-level", node.attrs.indentLevel);
    blockDiv.setAttribute("data-node-type", "block");
    blockDiv.className = "block block-table";

    const contentDiv = document.createElement("div");
    contentDiv.className = "content content-table";

    // FIX
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    const h2 = document.createElement("h2");
    h2.textContent = "Title";
    h2.contentEditable = false;
    const toolbarButtonsContainer = document.createElement("div");
    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    button1.textContent = "button1";
    button1.contentEditable = false;
    button2.textContent = "button2";
    button2.contentEditable = false;
    // FIX

    contentDiv.append(toolbar);
    toolbar.append(h2, toolbarButtonsContainer);
    toolbarButtonsContainer.append(button1, button2);

    blockDiv.appendChild(contentDiv);
    contentDiv.append(this.dom);

    this.dom = blockDiv;

    const columnButton = this.createColumnButton();
    const rowButton = this.createRowButton();
    this.table.append(columnButton);
    this.table.append(rowButton);

    // IDEA
    this.table.addEventListener("click", (e) => {
      const cell = e.target.closest("td, th");

      if (cell) {
        columnButton.style.display = "block";
        rowButton.style.display = "block";

        // computePosition(cell, columnButton, {
        //   placement: "top",
        // }).then(({ x, y }) => {
        //   Object.assign(columnButton.style, {
        //     left: `${x}px`,
        //     top: `${y}px`,
        //   });
        // });

        // computePosition(cell, rowButton, {
        //   placement: "left",
        // }).then(({ x, y }) => {
        //   Object.assign(rowButton.style, {
        //     left: `${x}px`,
        //     top: `${y}px`,
        //   });
        // });

        const cleanupColumn = autoUpdate(cell, columnButton, () => {
          computePosition(cell, columnButton, {
            placement: "top",
          }).then(({ x, y }) => {
            Object.assign(columnButton.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });
        });

        // Row button with autoUpdate
        const cleanupRow = autoUpdate(cell, rowButton, () => {
          computePosition(cell, rowButton, {
            placement: "left",
          }).then(({ x, y }) => {
            Object.assign(rowButton.style, {
              left: `${x}px`,
              top: `${y}px`,
            });
          });
        });
      }
    });

    this.table.addEventListener("mouseenter", (e) => {});
    this.table.addEventListener("mouseleave", (e) => {});
    // IDEA:
  }
}

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
