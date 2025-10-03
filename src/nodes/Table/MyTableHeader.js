import { TableHeader } from "@tiptap/extension-table";

const MyTableHeader = TableHeader.extend({
  content: "myTableParagraph+",

  addAttributes() {
    return {
      ...this.parent?.(),
      nodeType: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },
});

export default MyTableHeader;
