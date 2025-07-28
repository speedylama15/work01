import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

// FIX: when enter is pressed, the next node is a paragraph
// FIX: should I let it be able to join?
// FIX: When backspace is pressed when parentOffset is 0, it should not be reverted to a paragraph

const Heading1 = Node.create({
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
        find: new RegExp(`^(#{1})\\s$`),
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
    return [{ tag: `div[data-content-type="${name}"]` }, { tag: "h1" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, options.blockAttrs),
      [
        "div",
        options.decoratorAttrs,
        ["div", options.contentAttrs, ["h1", {}, 0]],
      ],
    ];
  },
});

export default Heading1;
