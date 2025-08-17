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

      handleDrop: async (view, e) => {
        e.preventDefault();

        const { tr } = view.state;
        const { dispatch } = view;

        const files = e.dataTransfer?.files;

        const promises = Array.from(files).map((file) => {
          return new Promise((resolve) => {
            const url = URL.createObjectURL(file);

            const reader = new FileReader();

            reader.onload = (e) => {
              resolve({ file, url, result: e.target.result });
            };

            reader.readAsArrayBuffer(file);
          });
        });

        const data = await Promise.all(promises);

        data.forEach(({ file, url }) => {
          // FIX
          console.log(file);
        });

        dispatch(tr);
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
