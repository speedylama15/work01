import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
// import { Decoration, DecorationSet } from "@tiptap/pm/view";

const DragHandleExtension = Extension.create({
  name: "DragHandleExtension",

  addProseMirrorPlugins() {
    let dragHandle = null;
    let target = null;

    return [
      new Plugin({
        key: new PluginKey("dragHandle"),

        view() {
          // IDEA: it gets triggered only once here
          dragHandle = document.createElement("div");
          dragHandle.className = "drag-handle";
          dragHandle.innerHTML = "⋮⋮";

          return {
            update: () => {
              // Position logic here
            },

            destroy() {
              if (dragHandle) {
                document.body.removeChild(dragHandle);
              }
            },
          };
        },

        props: {
          handleDOMEvents: {
            mouseover(view, event) {
              target = event.target.closest('[data-node-type="block"]');
              const extraDiv = document.getElementById("extra");

              if (target) {
                const rect = target.getBoundingClientRect();

                dragHandle.style.top = `${rect.top}px`;
                dragHandle.style.left = `${rect.left}px`;
                dragHandle.style.visibility = "visible";

                extraDiv.append(dragHandle);
              }
            },

            mouseleave() {
              dragHandle.style.visibility = "hidden";
            },

            mousedown(view, e) {
              if (e.metaKey) {
                console.log({ e, view });
              }
            },

            // REVIEW: dragstart → dragenter → dragover (repeating) → dragleave/drop → dragend
            dragstart() {},

            drag() {},

            dragend() {},

            dragover(view, e) {
              e.preventDefault();
            },

            dragenter() {},

            dragleave() {},

            drop() {},
          },
        },
      }),
    ];
  },
});

export default DragHandleExtension;
