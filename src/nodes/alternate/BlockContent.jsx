import { Node, mergeAttributes } from "@tiptap/core";

// IDEA: content: '(paragraphBlock|bulletBlock|numberedBlock) group?'
const BlockContent = Node.create({
  name: "blockContent",
  group: "blockContent",
  content: "inline*",
  marks: "bold italic underline superscript highlight",

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
    return [{ tag: 'div[data-node-type="content"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "content",
      }),
      ["p", {}, 0],
    ];
  },
});

export default BlockContent;
