import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

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

          const nAttrs = {
            ...cNode.attrs,
            id: uuidv4(),
          };
          if (cContentType === "numberedList")
            nAttrs.startNumber = parseInt(cNode.attrs.startNumber) + 1;
          const nNode = schema.nodes[cContentType].create(nAttrs, bottom);

          tr.insert(tr.mapping.map(cAfter), nNode);
          tr.replaceWith(cStart, cEnd, top);
          tr.setSelection(
            TextSelection.create(tr.doc, tr.mapping.map(cAfter, -1) + 1)
          );

          dispatch(tr);

          return true;
        },

      // FIX: change name?
      setBlockToParagraph:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state, schema } = editor;
          const { selection } = state;
          const { $from } = selection;

          const cNode = $from.node($from.depth);
          const cBefore = $from.before($from.depth);
          const cAfter = cBefore + cNode.nodeSize;
          const cContent = cNode.content;
          const { id, indentLevel } = cNode.attrs;
          const nAttrs = {
            id,
            indentLevel,
            contentType: "paragraph",
            nodeType: "block",
          };
          const nNode = schema.nodes.paragraph.create(nAttrs, cContent);

          tr.replaceWith(cBefore, cAfter, nNode);
          tr.setSelection(
            TextSelection.create(tr.doc, tr.mapping.map(cBefore) + 1)
          );

          dispatch(tr);

          return true;
        },

      indentBlock:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          const cNode = $from.node($from.depth);
          const cBefore = $from.before($from.depth);
          const cIndentLevel = parseInt(cNode?.attrs?.indentLevel);

          if (cIndentLevel === 7) return true;

          const pIndentLevel = cIndentLevel;
          const nIndentLevel = parseInt(pIndentLevel) + 1;

          tr.setNodeAttribute(cBefore, "indentLevel", nIndentLevel);

          // const resolvedPos = tr.doc.resolve(cBefore);
          // const { nodeBefore } = resolvedPos;
          // const startIndex = resolvedPos.index();
          // let pos = cBefore;
          // let nStartNumber = null;

          // if (
          //   nodeBefore &&
          //   parseInt(nodeBefore.attrs.indentLevel) === nIndentLevel
          // ) {
          //   nStartNumber = parseInt(nodeBefore.attrs.startNumber) + 1;
          // } else {
          //   nStartNumber = 1;
          // }

          // tr.setNodeAttribute(cBefore, "startNumber", nStartNumber);

          // let didBreakout = false;
          // let cStartNumber = parseInt(cNode?.attrs?.startNumber);

          // for (let i = startIndex + 1; i < tr.doc.children.length; i++) {
          //   const node = tr.doc.children[i];
          //   pos = pos + node.nodeSize;
          //   const indentLevel = parseInt(node?.attrs?.indentLevel);
          //   const contentType = node?.attrs?.contentType;

          //   if (indentLevel < pIndentLevel) break;
          //   if (contentType !== "numberedList" && indentLevel === pIndentLevel)
          //     break;
          //   if (indentLevel < nIndentLevel) didBreakout = true;
          //   if (!didBreakout && indentLevel === nIndentLevel) {
          //     nStartNumber++;

          //     tr.setNodeAttribute(pos, "startNumber", nStartNumber);
          //   }

          //   if (indentLevel === pIndentLevel) {
          //     tr.setNodeAttribute(pos, "startNumber", cStartNumber);

          //     cStartNumber++;
          //   }
          // }

          dispatch(tr);

          return true;
        },

      outdentBlock:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          const cNode = $from.node($from.depth);
          const cBefore = $from.before($from.depth);
          const { indentLevel } = cNode.attrs;

          if (indentLevel === 0) return true;

          tr.setNodeAttribute(
            cBefore,
            "indentLevel",
            parseInt(indentLevel) - 1
          );

          dispatch(tr);

          return true;
        },
    };
  },
});

export default MyCommands;
