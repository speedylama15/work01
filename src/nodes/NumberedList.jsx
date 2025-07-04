import { Node, mergeAttributes } from "@tiptap/core";

const NumberedList = Node.create({
  name: "numberedList",
  group: "block list",
  content: "inline*",
  // FIX: add more marks later
  marks: "bold italic underline superscript highlight",
  defining: true,

  addInputRules() {
    return [
      {
        find: /^(\d+)\.\s$/,
        handler: ({ state, range, chain, match }) => {
          const { selection } = state;
          const { $from } = selection;

          const cNode = $from.node($from.depth);
          const cindentLevel = cNode?.attrs?.indentLevel;

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              startNumber: match[1],
              indentLevel: cindentLevel,
              contentType: "numberedList",
              nodeType: "block",
            })
            .run();
        },
      },
    ];
  },

  addAttributes() {
    return {
      startNumber: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-start-number"),
        renderHTML: (attributes) => ({
          "data-start-number": attributes.startNumber,
        }),
      },
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      contentType: {
        default: "numberedList",
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
    return [{ tag: 'div[data-content-type="numberedList"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const startNumber = HTMLAttributes["data-start-number"];

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "block block-numberedList",
      }),
      [
        "div",
        {
          class: "content content-numberedList",
          "data-node-type": "content",
        },
        ["p", { "data-start-number": startNumber }, 0],
      ],
    ];
  },
});

export default NumberedList;
