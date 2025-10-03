import { TableCell } from "@tiptap/extension-table";
import { autoUpdate, computePosition, shift } from "@floating-ui/dom";
import { getNearestBlockDepth } from "../../utils";

const MyTableCell = TableCell.extend({
  content: "myTableParagraph+",
  // content: "block+",

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

  addNodeView() {
    return (params) => {
      const { HTMLAttributes, editor } = params;

      const td = document.createElement("td");
      td.className = "my-table-cell";

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value === null) return;

        td.setAttribute(key, value);
      });

      return {
        dom: td,
        contentDOM: td,
        ignoreMutation() {
          return true;
        },
        stopEvent() {},
        update() {},
        destroy: () => {},
      };
    };
  },
});

export default MyTableCell;
