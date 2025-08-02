import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";

const Divider = Node.create({
  name: "divider",
  group: "block divider",

  addOptions() {
    return {
      blockAttrs: { class: "block block-paragraph" },
      decoratorAttrs: {
        class: "decorator decorator-paragraph",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-paragraph",
        "data-node-type": "content",
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
        default: "divider",
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

  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type,
      }),
    ];
  },

  parseHTML() {
    return [{ tag: 'div[data-content-type="divider"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        ["div", this.options.contentAttrs, ["hr", {}]],
      ],
    ];
  },
  //IDEA
});

export default Divider;
