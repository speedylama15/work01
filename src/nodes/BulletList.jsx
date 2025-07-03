import { Node, mergeAttributes } from "@tiptap/core";

const BulletList = Node.create({
  name: "bulletList",
  group: "block list",
  content: "inline*",
  // FIX: add more marks later
  marks: "bold italic underline superscript highlight",

  // FIX: is this correct?
  addInputRules() {
    return [
      {
        find: /^\s*([-+*])\s$/,
        handler: ({ state, range, chain }) => {
          const { selection } = state;
          const { $from } = selection;

          const cNode = $from.node($from.depth);
          const cindentLevel = cNode?.attrs.indentLevel;

          // FIX: is setNode the solution?
          chain()
            .deleteRange(range)
            .setNode(this.name, { indentLevel: cindentLevel })
            .run();
        },
      },
    ];
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => ({
          "data-id": attributes.id,
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
        default: "bulletList",
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
    return [{ tag: 'div[data-content-type="bulletList"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "block block-bulletList",
      }),
      [
        "div",
        {
          class: "content content-bulletList",
          // FIX: do I need this for the content div node?
          "data-node-type": "content",
        },
        ["p", {}, 0],
      ],
    ];
  },
});

export default BulletList;
