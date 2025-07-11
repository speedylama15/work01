import { mergeAttributes, Node, textblockTypeInputRule } from "@tiptap/core";

// FIX: when enter is pressed, the next node is a paragraph
// FIX: should I let it be able to join?
// FIX: When backspace is pressed when parentOffset is 0, it should not be reverted to a paragraph

const Heading = Node.create({
  name: "heading",
  group: "block heading",
  content: "inline*",
  defining: true,

  // IDEA
  addOptions() {
    return {
      levels: [1, 2, 3, 4],
      HTMLAttributes: {},
    };
  },

  addInputRules() {
    return this.options.levels.map((headingLevel) => {
      return textblockTypeInputRule({
        find: new RegExp(
          `^(#{${Math.min(...this.options.levels)},${headingLevel}})\\s$`
        ),
        type: this.type,
        getAttributes: {
          headingLevel,
          contentType: "heading",
          nodeType: "block",
        },
      });
    });
  },

  addAttributes() {
    return {
      headingLevel: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-heading-level"),
        renderHTML: (attributes) => ({
          "data-heading-level": attributes.headingLevel,
        }),
      },
      contentType: {
        default: "heading",
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      nodeType: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },

  parseHTML() {
    return this.options.levels.map((level) => {
      return {
        tag: `div[data-content-type="heading"][data-heading-level="${level}"]`,
      };
    });
  },

  renderHTML({ node, HTMLAttributes }) {
    const headingLevel = node.attrs.headingLevel || 1;

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "block block-blockquote",
      }),
      [
        "div",
        {
          class: "decorator decorator-blockquote",
          "data-node-type": "content",
        },
        [
          "div",
          { class: "content content-blockquote", "data-node-type": "content" },
          [`h${headingLevel}`, {}, 0],
        ],
      ],
    ];
  },

  // FIX
  addCommands() {
    return {
      setHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.setNode(this.name, attributes);
        },

      toggleHeading:
        (attributes) =>
        ({ commands }) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false;
          }

          return commands.toggleNode(this.name, "paragraph", attributes);
        },
    };
  },
});

export default Heading;
