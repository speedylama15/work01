import { useEditor, EditorContent } from "@tiptap/react";
import { Doc, Paragraph, BulletList } from "../nodes";
import { Shortcuts } from "../functionalities";
import { UndoRedo } from "@tiptap/extensions";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Superscript from "@tiptap/extension-superscript";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";

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
  Shortcuts,
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
