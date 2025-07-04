import { Node, mergeAttributes } from "@tiptap/core";

const Block = Node.create({
  name: "block",
  group: "block",
  content: "blockContent group?",

  addAttributes() {
    return {
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
    return [{ tag: 'div[data-node-type="block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "block",
      }),
      0,
    ];
  },
});

export default Block;
