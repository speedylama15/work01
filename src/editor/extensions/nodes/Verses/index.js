import { Node, mergeAttributes } from "@tiptap/core";

const Verses = Node.create({
  name: "verses",
  group: "block",
  content: "text*",
  defining: true,
  whitespace: "pre",
  marks: "bold italic highlight",

  addOptions() {
    return {
      blockAttrs: { class: "block block-verses" },
      decoratorAttrs: {
        class: "decorator decorator-verses",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-verses",
        "data-node-type": "content",
      },
    };
  },

  addInputRules() {
    return [
      {
        find: /\[$/,
        handler: ({ range, chain }) => {
          chain()
            .deleteRange(range)
            .insertContent("[]")
            .setTextSelection(range.from + 1)
            .run();
        },
      },
      {
        find: /^\[(\d+)\]\[(.+)\] $/,
        handler: (params) => {
          const { range, match, chain, state } = params;

          const { $from } = state.selection;
          const node = $from.node($from.depth - 1);

          const verseNumber = match[1];
          const verse = match[2];

          if (node.type.name !== "verses") {
            chain()
              .setNode(this.name, {})
              .deleteRange(range)
              .insertContentAt(
                range.from,
                `<span><sup>${verseNumber}</sup>${verse}</span>`
              )
              .run();
          } else {
            chain()
              .deleteRange(range)
              .insertContentAt(range.from, `<sup>${verseNumber}</sup>${verse}`)
              .run();
          }
        },
      },
    ];
  },

  parseHTML() {
    return [{ tag: 'div[data-content-type="verses"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        ["div", this.options.contentAttrs, ["div", {}, 0]],
      ],
    ];
  },
});

export default Verses;
