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

        const files = e.dataTransfer.files;

        if (files.length > 0) {
          const promises = Array.from(files).map((file) => {
            return new Promise((resolve) => {
              const src = URL.createObjectURL(file);

              const reader = new FileReader();

              reader.onload = (e) => {
                resolve({ file, src, result: e.target.result });
              };

              reader.readAsArrayBuffer(file);
            });
          });

          const data = await Promise.all(promises);

          const $pos = view.posAtCoords({
            left: e.clientX,
            top: e.clientY,
          });

          for (let i = data.length - 1; i >= 0; i--) {
            const { src } = data[i];

            // IDEA: need to tell if it's an image, audio or video
            // IDEA: format is important too
            // IDEA: maybe indent level needs to be figured out?
            // const imageNode = view.state.schema.nodes.image.create({
            //   src,
            //   nodeType: "block",
            //   contentType: "image",
            //   indentLevel: 0,
            // });

            // const audioNode = view.state.schema.nodes.audio.create({
            //   src,
            //   nodeType: "block",
            //   contentType: "image",
            //   indentLevel: 0,
            // });

            const videoNode = view.state.schema.nodes.video.create({
              src,
              nodeType: "block",
              contentType: "image",
              indentLevel: 0,
            });

            tr.insert($pos.pos, videoNode);
          }

          dispatch(tr);
        }
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
