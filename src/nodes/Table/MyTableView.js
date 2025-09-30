import { TableView } from "@tiptap/extension-table";
import { computePosition, autoUpdate } from "@floating-ui/dom";
import debounce from "lodash.debounce";

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
    const toolbar = this.createToolbar();
    // FIX

    contentDiv.append(toolbar);

    blockDiv.appendChild(contentDiv);
    contentDiv.append(this.dom);

    this.dom = blockDiv;

    const columnButton = this.createColumnButton();
    const rowButton = this.createRowButton();
    this.table.append(columnButton);
    this.table.append(rowButton);

    // IDEA:
  }
}

export default MyTableView;
