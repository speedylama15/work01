import { useEditor, EditorContent } from "@tiptap/react";

import { UndoRedo } from "@tiptap/extensions";
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

      <div>
        <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
          <circle cx="3" cy="3" r="1.5" />
          <circle cx="9" cy="3" r="1.5" />
          <circle cx="3" cy="8" r="1.5" />
          <circle cx="9" cy="8" r="1.5" />
          <circle cx="3" cy="13" r="1.5" />
          <circle cx="9" cy="13" r="1.5" />
        </svg>
      </div>
    </>
  );
};

export default Editor;
