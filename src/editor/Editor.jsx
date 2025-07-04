import { useEditor, EditorContent } from "@tiptap/react";
import { Doc, Paragraph, BulletList, NumberedList } from "../nodes";
import { MyCommands, MyShortcuts } from "../functionalities";
import { Plugins } from "../plugins";
import { UndoRedo } from "@tiptap/extensions";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Superscript from "@tiptap/extension-superscript";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import UniqueID from "@tiptap/extension-unique-id";

import "./Editor.css";

const content = ``;

const editorProps = {
  attributes: {
    class: "editor",
  },
};

const extensions = [
  UndoRedo,
  Text,
  Bold,
  Italic,
  Superscript,
  Strike,
  Underline,
  Highlight,
  Doc,
  Paragraph,
  BulletList,
  MyCommands,
  MyShortcuts,
  UniqueID.configure({
    types: ["paragraph", "bulletList"],
  }),
  NumberedList,
  Plugins,
];

const Editor = () => {
  const editor = useEditor({
    content,
    editorProps,
    extensions,
  });

  return (
    <>
      <EditorContent editor={editor} className="editor-container" />
    </>
  );
};

export default Editor;
