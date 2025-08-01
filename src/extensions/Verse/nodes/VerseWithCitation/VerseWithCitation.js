import { Node, mergeAttributes } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

const VerseWithChapter = Node.create({
  name,
  marks,
  group,
  content,
  defining,

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
        [
          "div",
          options.contentAttrs,
          [
            "span",
            { "data-verse-number": HTMLAttributes["data-verse-number"] },
            0,
          ],
        ],
      ],
    ];
  },
});

export default VerseWithChapter;
