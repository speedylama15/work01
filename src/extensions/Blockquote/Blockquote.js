import { Node, mergeAttributes } from "@tiptap/core";
import mapping from "./constants/mapping";

// FIX
// FIX: maybe when I backspace or undo something, I should revert it back to what it was?

const { name, marks, group, content, defining, options, attributes } = mapping;

const Blockquote = Node.create({
  name,
  marks,
  group,
  content,
  defining,

  addOptions() {
    return options;
  },

  addAttributes() {
    return attributes;
  },

  addInputRules() {
    return [
      {
        find: /^\s*>\s$/,
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
        ["div", options.contentAttrs, ["blockquote", {}, 0]],
      ],
    ];
  },
});

export default Blockquote;
