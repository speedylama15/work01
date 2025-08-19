import { mergeAttributes, Node } from "@tiptap/core";

const name = "tableCell";

const TableCell = Node.create({
  name,
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight",
  group: "tableCell",
  content: "inline*",

  addAttributes() {
    return {
      contentType: {
        default: name,
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      nodeType: {
        default: "cell",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },

  parseHTML() {
    return [
      { tag: `div[data-content-type="${name}"]` },
      { tag: "td" },
      { tag: "th" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["td", mergeAttributes(HTMLAttributes), 0];
  },
});

export default TableCell;
