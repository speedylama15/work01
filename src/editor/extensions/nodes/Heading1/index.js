import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";

// FIX: when enter is pressed, the next node is a paragraph
// FIX: should I let it be able to join?
// FIX: When backspace is pressed when parentOffset is 0, it should not be reverted to a paragraph
const Heading1 = Node.create({
  name: "heading1",
  group: "block heading",
  content: "inline*",
  marks: "italic underline highlight",
  defining: true,

  addOptions() {
    return {
      blockAttrs: { class: "block block-heading1" },
      decoratorAttrs: {
        class: "decorator decorator-heading1",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-heading1",
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: new RegExp(`^(#{1})\\s$`),
        type: this.type,
        getAttributes: {
          indentLevel: 0,
          contentType: "heading1",
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
        default: "heading1",
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
    return [{ tag: 'div[data-content-type="heading1"]' }, { tag: "h1" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        ["div", this.options.contentAttrs, ["h1", {}, 0]],
      ],
    ];
  },
});

export default Heading1;
