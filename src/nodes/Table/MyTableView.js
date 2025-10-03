import { TableView } from "@tiptap/extension-table";
import { computePosition, autoUpdate } from "@floating-ui/dom";
import debounce from "lodash.debounce";
import { CellSelection } from "@tiptap/pm/tables";

import { getNearestBlockDepth } from "../../utils";

// FIX: make sure to add contenteditable=false
// FIX: need trailing node
// FIX: not sure what event listeners I need to use for clicking the resizing, row, column buttons and cell button
// IDEA: contenteditable=false
// IDEA: Enter that involves Table should do nothing
// IDEA: manual multi selection -> backspace -> empty the celss
// IDEA: click on row or column multi selection button -> backspace -> delete row/column
// IDEA: manual multi select -> Enter -> nothing
// IDEA: table node selection -> Enter -> Text Selection goes to the first cell
// IDEA: multi select that includes the Table -> enter -> do nothing
// cleanup

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

  createToolbar(editor) {
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
    toolbar.append(h2, toolbarButtonsContainer);
    toolbarButtonsContainer.append(button1, button2);

    // FIX
    button1.addEventListener("click", () => {
      return editor.commands.addColumnAfter();
    });

    return toolbar;
  }

  // FIX: clean up?
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

    // FIX: later
    const toolbar = this.createToolbar(editor);
    // FIX: later

    contentDiv.append(toolbar);

    blockDiv.appendChild(contentDiv);
    contentDiv.append(this.dom);

    this.dom = blockDiv;

    // FIX
    const columnButton = this.createColumnButton();
    const rowButton = this.createRowButton();
    const overlayBox = document.createElement("div");
    overlayBox.contentEditable = false;
    overlayBox.className = "overlay-box";
    overlayBox.style.display = "none";
    overlayBox.style.position = "absolute";
    overlayBox.style.pointerEvents = "none";
    overlayBox.style.border = "3px solid blue";
    overlayBox.append(columnButton);
    overlayBox.append(rowButton);
    this.table.append(overlayBox);
    // FIX

    // TODO
    let headDOM = null;
    let anchorDOM = null;
    // TODO

    // TODO
    editor.on("selectionUpdate", () => {
      const { selection } = editor.state;
      const { $from } = selection;

      const { depth } = getNearestBlockDepth($from);
      const node = $from.node(depth);
      const before = $from.before(depth);

      // if non-CellSelection has been made, then reset the variable
      headDOM = null;
      anchorDOM = null;
      overlayBox.style.display = "none";

      if (selection instanceof CellSelection) {
        const headPos = selection.$headCell.pos;
        const anchorPos = selection.$anchorCell.pos;
        headDOM = editor.view.nodeDOM(headPos);

        if (!anchorDOM) {
          anchorDOM = editor.view.nodeDOM(anchorPos);
        }

        const top = Math.min(anchorDOM.offsetTop, headDOM.offsetTop);
        const left = Math.min(anchorDOM.offsetLeft, headDOM.offsetLeft);
        const bottom = Math.max(
          anchorDOM.offsetTop + anchorDOM.offsetHeight,
          headDOM.offsetTop + headDOM.offsetHeight
        );
        const right = Math.max(
          anchorDOM.offsetLeft + anchorDOM.offsetWidth,
          headDOM.offsetLeft + headDOM.offsetWidth
        );

        overlayBox.style.display = "block";
        overlayBox.style.top = `${top}px`;
        overlayBox.style.left = `${left}px`;
        overlayBox.style.width = `${right - left}px`;
        overlayBox.style.height = `${bottom - top}px`;

        return;
      }

      if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
        headDOM = editor.view.nodeDOM(before);

        console.log("Head DOM", node.type.name, headDOM);

        const top = headDOM.offsetTop;
        const left = headDOM.offsetLeft;
        const width = headDOM.offsetWidth;
        const height = headDOM.offsetHeight;

        overlayBox.style.display = "block";
        overlayBox.style.top = `${top}px`;
        overlayBox.style.left = `${left}px`;
        overlayBox.style.width = `${width}px`;
        overlayBox.style.height = `${height}px`;

        return;
      }
    });
    // TODO

    // TODO
    const mutationObserver = new MutationObserver((mutations) => {
      const { $from, from, to } = editor.state.selection;

      if (!from) return;

      // REVIEW: got to be aware of cell's contents and make them NOT a block but tableItem
      const { depth } = getNearestBlockDepth($from);
      const node = $from.node(depth);

      if (node.type.name !== "tableCell" && node.type.name !== "tableHeader")
        return;

      mutations.forEach((mutation) => {
        const table = mutation.target;

        const headDOMID = headDOM.getAttribute("data-id");
        const anchorDOMID = anchorDOM?.getAttribute("data-id");

        if (headDOM && !anchorDOM) {
          const { offsetTop, offsetHeight, offsetWidth, offsetLeft } =
            table.querySelector(`[data-id="${headDOMID}"]`);

          overlayBox.style.display = "block";
          overlayBox.style.top = `${offsetTop}px`;
          overlayBox.style.left = `${offsetLeft}px`;
          overlayBox.style.width = `${offsetWidth}px`;
          overlayBox.style.height = `${offsetHeight}px`;

          return;
        }

        if (headDOM && anchorDOM) {
          const headDOM = table.querySelector(`[data-id="${headDOMID}"]`);
          const anchorDOM = table.querySelector(`[data-id="${anchorDOMID}"]`);

          const top = Math.min(anchorDOM.offsetTop, headDOM.offsetTop);
          const left = Math.min(anchorDOM.offsetLeft, headDOM.offsetLeft);
          const bottom = Math.max(
            anchorDOM.offsetTop + anchorDOM.offsetHeight,
            headDOM.offsetTop + headDOM.offsetHeight
          );
          const right = Math.max(
            anchorDOM.offsetLeft + anchorDOM.offsetWidth,
            headDOM.offsetLeft + headDOM.offsetWidth
          );

          overlayBox.style.display = "block";
          overlayBox.style.top = `${top}px`;
          overlayBox.style.left = `${left}px`;
          overlayBox.style.width = `${right - left}px`;
          overlayBox.style.height = `${bottom - top}px`;

          return;
        }
      });
    });
    // TODO

    mutationObserver.observe(this.table, {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
    });
  }
}

export default MyTableView;
