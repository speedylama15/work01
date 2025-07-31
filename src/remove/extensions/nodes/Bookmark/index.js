import { Node } from "@tiptap/core";

const Bookmark = Node.create({
  name: "bookmark",
  group: "block bookmark",
  atom: true,

  addNodeView() {},

  renderHTML() {
    return ["div", {}, ["p", {}], ["img", { src: "src" }]];
  },
});

export default Bookmark;
