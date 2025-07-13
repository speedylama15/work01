import { Node, mergeAttributes } from "@tiptap/core";

const Blockquote = Node.create({
  name: "blockquote",
  group: "block",
  content: "inline*",
  // FIX: add more marks later
  marks: "bold italic underline superscript highlight",
  draggable: true,

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
      mergeAttributes(HTMLAttributes, {
        class: "block block-blockquote",
      }),
      [
        "div",
        {
          class: "decorator decorator-blockquote",
          "data-node-type": "content",
        },
        [
          "div",
          {
            class: "content content-blockquote",
            "data-node-type": "content",
          },
          ["blockquote", {}, 0],
        ],
      ],
    ];
  },
});

export default Blockquote;
