import { Table } from "@tiptap/extension-table";

import MyTableView from "./MyTableView";

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
    return (params) => {
      const { node, HTMLAttributes, editor } = params;

      return new MyTableView(
        node,
        this.options.cellMinWidth,
        HTMLAttributes,
        editor
      );
    };
  },

  addKeyboardShortcuts() {
    return {
      // FIX
      "=": ({ editor }) => {
        return editor
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 7, withHeaderRow: true })
          .run();
      },

      // FIX
      Tab: ({ editor }) => {
        return editor.commands.updateAttributes("table", {
          indentLevel: 1,
        });
      },

      "/": ({ editor }) => {
        const { $from } = editor.state.selection;
        const node = $from.node($from.depth - 3);

        return editor.commands.deleteNode("table");
      },
    };
  },

  addProseMirrorPlugins() {
    return [...this.parent?.()];
  },

  parseHTML() {
    return [{ tag: "table" }, { tag: "div.tableWrapper" }];
  },
});

export default MyTable;
