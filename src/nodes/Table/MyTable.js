import { Table } from "@tiptap/extension-table";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { computePosition, autoUpdate } from "@floating-ui/dom";

import MyTableView from "./MyTableView";

const name = "table";
const myTablePluginKey = new PluginKey("myTablePlugin");

const MyTablePlugin = () => {
  return new Plugin({
    key: myTablePluginKey,

    state: {
      init() {
        return null;
      },

      apply(tr, value, oldState, newState) {
        // REVIEW: the user has to move out of the table which will guarantee a return of "moved out"
        const tableCoords = tr.getMeta("tableCoords");

        let result;

        if (tableCoords === "moved out") {
          result = null;
        } else if (tableCoords) {
          result = tableCoords;
        } else if (value) {
          result = value;
        } else {
          result = null;
        }

        return result;
      },
    },

    props: {
      decorations(state) {
        const data = myTablePluginKey.getState(state);

        // FIX
        // console.log(data);

        if (data) {
          const { tablePos, tablePortalPos, width, height, top, left } = data;
          const x = width / 2 + left;
          const y = height / 2 + top;

          console.log(tablePortalPos);

          const columnButtonWidget = Decoration.widget(tablePortalPos, () => {
            const columnButton = document.createElement("button");
            columnButton.style.backgroundColor = "purple";
            columnButton.style.position = "absolute";
            columnButton.textContent = "column";
            columnButton.style.top = "0px";
            columnButton.style.left = x + "px";
            columnButton.style.zIndex = "1000";
            columnButton.style.fontSize = "12px";
            return columnButton;
          });

          const rowButtonWidget = Decoration.widget(tablePortalPos, () => {
            const rowButton = document.createElement("button");
            rowButton.style.backgroundColor = "purple";
            rowButton.style.position = "absolute";
            rowButton.textContent = "column";
            rowButton.style.top = y + "px";
            rowButton.style.left = "0px";
            rowButton.style.zIndex = "1000";
            rowButton.style.fontSize = "12px";
            return rowButton;
          });

          return DecorationSet.create(state.doc, [
            columnButtonWidget,
            rowButtonWidget,
          ]);
        }

        return DecorationSet.create(state.doc, []);
      },
    },
  });
};

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
    return [...this.parent?.(), MyTablePlugin()];
  },

  parseHTML() {
    return [{ tag: "table" }, { tag: "div.tableWrapper" }];
  },
});

export default MyTable;
