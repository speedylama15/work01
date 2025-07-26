import { Node, mergeAttributes } from "@tiptap/core";

const Paragraph = Node.create({
  name: "paragraph",
  group: "block",
  content: "inline*",
  marks: "bold italic underline superscript highlight inlineQuote",
  defining: true,

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
        default: "paragraph",
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
    return [{ tag: 'div[data-content-type="paragraph"]' }];
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

export default Paragraph;
