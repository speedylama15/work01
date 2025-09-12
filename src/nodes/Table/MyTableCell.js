import { TableCell } from "@tiptap/extension-table";

const MyTableCell = TableCell.extend({
  content: "myTableParagraph+",
  // content: "block+",
});

export default MyTableCell;
