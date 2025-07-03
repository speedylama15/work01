import { Extension } from "@tiptap/core";

const Shortcuts = Extension.create({
  name: "shortcuts",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { state, view } = editor;
        const { selection, tr } = state;
        const { dispatch } = view;
        const { $from } = selection;

        tr.split($from.pos);

        dispatch(tr);

        return true;
      },

      "Shift-^": ({ editor }) => {
        return editor.commands.toggleSuperscript();
      },

      // FIX
      "/": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from } = selection;
        const node = $from.node($from.depth);

        console.log($from, node);

        state.doc.descendants((node, pos) => {
          console.log("DESC", node, pos);
        });

        return true;
      },
    };
  },
});

export default Shortcuts;
