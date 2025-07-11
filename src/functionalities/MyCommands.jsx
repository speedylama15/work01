import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

import { traverseDoc } from "../utils";

const MyCommands = Extension.create({
  name: "myCommands",

  addCommands() {
    return {
      splitTextBlock:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state, schema } = editor;
          const { selection } = state;
          const { $from } = selection;
          const { parentOffset } = $from;

          const cNode = $from.node($from.depth);
          const cStart = $from.start($from.depth);
          const cEnd = $from.end($from.depth);
          const cAfter = cEnd + 1;
          const cContent = cNode.content;
          const cContentType = cNode?.attrs?.contentType;

          const top = cContent.cut(0, parentOffset);
          const bottom = cContent.cut(parentOffset);

          const nAttrs =
            cContentType === "checklist"
              ? {
                  ...cNode.attrs,
                  id: uuidv4(),
                  isChecked: false,
                }
              : {
                  ...cNode.attrs,
                  id: uuidv4(),
                };

          const nNode = schema.nodes[cContentType].create(nAttrs, bottom);

          tr.insert(tr.mapping.map(cAfter), nNode);
          tr.replaceWith(cStart, cEnd, top);
          tr.setSelection(
            TextSelection.create(tr.doc, tr.mapping.map(cAfter, -1) + 1)
          );

          dispatch(tr);

          return true;
        },

      setToParagraph:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state, schema } = editor;
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const before = $from.before($from.depth);
          const after = before + node.nodeSize;
          const content = node.content;
          const { id, indentLevel } = node.attrs;

          const attrs = {
            id,
            indentLevel,
            contentType: "paragraph",
            nodeType: "block",
          };

          const nNode = schema.nodes.paragraph.create(attrs, content);

          tr.replaceWith(before, after, nNode);
          tr.setSelection(
            TextSelection.create(tr.doc, tr.mapping.map(before) + 1)
          );

          dispatch(tr);

          return true;
        },

      indentSingleBlock:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const pos = $from.before($from.depth);
          const indentLevel = parseInt(node?.attrs?.indentLevel);

          // IDEA: max is 10
          if (indentLevel === 10) return true;

          tr.setNodeAttribute(pos, "indentLevel", indentLevel + 1);

          dispatch(tr);

          return true;
        },

      indentMultipleBlocks:
        () =>
        ({ editor, tr, dispatch }) => {
          let canExitLoop = false;

          traverseDoc(editor, ({ node, isSelected }, pos) => {
            if (isSelected) canExitLoop = true;
            if (!isSelected && canExitLoop) return true;

            if (isSelected) {
              const indentLevel = parseInt(node?.attrs?.indentLevel);

              if (indentLevel !== 10)
                tr.setNodeAttribute(pos, "indentLevel", indentLevel + 1);
            }
          });

          dispatch(tr);

          return true;
        },

      outdentSingleBlock:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const pos = $from.before($from.depth);
          const indentLevel = parseInt(node?.attrs?.indentLevel);

          if (indentLevel === 0) return true;

          tr.setNodeAttribute(pos, "indentLevel", indentLevel - 1);

          dispatch(tr);

          return true;
        },

      outdentMultipleBlocks:
        () =>
        ({ editor, tr, dispatch }) => {
          let canExitLoop = false;

          traverseDoc(editor, ({ node, isSelected }, pos) => {
            if (isSelected) canExitLoop = true;
            if (!isSelected && canExitLoop) return true;

            if (isSelected) {
              const indentLevel = parseInt(node?.attrs?.indentLevel);

              if (indentLevel !== 0)
                tr.setNodeAttribute(pos, "indentLevel", indentLevel - 1);
            }
          });

          dispatch(tr);

          return true;
        },
    };
  },
});

export default MyCommands;
