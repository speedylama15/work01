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

  createToolbar() {
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
    const toolbar = this.createToolbar();
    // FIX: later

    contentDiv.append(toolbar);

    blockDiv.appendChild(contentDiv);
    contentDiv.append(this.dom);

    this.dom = blockDiv;

    const columnButton = this.createColumnButton();
    const rowButton = this.createRowButton();
    this.table.append(columnButton);
    this.table.append(rowButton);

    // FIX
    const overlayBox = document.createElement("div");
    overlayBox.contentEditable = false;
    overlayBox.className = "overlay-box";
    overlayBox.style.display = "none";
    overlayBox.style.position = "absolute";
    overlayBox.style.pointerEvents = "none";
    this.table.append(overlayBox);
    // FIX

    const mutationObserver = new MutationObserver((mutations) => {
      const { $from, from, to } = editor.state.selection;

      console.log("test", editor.state.selection instanceof CellSelection);

      if (!from) return;

      // TODO: got to be aware of cell's contents and make them NOT a block but tableItem
      const { depth } = getNearestBlockDepth($from);
      const node = $from.node(depth);

      if (node.type.name !== "tableCell") return;

      mutations.forEach((mutation) => {
        const table = mutation.target;

        const columnButton = table.querySelector(".column-button");
        const rowButton = table.querySelector(".row-button");

        const start = $from.start(depth);
        const dom = editor.view.domAtPos(start);
        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = dom.node;

        columnButton.style.display = "block";
        columnButton.style.top = offsetTop + "px";
        columnButton.style.left = offsetLeft + offsetWidth / 2 + "px";
        rowButton.style.display = "block";
        rowButton.style.top = offsetTop + offsetHeight / 2 + "px";
        rowButton.style.left = offsetLeft + "px";
      });
    });

    mutationObserver.observe(this.table, {
      attributes: true,
      attributeFilter: ["style"],
      attributeOldValue: true,
    });

    // IDEA: maybe I can make use of CellSelection for click operations and hiding of btn?
    // IDEA: I can also use this for backspace or Enter and make sure that nothing happens
    let anchorDOM = null;

    editor.on("selectionUpdate", () => {
      const { selection } = editor.state;

      console.log("SELECTION", selection);

      // if non-CellSelection has been made, then reset the variable
      anchorDOM = null;
      overlayBox.style.display = "none";

      if (selection instanceof CellSelection) {
        const headPos = selection.$headCell.pos;
        const anchorPos = selection.$anchorCell.pos;
        const headDOM = editor.view.nodeDOM(headPos);

        if (!anchorDOM) {
          anchorDOM = editor.view.nodeDOM(anchorPos);
        }

        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = headDOM;

        columnButton.style.display = "block";
        columnButton.style.top = offsetTop + "px";
        columnButton.style.left = offsetLeft + offsetWidth / 2 + "px";
        rowButton.style.display = "block";
        rowButton.style.top = offsetTop + offsetHeight / 2 + "px";
        rowButton.style.left = offsetLeft + "px";

        // debug
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
        overlayBox.style.border = "3px solid blue";
        // debug
      }
    });
  }
}

export default MyTableView;
