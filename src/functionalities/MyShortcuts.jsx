import { Extension } from "@tiptap/core";

const MyShortcuts = Extension.create({
  name: "shortcuts",

  addKeyboardShortcuts() {
    return {
      // FIX: range selected?
      // FIX: reverting to paragraph when node is empty?
      // FIX: splitted but what if there are numbered list nodes below?
      // FIX: I need to be aware the content in which the Enter has been pressed
      // IDEA
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { from, to, $from } = selection;

        const cNode = $from.node($from.depth);
        const cContentType = cNode.attrs.contentType;

        if (
          (cContentType === "bulletList" || cContentType === "numberedList") &&
          !cNode.children.length
        ) {
          return editor.commands.setBlockToParagraph();
        }

        if (from === to) return editor.commands.splitTextBlock();
        if (from !== to) return editor.commands.splitBlock();

        return false;
      },

      // IDEA
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        const { parentOffset } = $from;

        const cNode = $from.node($from.depth);
        const cContentType = cNode.attrs.contentType;

        if (
          (cContentType === "bulletList" || cContentType === "numberedList") &&
          parentOffset === 0
        ) {
          return editor.commands.setBlockToParagraph();
        }
      },

      Tab: ({ editor }) => {
        return editor.commands.indentBlock();
      },

      "Shift-Tab": ({ editor }) => {
        return editor.commands.outdentBlock();
      },

      // IDEA
      "Shift-^": ({ editor }) => {
        return editor.commands.toggleSuperscript();
      },
    };
  },
});

export default MyShortcuts;
