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

import Blockquote from "../../extensions/nodes/Blockquote";
import BulletList from "../../extensions/nodes/BulletList";
import Checklist from "../../extensions/nodes/Checklist";
import Document from "../../extensions/nodes/Document";
import Heading1 from "../../extensions/nodes/Heading1";
import Heading2 from "../../extensions/nodes/Heading2";
import Heading3 from "../../extensions/nodes/Heading3";
import NumberedList from "../../extensions/nodes/NumberedList";
import Paragraph from "../../extensions/nodes/Paragraph";
import VerseSimple from "../../extensions/nodes/VerseSimple";
import VersesFormatted from "../../extensions/nodes/VersesFormatted";
import VerseWithChapter from "../../extensions/nodes/VerseWithChapter";

import MyCommands from "../../extensions/commands/MyCommands";
import MyShortcuts from "../../extensions/shortcuts/MyShortcuts";
import DragAndDropNode from "../../extensions/plugins/DragAndDropNode/DragAndDropNode";
import Placeholder from "../../extensions/plugins/Placeholder/Placeholder";

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
    // FIX: add more
    types: ["paragraph", "bulletList", "numberedList", "checklist"],
  }),
  Paragraph,
  Checklist,
  Document,
  Heading1,
  Heading2,
  Heading3,
  NumberedList,
  BulletList,
  Blockquote,
  VerseWithChapter,
  VerseSimple,
  VersesFormatted,
  MyCommands,
  MyShortcuts,
  DragAndDropNode,
  Placeholder,
];

const Editor = () => {
  const editor = useEditor({
    content,
    extensions,

    parseOptions: {
      preserveWhitespace: "full",
    },

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
    <div className="editor-main">
      <EditorContent editor={editor} className="editor-container" />
    </div>
  );
};

export default Editor;
