import { useEditor, EditorContent } from "@tiptap/react";

import extensions from "./extensions";

import "./Editor.css";

const content = ``;

const Editor = () => {
  const editor = useEditor({
    content,
    extensions: [
      ...extensions.nodes,
      ...extensions.marks,
      ...extensions.functionalities,
    ],

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

      {/* <MyBubbleMenu editor={editor} /> */}
    </div>
  );
};

export default Editor;
