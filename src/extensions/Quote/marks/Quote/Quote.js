import { Mark } from "@tiptap/core";
import mapping from "./constants/mapping";

const { name, group } = mapping;

const Quote = Mark.create({
  name,
  group,

  parseHTML() {
    return [{ tag: "q" }];
  },

  renderHTML() {
    return ["q", {}, 0];
  },

  addCommands() {
    return {
      setQuote:
        () =>
        ({ commands }) =>
          commands.setMark(this.name),
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-j": ({ editor }) => editor.commands.setQuote(),
    };
  },
});

export default Quote;
