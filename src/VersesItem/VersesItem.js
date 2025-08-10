import { mergeAttributes, Node } from "@tiptap/core";

const name = "versesItem";

const VersesItem = Node.create({
  name,
  group: "versesItem",
  marks: "bold italic underline strike highlight superscript",
  content: "inline*",

  addOptions() {
    return {
      itemAttrs: {
        class: `item item-${name}`,
        "data-node-type": `item`,
      },
    };
  },

  addAttributes() {
    return {
      contentType: {
        // IDEA
        default: "verseItem",
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      nodeType: {
        default: "item",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "verse" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "verse",
      mergeAttributes(HTMLAttributes, this.options.itemAttrs),
      0,
    ];
  },
});

export default VersesItem;
