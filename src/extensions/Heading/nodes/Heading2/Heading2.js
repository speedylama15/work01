import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

const Heading2 = Node.create({
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
        find: new RegExp(`^(#{2})\\s$`),
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
    return [{ tag: `div[data-content-type="${name}"]` }, { tag: "h2" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, options.blockAttrs),
      [
        "div",
        options.decoratorAttrs,
        ["div", options.contentAttrs, ["h2", {}, 0]],
      ],
    ];
  },
});

export default Heading2;
