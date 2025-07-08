import { Extension } from "@tiptap/core";

const MyShortcuts = Extension.create({
  name: "shortcuts",

  addKeyboardShortcuts() {
    return {
      // FIX
      "/": ({ editor }) => {
        const { state } = editor;
        const { tr } = state;

        tr.doc.descendants((node, pos) => {
          if (node.attrs?.nodeType) {
            console.log({
              node,
              nodeName: node.type.name,
              nodeType: node.attrs?.nodeType,
              pos,
            });
          }
        });

        return true;
      },

      // FIX
      "'": ({ editor }) => {
        const { state } = editor;
        const { tr, selection } = state;
        const { $from } = selection;

        const pos = $from.before($from.depth);
        const node = $from.node($from.depth);

        const resolvedPos = tr.doc.resolve(pos);
        const index = resolvedPos.index();

        console.log({ index, node, currentNodePos: pos });

        return true;
      },

      // IDEA
      Enter: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { from, to, $from } = selection;

        const node = $from.node($from.depth);
        const contentType = node.attrs?.contentType;
        const indentLevel = parseInt(node.attrs?.indentLevel);

        if (
          !node.childCount &&
          (contentType === "bulletList" ||
            contentType === "numberedList" ||
            contentType === "checklist")
        ) {
          return editor.commands.setToParagraph();
        }

        if (!node.childCount && contentType === "paragraph" && indentLevel) {
          return editor.commands.outdentSingleBlock();
        }

        if (from === to) return editor.commands.splitTextBlock();
        if (from !== to) return editor.commands.splitBlock();

        return false;
      },

      // IDEA
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, from, to } = selection;
        const { parentOffset } = $from;

        const node = $from.node($from.depth);
        const contentType = node.attrs?.contentType;
        const indentLevel = parseInt(node.attrs?.indentLevel);

        if (from !== to) {
          return editor.commands.deleteRange({ from, to });
        }

        if (
          parentOffset === 0 &&
          (contentType === "bulletList" ||
            contentType === "numberedList" ||
            contentType === "checklist")
        ) {
          return editor.commands.setToParagraph();
        }

        if (parentOffset === 0 && contentType === "paragraph" && indentLevel) {
          return editor.commands.outdentSingleBlock();
        }

        if (contentType === "paragraph" && !indentLevel && !parentOffset) {
          console.log("GOTTA GO UPWARDS");

          return editor.commands.joinTextblockBackward();
        }
      },

      // IDEA
      Tab: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { from, to } = selection;

        if (from === to) return editor.commands.indentSingleBlock();
        if (from !== to) return editor.commands.indentMultipleBlocks();
      },

      // IDEA
      "Shift-Tab": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { from, to } = selection;

        if (from === to) return editor.commands.outdentSingleBlock();
        if (from !== to) return editor.commands.outdentMultipleBlocks();
      },

      // IDEA
      "Shift-^": ({ editor }) => {
        return editor.commands.toggleSuperscript();
      },
    };
  },
});

export default MyShortcuts;
