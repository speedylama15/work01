import { TableCell } from "@tiptap/extension-table";
import { autoUpdate, computePosition } from "@floating-ui/dom";

// content: "block+",

const MyTableCell = TableCell.extend({
  content: "myTableParagraph+",

  addNodeView() {
    return (params) => {
      // IDEA: many different things inside
      // console.log(params);

      const { HTMLAttributes, editor } = params;

      const td = document.createElement("td");
      td.className = "my-table-cell";

      // REVIEW: essential
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value === null) return;

        td.setAttribute(key, value);
      });

      // TODO:
      let cleanup = () => {};

      const handleClick = (e) => {
        // IDEA: this is super important
        const isResizing = editor.view.dom.classList.contains("resize-cursor");
        if (isResizing) return;

        const td = e.currentTarget;

        const tableWrapper = td.closest(".tableWrapper");

        if (tableWrapper) {
          const columnButton = tableWrapper.querySelector(".column-button");
          const rowButton = tableWrapper.querySelector(".row-button");

          columnButton.style.display = "block";
          cleanup = autoUpdate(td, columnButton, () => {
            computePosition(td, columnButton, {
              placement: "top",
              // middleware: [offset(10), flip(), shift()],
            }).then(({ x, y }) => {
              Object.assign(columnButton.style, {
                left: `${x}px`,
                top: `${y}px`,
              });
            });
          });

          // const { x: wrapperX, y: wrapperY } =
          //   tableWrapper.getBoundingClientRect();
          // const {
          //   x: cellX,
          //   y: cellY,
          //   width,
          //   height,
          // } = td.getBoundingClientRect();

          // const columnLeft = cellX - wrapperX + width / 2;
          // const columnTop = cellY - wrapperY;
          // const rowLeft = cellX - wrapperX;
          // const rowTop = cellY - wrapperY + height / 2;

          // columnButton.style.display = "block";
          // columnButton.style.top = columnTop + "px";
          // columnButton.style.left = columnLeft + "px";
          // rowButton.style.display = "block";
          // rowButton.style.top = rowTop + "px";
          // rowButton.style.left = rowLeft + "px";
        }
      };
      // TODO:

      td.addEventListener("click", handleClick);

      return {
        dom: td,
        contentDOM: td,
        ignoreMutation() {
          return true;
        },
        stopEvent(e) {},
        update(node) {
          // TODO:
          if (node.attrs.colwidth) {
            td.setAttribute("colwidth", node.attrs.colwidth[0]);
          }
        },
        destroy: () => {
          cleanup();
          td.removeEventListener("click", handleClick);
        },
      };
    };
  },
  // TODO
});

export default MyTableCell;
