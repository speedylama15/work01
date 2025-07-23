import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";

const Heading2 = Node.create({
  name: "heading2",
  group: "block heading",
  content: "inline*",
  marks: "italic underline highlight",
  defining: true,

  addOptions() {
    return {
      blockAttrs: { class: "block block-heading2" },
      decoratorAttrs: {
        class: "decorator decorator-heading2",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-heading2",
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: new RegExp(`^(#{2})\\s$`),
        type: this.type,
        getAttributes: {
          indentLevel: 0,
          contentType: "heading2",
          nodeType: "block",
        },
      }),
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
        default: "heading2",
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
    return [{ tag: 'div[data-content-type="heading2"]' }, { tag: "h2" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        ["div", this.options.contentAttrs, ["h2", {}, 0]],
      ],
    ];
  },
});

export default Heading2;
