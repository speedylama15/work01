import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

import { getNearestBlockDepth } from "../utils";

// FIX: handle table later
// FIX: handle collection later

const C_Tab = Extension.create({
  name: "c_tab",

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        const { $from, from, to } = editor.state.selection;
        const { tr } = editor.state;
        const { dispatch } = editor.view;

        if (from === to) {
          const { depth } = getNearestBlockDepth($from);
          const node = $from.node(depth);
          const before = $from.before(depth);

          if (!node) return true;

          const { indentLevel } = node.attrs;

          if (parseInt(indentLevel) >= 10) return true;

          tr.setNodeAttribute(before, "indentLevel", parseInt(indentLevel) + 1);

          dispatch(tr);

          return true;
        }

        if (from !== to) {
          editor.state.doc.nodesBetween(from, to, (node, pos) => {
            // FIX: check if the node has indentLevel attribute
            if (parseInt(node.attrs.indentLevel) < 10)
              tr.setNodeAttribute(
                pos,
                "indentLevel",
                parseInt(node.attrs.indentLevel) + 1
              );
          });

          dispatch(tr);

          return true;
        }

        return true;
      },

      "Shift-Tab": ({ editor }) => {
        const { $from, from, to } = editor.state.selection;
        const { tr } = editor.state;
        const { dispatch } = editor.view;

        if (from === to) {
          const { depth } = getNearestBlockDepth($from);
          const node = $from.node(depth);
          const before = $from.before(depth);

          if (!node) return true;

          const { indentLevel } = node.attrs;

          if (parseInt(indentLevel) <= 0) return true;

          tr.setNodeAttribute(before, "indentLevel", parseInt(indentLevel) - 1);

          dispatch(tr);

          return true;
        }

        if (from !== to) {
          editor.state.doc.nodesBetween(from, to, (node, pos) => {
            // FIX: check if the node has indentLevel attribute
            if (parseInt(node.attrs.indentLevel) > 0)
              tr.setNodeAttribute(
                pos,
                "indentLevel",
                parseInt(node.attrs.indentLevel) - 1
              );
          });

          dispatch(tr);

          return true;
        }
      },
    };
  },
});

export default C_Tab;
