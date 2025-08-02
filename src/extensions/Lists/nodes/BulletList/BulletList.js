import { Node, mergeAttributes } from "@tiptap/core";
import { createOptions, createAttributes } from "../../../../utils";

const name = "bulletList";
// TODO: need to add color and link
const marks = "bold italic underline strike superscript highlight";
const group = "block list";
const content = "inline*";
const defining = true;
const options = createOptions(name);
const attributes = createAttributes(name);

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

  // TODO: add commands

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
