import { Node, mergeAttributes } from "@tiptap/core";

const Paragraph = Node.create({
  name: "paragraph",
  group: "block",
  content: "inline*",
  // FIX: add more marks later
  marks: "bold italic underline superscript highlight",

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
        }),
      },
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
      mergeAttributes(HTMLAttributes, {
        class: "block block-paragraph",
      }),
      [
        "div",
        {
          class: "content content-paragraph",
          // FIX: do I need this for the content div node?
          "data-content-type": "paragraph",
          "data-node-type": "content",
        },
        ["p", {}, 0],
      ],
    ];
  },
});

export default Paragraph;
