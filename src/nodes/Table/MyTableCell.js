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

      const handleMouseDown = (e) => {
        // IDEA: essential
        const isResizing = editor.view.dom.classList.contains("resize-cursor");

        if (isResizing) return;

        const td = e.currentTarget;
        td.classList.add("new-class");

        const { offsetLeft, offsetTop, offsetWidth, offsetHeight } =
          e.currentTarget;

        const tableWrapper = td.closest(".tableWrapper");

        if (tableWrapper) {
          const columnButton = tableWrapper.querySelector(".column-button");
          const rowButton = tableWrapper.querySelector(".row-button");

          columnButton.style.display = "block";
          columnButton.style.top = offsetTop + "px";
          columnButton.style.left = offsetLeft + offsetWidth / 2 + "px";
          rowButton.style.display = "block";
          rowButton.style.top = offsetTop + offsetHeight / 2 + "px";
          rowButton.style.left = offsetLeft + "px";
        }
      };

      td.addEventListener("mousedown", handleMouseDown);

      return {
        dom: td,
        contentDOM: td,
        ignoreMutation() {
          return true;
        },
        stopEvent() {},
        update() {},
        destroy: () => {
          td.removeEventListener("mousedown", handleMouseDown);
        },
      };
    };
  },
});

export default MyTableCell;
