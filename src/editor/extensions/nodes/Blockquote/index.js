import { Node, mergeAttributes } from "@tiptap/core";

const Blockquote = Node.create({
  name: "blockquote",
  content: "inline*",
  group: "block quote",
  marks: "bold italic underline superscript highlight strike",
  defining: true,

  addOptions() {
    return {
      blockAttrs: { class: "block block-blockquote" },
      decoratorAttrs: {
        class: "decorator decorator-blockquote",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-blockquote",
        "data-node-type": "content",
      },
    };
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
              contentType: "blockquote",
              nodeType: "block",
            })
            .run();
        },
      },
    ];
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
        default: "blockquote",
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
    return [{ tag: 'div[data-content-type="blockquote"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        ["div", this.options.contentAttrs, ["blockquote", {}, 0]],
      ],
    ];
  },
});

export default Blockquote;
