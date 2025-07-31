import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";

import "./DragHandle.css";

const dragHandlePluginKey = new PluginKey("dragHandlePluginKey");

const DragHandle = Extension.create({
  name: "dragHandle",

  addProseMirrorPlugins() {
    const handle = document.createElement("div");
    handle.className = "drag-handle";
    handle.innerHTML = "⋮⋮";
    handle.style.cssText = `
        position: absolute;
        left: 0px;
        top: 0px;
        opacity: 1;
        will-change: transform;
        font-size: 18px;
        display: none;
        transform: translateY(-50%);
    `;

    return [
      new Plugin({
        key: dragHandlePluginKey,
        props: {},

        view() {
          const editorContainer = document.querySelector(".editor-container");
          editorContainer?.appendChild(handle);

          document.addEventListener("keydown", () => {
            handle.style.display = "none";
          });

          editorContainer?.addEventListener("mousemove", (e) => {
            const block = e.target.closest('[data-node-type="block"]');

            if (block) {
              handle.style.display = "flex";
              handle.style.left = `${
                block?.offsetLeft - handle?.clientWidth
              }px`;
              handle.style.top = `${
                block?.offsetTop + block?.clientHeight / 2
              }px`;
            }
          });

          return {
            destroy() {
              handle.remove();
            },
          };
        },
      }),
    ];
  },
});

export default DragHandle;
