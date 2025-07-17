import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const dragAndDropPluginKey = new PluginKey("dragAndDropPluginKey");

const DragAndDropExtension = Extension.create({
  name: "DragHandleExtension",

  addProseMirrorPlugins() {
    let metaPressed = false;
    let isDragging = false;
    const preview = document.createElement("div");
    preview.className = "preview";

    return [
      new Plugin({
        key: dragAndDropPluginKey,

        state: {
          // IDEA
          init() {
            return DecorationSet.empty;
          },

          // IDEA
          // REVIEW: mousedown and up triggers this
          // REVIEW: but moving the mouse does not
          apply(tr) {
            if (metaPressed) {
              const meta = tr.getMeta(dragAndDropPluginKey);

              return meta;
            }

            return { selectedNodes: null };
          },
        },

        // IDEA
        props: {
          decorations(state) {
            const pluginState = dragAndDropPluginKey.getState(state);

            console.log("HEY", pluginState);

            if (pluginState?.selectedNodes) {
              const { selectedNodes } = pluginState;

              const decorationsArray = selectedNodes?.map(({ node, pos }) => {
                return Decoration.node(pos, pos + node.nodeSize, {
                  class: "to-drag-node",
                });
              });

              return DecorationSet.create(state.doc, decorationsArray);
            } else {
              return DecorationSet.empty;
            }
          },
        },

        // TODO
        view(editorView) {
          // TODO
          const handleMouseDown = (e) => {
            const selectedNodes = [];

            const tr = editorView.state.tr;
            const selection = editorView.state.selection;
            const state = editorView.state;
            const { from, to } = selection;

            if (e.metaKey && from) {
              e.preventDefault();

              isDragging = true;
              metaPressed = true;

              state.doc.nodesBetween(from, to, (node, pos) => {
                const nodeType = node?.attrs?.nodeType;

                if (nodeType) {
                  const dom = editorView.nodeDOM(pos);
                  const clonedDOM = dom.cloneNode(true);

                  preview.appendChild(clonedDOM);
                  selectedNodes.push({ dom: clonedDOM, node, pos });

                  return true;
                }
              });

              // TODO
              tr.setMeta(dragAndDropPluginKey, {
                selectedNodes,
              });

              document.body.append(preview);
              preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            } else {
              tr.setMeta(dragAndDropPluginKey, {
                selectedNodes: [],
              });
            }

            editorView.dispatch(tr);
          };

          // TODO
          const handleMouseUp = () => {
            const tr = editorView.state.tr;

            isDragging = false;
            metaPressed = false;
            preview.innerHTML = "";
            preview.remove();

            tr.setMeta(dragAndDropPluginKey, {
              selectedNodes: [],
            });

            editorView.dispatch(tr);
          };

          // TODO
          const handleMouseMove = (e) => {
            const tr = editorView.state.tr;
            const target = e.target;
            const block = target?.closest("[data-node-type='block']");

            if (isDragging) {
              preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

              if (block) {
                const { clientX, clientY } = e;
                const rect = block.getBoundingClientRect();
                const { top, right, bottom, left } = rect;

                const xPercentage = ((clientX - left) / (right - left)) * 100;
                const yPercentage = ((clientY - top) / (bottom - top)) * 100;

                const pos = editorView.posAtDOM(block);

                // FIX
                // FIX: this was causing the issue
                // editorView.dispatch(tr);
              }
            }
          };

          // TODO
          const handleMouseOver = () => {};

          document.addEventListener("mousedown", handleMouseDown);
          document.addEventListener("mouseup", handleMouseUp);
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseover", handleMouseOver);

          return {
            destroy() {
              document.removeEventListener("mousedown", handleMouseDown);
              document.removeEventListener("mouseup", handleMouseUp);
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseover", handleMouseOver);
            },
          };
        },

        // IDEA
      }),
    ];
  },
});

export default DragAndDropExtension;
