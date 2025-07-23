import { Node } from "@tiptap/core";

const Verse = Node.create({
  name: "verse",
  group: "verse",
  content: "text*",
  defining: true,

  addAttributes() {
    return {
      verseNumber: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-verse-number"),
        renderHTML: (attributes) => ({
          "data-verse-number": attributes.verseNumber,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

export default Verse;
