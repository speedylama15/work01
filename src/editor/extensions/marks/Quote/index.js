import { Mark } from "@tiptap/core";

const InlineQuote = Mark.create({
  name: "inlineQuote",

  parseHTML() {
    return [{ tag: "q" }];
  },

  renderHTML() {
    return ["q", {}, 0];
  },

  addKeyboardShortcuts() {
    return {
      u: ({ editor }) => {
        return editor.commands.setInlineQuote();
      },
    };
  },

  addCommands() {
    return {
      setInlineQuote:
        () =>
        ({ commands }) => {
          return commands.setMark(this.name);
        },
    };
  },
});

export default InlineQuote;
