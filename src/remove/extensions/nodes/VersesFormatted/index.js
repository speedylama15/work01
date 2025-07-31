import { Node, mergeAttributes } from "@tiptap/core";

const getHasSuperscript = ($from) => {
  let hasSuperscript = false;
  const marks = $from.marks();

  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i];

    if (mark.type.name === "superscript") {
      hasSuperscript = true;

      break;
    }
  }

  return hasSuperscript;
};

const name = "versesFormatted";

const VersesFormatted = Node.create({
  name,
  group: "block",
  content: "inline*",
  marks: "bold italic highlight superscript",
  whitespace: "pre",
  defining: true,
  priority: 100,

  addOptions() {
    return {
      blockAttrs: { class: `block block-${name}` },
      decoratorAttrs: {
        class: `decorator decorator-${name}`,
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: `content content-${name}`,
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [];
  },

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { $from } = editor.state.selection;

        let hasSuperscript = getHasSuperscript($from);

        if (hasSuperscript) {
          editor.commands.unsetSuperscript();

          return true;
        }

        return false;
      },

      Enter: ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);
        let hasSuperscript = getHasSuperscript($from);

        if (hasSuperscript) {
          editor.commands.unsetSuperscript();

          return true;
        }

        if (node.type.name === name) {
          editor.commands.insertContent("\n");

          return true;
        }

        return false;
      },

      "Mod-Enter": ({ editor }) => {
        console.log("TRYING TO BREAK OUT");

        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);
        const after = $from.after($from.depth);

        if (node.type.name === name) {
          editor.commands.insertContentAt(after, { type: "paragraph" });

          return true;
        }

        return false;
      },

      "Shift-^": ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) {
          editor.commands.toggleSuperscript();

          return true;
        }

        return false;
      },
    };
  },

  addAttributes() {
    return {
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      contentType: {
        default: `${name}`,
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
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

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        [
          "div",
          this.options.contentAttrs,
          [
            "span",
            { "data-verse-number": HTMLAttributes["data-verse-number"] },
            0,
          ],
        ],
      ],
    ];
  },
});

export default VersesFormatted;
