import { Extension } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";

// IDEA: need to tell if it's an image, audio or video
// IDEA: format is important too
// IDEA: maybe indent level needs to be figured out?

const FileHandler = Extension.create({
  name: "fileHandler",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop: async (view, e) => {
            e.preventDefault();

            const { tr } = view.state;
            const { dispatch } = view;

            const files = e.dataTransfer.files;

            if (files.length > 0) {
              const promises = Array.from(files).map((file) => {
                return new Promise((resolve) => {
                  const reader = new FileReader();

                  reader.onload = (e) => {
                    resolve({
                      file,
                      src: e.target.result,
                    });
                  };

                  reader.readAsDataURL(file);
                });
              });

              const data = await Promise.all(promises);

              const $pos = view.posAtCoords({
                left: e.clientX,
                top: e.clientY,
              });

              for (let i = data.length - 1; i >= 0; i--) {
                const { src } = data[i];

                // const imageNode = view.state.schema.nodes.image.create({
                //   imageSrc: src,
                //   nodeType: "block",
                //   contentType: "image",
                //   indentLevel: 0,
                // });

                // const audioNode = view.state.schema.nodes.audio.create({
                //   audioSrc: src,
                //   nodeType: "block",
                //   contentType: "audio",
                //   // FIX
                //   indentLevel: 0,
                // });

                const videoNode = view.state.schema.nodes.video.create({
                  videoSrc: src,
                  nodeType: "block",
                  contentType: "video",
                  indentLevel: 0,
                });

                tr.insert($pos.pos, videoNode);
              }

              dispatch(tr);
            }

            return true;
          },
        },
      }),
    ];
  },
});

export default FileHandler;
