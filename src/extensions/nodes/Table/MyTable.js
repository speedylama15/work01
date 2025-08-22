import { Table, TableView } from "@tiptap/extension-table";

export class CustomTableView extends TableView {
  constructor(node, cellMinWidth) {
    super(node, cellMinWidth);

    const blockDiv = document.createElement("div");

    blockDiv.setAttribute("data-id", node.attrs.id);
    blockDiv.setAttribute("data-content-type", "table");
    blockDiv.setAttribute("data-indent-level", node.attrs.indentLevel);
    blockDiv.setAttribute("data-node-type", "block");
    blockDiv.className = "block block-table";

    const contentDiv = document.createElement("div");
    contentDiv.className = "content content-paragraph";

    blockDiv.appendChild(contentDiv);
    contentDiv.appendChild(this.dom);

    this.dom = blockDiv;
  }

  applyAttributes(HTMLAttributes) {
    Object.entries(HTMLAttributes).forEach(([key, value]) => {
      this.dom.setAttribute(key, String(value));
    });
  }

  update(node) {
    if (!super.update(node)) return false;

    const HTMLAttributes = {};
    if (node.attrs.contentType)
      HTMLAttributes["data-content-type"] = node.attrs.contentType;
    if (node.attrs.indentLevel)
      HTMLAttributes["data-indent-level"] = node.attrs.indentLevel;
    if (node.attrs.nodeType)
      HTMLAttributes["data-node-type"] = node.attrs.nodeType;

    this.applyAttributes(HTMLAttributes);

    return true;
  }
}

const name = "table";

const MyTable = Table.extend({
  addAttributes() {
    return {
      contentType: {
        default: name,
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      nodeType: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      return new CustomTableView(
        node,
        this.options.cellMinWidth,
        HTMLAttributes
      );
    };
  },

  addKeyboardShortcuts() {
    return {
      ".": ({ editor }) => {
        return editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run();
      },

      "/": ({ editor }) => {
        console.log(editor.getHTML());
      },

      Tab: ({ editor }) => {
        console.log(editor.getAttributes("table"));

        return editor.commands.updateAttributes("table", {
          indentLevel: 1,
        });
      },
    };
  },

  parseHTML() {
    return [{ tag: "table" }, { tag: "div.tableWrapper" }];
  },
});

export default MyTable;
