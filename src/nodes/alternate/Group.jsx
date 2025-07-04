import { Node, mergeAttributes } from "@tiptap/core";

const Group = Node.create({
  name: "group",
  group: "group",
  content: "block+",

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
    return [{ tag: 'div[data-node-type="group"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "group",
      }),
      0,
    ];
  },
});

export default Group;
