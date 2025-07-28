import { Node, mergeAttributes } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

const BulletList = Node.create({
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
      {
        find: /^\s*([-+*])\s$/,
        handler: ({ state, range, chain }) => {
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              indentLevel,
              contentType: name,
              nodeType: "block",
            })
            .run();
        },
      },
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
        ["div", options.contentAttrs, ["p", {}, 0]],
      ],
    ];
  },
});

export default BulletList;
