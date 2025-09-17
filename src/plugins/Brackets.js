import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";

const getNearestBlockDepth = ($from) => {
  let error = null;
  let depth = 0;

  for (let i = $from.depth; i >= 0; i--) {
    const node = $from.node(i);

    if (!node) {
      error = "something has gone wrong";
      break;
    }

    if (node.attrs.nodeType === "block" || node.type.name === "doc") {
      depth = i;
      break;
    }
  }

  if (error) return { depth: 0, error };

  return { depth };
};

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

      // IDEA: start -> [1]/[john 1:1] -> verse or verse w/ citation
      {
        find: /^\[([^\[\]]+)\] $/,
        handler: ({ state, match, range, chain }) => {
          const regex = /^\d+$/;
          const citation = match[1];
          const isNumber = regex.test(citation);
          const { $from } = state.selection;

          const node = $from.node(getNearestBlockDepth($from).depth);

          if (!node) return;

          if (isNumber) {
            chain()
              .deleteRange(range)
              .setNode("verse", {
                indentLevel: node.attrs.indentLevel,
                contentType: "verse",
                nodeType: "block",
                verseNumber: citation,
              })
              .run();
          } else {
            chain()
              .deleteRange(range)
              .setNode("verseWithCitation", {
                indentLevel: node.attrs.indentLevel,
                contentType: "verseWithCitation",
                nodeType: "block",
                citation,
              })
              .run();
          }
        },
      },

      // IDEA: [1]/[john 1:1] but CANNOT be at start
      {
        find: /(?!^)\[([^\[\]]+)\] /,
        handler: ({ state, match, range, chain }) => {
          const citation = match[1];
          const { selection } = state;
          const { from } = selection;

          console.log("SUPERSCRIPT");

          const superscript = state.schema.text(citation, [
            state.schema.marks.superscript.create(),
          ]);
          const space = state.schema.text(" ");

          chain()
            .insertContentAt(from, superscript)
            .unsetSuperscript()
            .insertContentAt(from + superscript.nodeSize, space)
            .deleteRange(range)
            .run();
        },
      },
      // TODO
    ];
  },
});

export default Brackets;
