import { Node, mergeAttributes } from "@tiptap/core";
import mapping from "./constants/mapping";
import getHasSuperscript from "./utils/getHasSuperscript";

const {
  name,
  marks,
  group,
  content,
  whitespace,
  defining,
  priority,
  options,
  attributes,
} = mapping;

const VersesFormatted = Node.create({
  name,
  marks,
  group,
  content,
  whitespace,
  defining,
  priority,

  addOptions() {
    return options;
  },

  addAttributes() {
    return attributes;
  },

  addInputRules() {
    return [
      {
        find: /^```([a-z]+)?[\s\n]$/,
        handler: ({ range, chain, state }) => {
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              indentLevel,
              contentType: name,
              nodeType: "block",
            })
            .run();
        },
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { $from } = editor.state.selection;

        let hasSuperscript = getHasSuperscript($from);

        if (hasSuperscript) return editor.commands.unsetSuperscript();
      },

      Enter: ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        let hasSuperscript = getHasSuperscript($from);

        if (hasSuperscript) return editor.commands.unsetSuperscript();

        if (node.type.name === name) return editor.commands.insertContent("\n");
      },

      "Mod-Enter": ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) {
          const after = $from.after($from.depth);

          return editor.commands.insertContentAt(after, { type: "paragraph" });
        }
      },

      Tab: ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) return editor.commands.insertContent("\t");
      },

      "Shift-^": ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) return editor.commands.toggleSuperscript();
      },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, options.blockAttrs),
      [
        "div",
        options.decoratorAttrs,
        ["div", options.contentAttrs, ["span", {}, 0]],
      ],
    ];
  },
});

export default VersesFormatted;
