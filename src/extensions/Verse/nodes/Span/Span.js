import { Node, mergeAttributes } from "@tiptap/core";

const Span = Node.create({
  name: "span",
  inline: true,
  atom: true,
  group: "inline",
  selectable: false,

  parseHTML() {
    return [{ tag: "span[data-spaces]" }];
  },

  renderHTML() {
    // return ["span", { class: "span", "data-spaces": true }, ""];
    return [
      "span",
      { class: "span", "data-spaces": true },
      "\u00A0\u00A0\u00A0\u00A0",
    ];
  },
});

export default Span;
