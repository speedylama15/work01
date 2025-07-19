import { useEditor, EditorContent } from "@tiptap/react";

import Text from "@tiptap/extension-text";
import { UndoRedo } from "@tiptap/extensions";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Highlight from "@tiptap/extension-highlight";
import Strike from "@tiptap/extension-strike";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import UniqueID from "@tiptap/extension-unique-id";

import {
  Document,
  Paragraph,
  NumberedList,
  BulletList,
  Checklist,
  Blockquote,
  Heading,
  Divider,
} from "../nodes";
import { MyCommands } from "../commands";
import { MyShortcuts } from "../shortcuts";
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
  Paragraph,
  Heading,
  Divider,
  Document,
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
