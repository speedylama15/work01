import { Node, mergeAttributes } from "@tiptap/core";

const BulletList = Node.create({
  name: "bulletList",
  group: "block list",
  content: "inline*",
  marks: "bold italic underline superscript highlight",
  defining: true,

  addOptions() {
    return {
      blockAttrs: { class: "block block-bulletList" },
      decoratorAttrs: {
        class: "decorator decorator-bulletList",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-bulletList",
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [
      {
        find: /^\s*([-+*])\s$/,
        handler: ({ state, range, chain }) => {
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              indentLevel,
              contentType: "bulletList",
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
        default: "bulletList",
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
    return [{ tag: 'div[data-content-type="bulletList"]' }];
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

export default BulletList;
