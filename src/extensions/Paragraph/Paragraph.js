import { Node, mergeAttributes } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, priority, options, attributes } =
  mapping;

const Paragraph = Node.create({
  name,
  marks,
  group,
  content,
  defining,
  priority,

  addOptions() {
    return options;
  },

  addAttributes() {
    return attributes;
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, options.blockAttrs),
      [
        "div",
        options.decoratorAttrs,
        ["div", options.contentAttrs, ["p", {}, 0]],
      ],
    ];
  },
});

export default Paragraph;
