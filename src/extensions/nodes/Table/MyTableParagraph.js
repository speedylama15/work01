import { Node } from "@tiptap/core";

const name = "myTableParagraph";

const MyTableParagraph = Node.create({
  name,
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight",
  group: "myTableParagraph",
  content: "inline*",
  // FIX: hopefully this does not become an issue
  // IDEA: because this is NOT part of block or inline, it can be rendered under one condition
  // IDEA: when a node specifically has content type set to this node
  priority: 200,

  parseHTML() {
    return [{ tag: "th p" }, { tag: "td p" }];
  },

  renderHTML() {
    return ["paragraph", {}, 0];
  },
});

export default MyTableParagraph;
