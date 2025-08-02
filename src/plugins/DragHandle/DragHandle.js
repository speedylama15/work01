import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { autoUpdate, computePosition } from "@floating-ui/dom";

import "./DragHandle.css";

const dragHandlePluginKey = new PluginKey("dragHandlePluginKey");

// FIX: needs to disappear when mouse is out of the editor
// FIX: styling needs to be better
// FIX: need to add a tooltip to it
// FIX: dropdown must be presented
// FIX: maybe accurate data representation?
const DragHandle = Extension.create({
  name: "dragHandle",

  addProseMirrorPlugins() {
    const handle = document.createElement("div");
    handle.className = "drag-handle";
    handle.innerHTML = "⋮⋮";
    handle.style.cssText = `
      position: absolute;
      display: none;
      top: 0px;
      left: 0px;
      opacity: 1;
      will-change: transform;
      font-size: 18px;
    `;

    const handleDropdown = document.createElement("div");
    const testH1 = document.createElement("h3");
    testH1.innerHTML = "Testing this one out";
    handleDropdown.appendChild(testH1);
    handleDropdown.style.cssText = `
      position: absolute;
      display: none;
      top: 0px;
      left: 0px;
      opacity: 1;
      will-change: transform;
      background-color: blue;
    `;

    document.body.appendChild(handleDropdown);

    document.addEventListener("click", (e) => {
      if (handleDropdown.style.display !== "none") {
        if (!handleDropdown.contains(e.target) && !handle.contains(e.target)) {
          handleDropdown.style.display = "none";
        }
      }
    });

    // IDEA: access to block and then maybe there is a method in which allows me to provide a DOM
    // IDEA: and retrieve its pos and I can use that?
    handle.addEventListener("click", () => {
      handleDropdown.style.display = "flex";

      autoUpdate(handle, handleDropdown, () => {
        computePosition(handle, handleDropdown, {
          placement: "left",
          middleware: [],
        }).then(({ x, y }) => {
          Object.assign(handleDropdown.style, {
            top: "0",
            left: "0",
            transform: `translate(${x}px, ${y}px)`,
          });
        });
      });
    });

    return [
      new Plugin({
        key: dragHandlePluginKey,
        props: {},

        view() {
          const editorContainer = document.querySelector(".editor-container");
          editorContainer?.appendChild(handle);

          // IDEA
          // FIX: need to remove it later
          document.addEventListener("keydown", () => {
            handle.style.display = "none";
          });

          // IDEA
          // FIX: need to remove it later
          editorContainer?.addEventListener("mousemove", (e) => {
            const block = e.target.closest('[data-node-type="block"]');

            if (block) {
              // IDEA: display
              handle.style.display = "flex";

              computePosition(block, handle, {
                placement: "left",
                middleware: [],
              }).then(({ x, y }) => {
                Object.assign(handle.style, {
                  top: "0",
                  left: "0",
                  transform: `translate(${x}px, ${y}px)`,
                });
              });
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
