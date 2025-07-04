import { Extension } from "@tiptap/core";

const AltShortcuts = Extension.create({
  name: "shortcuts",

  addKeyboardShortcuts() {
    return {
      // IDEA
      Enter: ({ editor }) => {},

      // IDEA
      Backspace: ({ editor }) => {},

      Tab: ({ editor }) => {},

      "Shift-Tab": ({ editor }) => {},

      // IDEA
      "Shift-^": ({ editor }) => {
        return editor.commands.toggleSuperscript();
      },
    };
  },
});

export default AltShortcuts;
