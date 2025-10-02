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
    editor.on("selectionUpdate", () => {
      const { selection } = editor.state;

      if (selection instanceof CellSelection) {
        const headPos = selection.$headCell.pos;
        const cellDom = editor.view.nodeDOM(headPos);

        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = cellDom;

        columnButton.style.display = "block";
        columnButton.style.top = offsetTop + "px";
        columnButton.style.left = offsetLeft + offsetWidth / 2 + "px";
        rowButton.style.display = "block";
        rowButton.style.top = offsetTop + offsetHeight / 2 + "px";
        rowButton.style.left = offsetLeft + "px";
      }
    });
  }
}

export default MyTableView;
