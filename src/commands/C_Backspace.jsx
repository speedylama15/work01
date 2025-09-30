import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

import { getNearestBlockDepth } from "../utils";

const C_Backspace = Extension.create({
  name: "c_backspace",

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { $from, from, to } = editor.state.selection;
        const { tr } = editor.state;
        const { dispatch } = editor.view;

        if (from === to) {
          const { depth } = getNearestBlockDepth($from);
          const node = $from.node(depth);
          const indentLevel = parseInt(node.attrs.indentLevel);
          const parentOffset = $from.parentOffset;

          if (parentOffset === 0 && node.type.name !== "paragraph") {
            return editor.commands.setToParagraph();
          }

          if (indentLevel > 0 && parentOffset === 0) {
            return editor.commands.outdentSingleBlock(
              $from,
              indentLevel,
              depth
            );
          }

          if (node.type.name === "paragraph" && indentLevel === 0) {
            // TODO: maybe implement a command in which combines the contents?
            return editor.commands.joinTextblockForward();
          }
        }

        if (from !== to) {
          // editor.state.doc.nodesBetween(from, to, (node, pos) => {
          //   console.log({
          //     name: node.type.name,
          //     content: node.textContent,
          //     pos,
          //   });
          // });

          return true;
        }
      },
    };
  },
});

export default C_Backspace;
