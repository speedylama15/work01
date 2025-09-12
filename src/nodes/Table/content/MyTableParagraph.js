import { Node } from "@tiptap/core";

const name = "myTableParagraph";

// FIX: hopefully this does not become an issue
// IDEA: because this is NOT part of block or inline, it can be rendered under one condition
// IDEA: when a node specifically has content type set to this node

const MyTableParagraph = Node.create({
  name,
  // FIX: need add link textStyle
  marks: "bold italic underline strike superscript highlight",
  group: "myTableParagraph",
  content: "inline*",
  priority: 200,

  parseHTML() {
    return [{ tag: "th p" }, { tag: "td p" }];
  },

  renderHTML() {
    return ["paragraph", {}, 0];
  },
});

export default MyTableParagraph;
