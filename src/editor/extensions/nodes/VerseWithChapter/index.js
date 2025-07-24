import { Node, mergeAttributes } from "@tiptap/core";

const name = "verseWithChapter";

const VerseWithChapter = Node.create({
  name,
  group: "block",
  content: "inline*",
  marks: "bold italic highlight",

  addOptions() {
    return {
      blockAttrs: { class: `block block-${name}` },
      decoratorAttrs: {
        class: `decorator decorator-${name}`,
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: `content content-${name}`,
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [
      {
        find: /^(\[([^\[\]]+)\]\[([^\[\]]+)\]\[([^\[\]]*)\])\s/,
        handler: ({ range, chain, state, match }) => {
          const { selection } = state;
          const { $from } = selection;

          console.log("DISCERNMENT IS NEEDED", match);

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          const verseChapterOrNumber = match[2];
          const verse = match[3];
          // IDEA: this is for later
          //   const tags = match[4]

          const numberRegex = /^\d+$/;
          const numbersOnly = numberRegex.test(verseChapterOrNumber);

          if (!numbersOnly) {
            console.log("CREATE VERSE WITH CHAPTER");

            // chain()
            //   .deleteRange(range)
            //   .setNode(this.name, {
            //     indentLevel,
            //     contentType: name,
            //     nodeType: "block",
            //     verseChapter: verseChapterOrNumber,
            //   })
            //   .run();
          }
        },
      },
    ];
  },

  addAttributes() {
    return {
      verseNumber: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-verse-number"),
        renderHTML: (attributes) => ({
          "data-verse-number": attributes.verseNumber,
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
        default: `${name}`,
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
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        [
          "div",
          this.options.contentAttrs,
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
