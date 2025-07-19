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
import HardBreak from "@tiptap/extension-hard-break";

import {
  Doc,
  Paragraph,
  NumberedList,
  BulletList,
  Checklist,
  Blockquote,
  Heading,
  Divider,
} from "../nodes";
import { MyCommands, MyShortcuts } from "../functionalities";
import { DragAndDropBlock, Placeholder } from "../extensions";

// FIX
import Sidebar from "./Sidebar";

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
    types: ["paragraph", "bulletList", "numberedList"],
  }),
  HardBreak,
  Paragraph,
  Heading,
  Divider,
  Doc,
  NumberedList,
  BulletList,
  Checklist,
  Blockquote,
  MyCommands,
  MyShortcuts,
  DragAndDropBlock,
  Placeholder,
];

const Editor = () => {
  const editor = useEditor({
    content,
    extensions,

    onCreate() {
      const doc = document.getElementsByClassName("ProseMirror")[0];

      doc.classList.remove("tiptap");
    },

    editorProps: {
      attributes: {
        class: "editor",
      },
    },
  });

  return (
    <div className="test-box">
      <Sidebar></Sidebar>

      <EditorContent editor={editor} className="editor-container" />
    </div>
  );
};

export default Editor;
