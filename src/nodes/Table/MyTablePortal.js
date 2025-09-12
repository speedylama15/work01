import { Node } from "@tiptap/core";

const MyTablePortal = Node.create({
  name: "tablePortal",
  group: "block",
  content: "",
  atom: true,
  selectable: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.table-portal",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        class: "table-portal",
        "data-node-type": "table-portal",
      },
    ];
  },
});

export default MyTablePortal;
