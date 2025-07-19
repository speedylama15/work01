import { Node, mergeAttributes } from "@tiptap/core";

const NumberedList = Node.create({
  name: "numberedList",
  group: "block list",
  content: "inline*",
  marks: "bold italic underline superscript highlight",
  defining: true,

  addOptions() {
    return {
      blockAttrs: { class: "block block-numberedList" },
      decoratorAttrs: {
        class: "decorator decorator-numberedList",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-numberedList",
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [
      {
        find: /^(\d+)\.\s$/,
        handler: ({ range, chain, state }) => {
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              indentLevel,
              contentType: "numberedList",
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
        default: "numberedList",
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
    return [{ tag: 'div[data-content-type="numberedList"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        ["div", this.options.contentAttrs, ["p", {}, 0]],
      ],
    ];
  },
});

export default NumberedList;
