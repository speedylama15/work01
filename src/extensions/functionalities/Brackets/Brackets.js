import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

import { getNearestBlockDepth } from "../../../utils";

const Brackets = Extension.create({
  name: "brackets",

  addInputRules() {
    return [
      // IDEA: to quickly create []
      {
        find: /\[$/,
        handler: ({ state, range }) => {
          const { tr } = state;

          tr.insertText("[]", range.from, range.to);
          tr.setSelection(TextSelection.create(tr.doc, range.from + 1));
          return tr;
        },
      },
      // IDEA: checklist
      {
        find: /^\s*(\[([( |x])?\])\s$/,
        handler: ({ range, chain, state }) => {
          // FIX
          console.log("checklist input rule");
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          chain()
            .deleteRange(range)
            .setNode("checklist", {
              indentLevel,
              contentType: "checklist",
              nodeType: "block",
              isChecked: false,
            })
            .run();
        },
      },
      // IDEA: this checks for [42] and creates <sup/>" "
      {
        find: /\[(\d+)\] $/,
        handler: ({ state, match, range, chain }) => {
          // FIX
          console.log("sup mark input rule");

          const number = match[1];

          const { selection } = state;
          const { from } = selection;

          const text1 = state.schema.text(number, [
            state.schema.marks.superscript.create(),
          ]);
          const text2 = state.schema.text(" ");

          chain()
            .insertContentAt(from, text1)
            .unsetSuperscript()
            .insertContentAt(from + text1.nodeSize, text2)
            .deleteRange(range)
            .run();
        },
      },
      // IDEA: this can generate Verse or VWC
      {
        find: /^\[([^\]]*)\]\[([^\]]*)\] /,
        handler: ({ chain, state, match }) => {
          const c = match[1];
          const v = match[2];
          const numRegex = /^-?\d+\.?\d*$/;
          const isNumber = numRegex.test(c);

          const { $from } = state.selection;
          const node = $from.parent;

          // TODO: probably need a stricter condition
          if (
            node &&
            node.attrs.nodeType === "block" &&
            node.type.name !== "versesCollection"
          ) {
            // FIX
            console.log("Verse or VWC input rule");
            const before = $from.before(getNearestBlockDepth($from));
            const { content } = node;
            const { id, indentLevel } = node.attrs;
            const cutF = c.length + 3;
            const cutT = cutF + v.length;
            const vContent = content.cut(cutF, cutT);
            let rNode = null;

            if (isNumber) {
              const vNode = state.schema.nodes.verse.create(
                {
                  id,
                  indentLevel,
                  verseNumber: c,
                  nodeType: "block",
                  contentType: "verse",
                },
                vContent
              );

              rNode = vNode;
            } else {
              const vwcNode = state.schema.nodes.verseWithCitation.create(
                {
                  id,
                  indentLevel,
                  citation: c,
                  nodeType: "block",
                  contentType: "verseWithCitation",
                },
                vContent
              );

              rNode = vwcNode;
            }

            return chain().insertContentAt(
              {
                from: before,
                to: before + node.nodeSize,
              },
              rNode
            );
          }
        },
      },
    ];
  },
});

export default Brackets;
