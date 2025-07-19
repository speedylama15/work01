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

import Document from "../nodes/Document/Document";
import Paragraph from "../nodes/Paragraph/Paragraph";
import Blockquote from "../nodes/Blockquote/Blockquote";
import BulletList from "../nodes/BulletList/BulletList";
import Checklist from "../nodes/Checklist/Checklist";
import Divider from "../nodes/Divider/Divider";
import Heading from "../nodes/Heading/Heading";
import NumberedList from "../nodes/NumberedList/NumberedList";

import { MyCommands } from "../commands";
import { MyShortcuts } from "../shortcuts";
import { DragAndDropNode, Placeholder } from "../extensions";

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
  DragAndDropNode,
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
