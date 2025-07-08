import { useEditor, EditorContent } from "@tiptap/react";

import { UndoRedo, Placeholder } from "@tiptap/extensions";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Superscript from "@tiptap/extension-superscript";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import UniqueID from "@tiptap/extension-unique-id";

import { Doc, Paragraph, NumberedList, BulletList } from "../nodes";
import { MyCommands, MyShortcuts } from "../functionalities";
import { MyPlugins } from "../plugins";

import "./Editor.css";

const content = ``;

const extensions = [
  UndoRedo,
  Text,
  Bold,
  Italic,
  Superscript,
  Strike,
  Underline,
  Highlight,
  UniqueID.configure({
    types: ["block"],
  }),
  Doc,
  Paragraph,
  NumberedList,
  BulletList,
  MyCommands,
  MyShortcuts,
  MyPlugins,
  Placeholder.configure({
    placeholder: ({ node }) => {
      const contentType = node.attrs?.contentType;

      if (contentType === "bulletList" || contentType === "numberedList") {
        return "List";
      }

      // FIX
      return "Write something";
    },
  }),
];

const Editor = () => {
  console.count("editor render");

  const editor = useEditor({
    content,
    extensions,

    editorProps: {
      attributes: {
        class: "editor",
      },

      // handleClick(view, pos, event) {},
      // handleDrop(view, e, slice, moved) {},
      // handleClickOn(view, pos, node, nodePos, e) {},

      // handleDOMEvents: {
      //   mouseover(view, e) {},
      //   dragstart(view, e) {},
      // },
    },

    // onDrop(e, slice, moved) {},
    // onPaste(e, slice) {},
  });

  return (
    <>
      <EditorContent editor={editor} className="editor-container" />
    </>
  );
};

export default Editor;
