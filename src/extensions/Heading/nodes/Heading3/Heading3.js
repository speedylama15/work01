import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

const Heading3 = Node.create({
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

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: new RegExp(`^(#{3})\\s$`),
        type: this.type,
        getAttributes: {
          indentLevel: 0,
          contentType: name,
          nodeType: "block",
        },
      }),
    ];
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
        ["div", options.contentAttrs, ["h3", {}, 0]],
      ],
    ];
  },
});

export default Heading3;
