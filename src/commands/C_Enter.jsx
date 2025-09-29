import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

import { getNearestBlockDepth } from "../utils";

// REVIEW: this is a utility function
const rangedSplit = (editor) => {
  const { from, to } = editor.state.selection;

  try {
    return editor.commands.splitBlock();
  } catch (error) {
    return editor.commands.deleteRange({ from, to });
  }
};

// IDEA: basic split
// IDEA: advanced split
// IDEA: outdent
// IDEA: reversion

// TODO: for non-text Nodes, Enter must act differently
// TODO: refactor comes later

const C_Enter = Extension.create({
  name: "c_enter",

  addCommands() {
    return {
      // FIX: this needs to go to Paragraph node
      setToParagraph:
        () =>
        ({ editor, dispatch, tr }) => {
          const { $from, from } = editor.state.selection;

          const { depth } = getNearestBlockDepth($from);
          const node = $from.node(depth);
          const before = $from.before(depth);
          const after = before + node.nodeSize;

          const paragraph = editor.schema.nodes.paragraph.create(
            {
              id: node.attrs.id,
              contentType: "paragraph",
              indentLevel: node.attrs.indentLevel,
              nodeType: "block",
            },
            node.content
          );

          tr.replaceWith(before, after, paragraph);
          tr.setSelection(TextSelection.create(tr.doc, from));

          dispatch(tr);

          return true;
        },

      outdentSingleBlock:
        ($from, indentLevel, depth) =>
        ({ dispatch, tr }) => {
          const before = $from.before(depth);

          tr.setNodeAttribute(before, "indentLevel", parseInt(indentLevel) - 1);

          dispatch(tr);

          return true;
        },

      basicSplit:
        (node, $from, depth) =>
        ({ editor, dispatch, tr }) => {
          const name = node.type.name;
          const content = node.content;
          const before = $from.before(depth);
          const after = before + node.nodeSize;
          const start = $from.start(depth);
          const end = $from.end(depth);

          const c1 = content.cut(0, $from.parentOffset);
          const c2 = content.cut($from.parentOffset);

          const newNode = editor.schema.nodes[name].create(
            { ...node.attrs, id: uuidv4() },
            c2
          );

          tr.insert(tr.mapping.map(after), newNode);
          tr.replaceWith(start, end, c1);
          tr.setSelection(
            TextSelection.create(tr.doc, tr.mapping.map(after, -1) + 1)
          );

          dispatch(tr);

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { $from, from, to } = editor.state.selection;

        const { depth } = getNearestBlockDepth($from);
        const node = $from.node(depth);

        if (!node || depth === 0) return true;

        // REVIEW: Table related Nodes do not have this attribute
        // REVIEW: therefore, Enter will do NOTHING for those Nodes
        if (!node.attrs.indentLevel && node.attrs.indentLevel !== 0) {
          return true;
        }

        if (from === to) {
          const childCount = node.childCount;
          const indentLevel = parseInt(node.attrs.indentLevel);
          const parentOffset = $from.parentOffset;

          // IDEA: outdent
          if (childCount === 0 && parentOffset === 0 && indentLevel > 0) {
            return editor.commands.outdentSingleBlock(
              $from,
              indentLevel,
              depth
            );
          }

          // IDEA: reversion
          if (
            childCount === 0 &&
            parentOffset === 0 &&
            indentLevel === 0 &&
            node.type.name !== "paragraph"
          ) {
            return editor.commands.setToParagraph();
          }

          // IDEA: basicSplit
          return editor.commands.basicSplit(node, $from, depth);
        }

        // IDEA: rangedSplit
        if (from !== to) return rangedSplit(editor);
      },
    };
  },
});

export default C_Enter;
