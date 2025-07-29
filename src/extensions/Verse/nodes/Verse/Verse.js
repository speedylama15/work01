import { Node, mergeAttributes } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

const Verse = Node.create({
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

  // IDEA: ^11" "
  // IDEA: have to add [][][] into the mix
  addInputRules() {
    return [
      {
        find: /^(\d+)\^\s/,
        handler: ({ range, chain, state, match }) => {
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;
          const verseNumber = match[1];

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              indentLevel,
              contentType: name,
              nodeType: "block",
              verseNumber,
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

export default Verse;
