import { mergeAttributes, Node } from "@tiptap/core";

const name = "tableRow";

const TableRow = Node.create({
  name,
  group: "tableRow",
  content: "tableCell*",

  addOptions() {
    return {
      blockAttrs: { class: `block block-${name}` },
      contentAttrs: {
        class: `content content-${name}`,
      },
    };
  },

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
        default: "row",
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
      { tag: "tbody" },
      { tag: "thead" },
      { tag: "tr" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["tr", mergeAttributes(HTMLAttributes), 0];
  },
});

export default TableRow;
