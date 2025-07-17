import { Extension } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const dragAndDropPluginKey = new PluginKey("dragAndDropPluginKey");

const DragAndDropExtension = Extension.create({
  name: "DragHandleExtension",

  addProseMirrorPlugins() {
    let borderPos = null;
    let selectedNodes = [];
    let isDragging = false;

    const preview = document.createElement("div");
    preview.className = "preview";

    return [
      new Plugin({
        key: dragAndDropPluginKey,

        // IDEA
        props: {
          // IDEA
          decorations(state) {
            const decorations = [];

            if (selectedNodes.length) {
              selectedNodes?.forEach(({ node, pos }) => {
                const nodeDecoration = Decoration.node(
                  pos,
                  pos + node.nodeSize,
                  {
                    class: "to-drag-node",
                  }
                );

                decorations.push(nodeDecoration);
              });
            }

            if (borderPos) {
              const { before, after, location } = borderPos;

              const borderDecoration = Decoration.node(before, after, {
                class: location === "top" ? "border-top" : "border-bottom",
              });

              decorations.push(borderDecoration);
            }

            if (decorations.length) {
              return DecorationSet.create(state.doc, decorations);
            } else {
              return DecorationSet.empty;
            }
          },
        },

        // TODO
        view(editorView) {
          // REVIEW: I need to dispatch tr for decorations() to be invoked
          const handleMouseDown = (e) => {
            const tr = editorView.state.tr;
            const selection = editorView.state.selection;
            const state = editorView.state;
            const { from, to } = selection;

            if (e.metaKey && from) {
              e.preventDefault();

              selectedNodes = [];
              isDragging = true;

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

              document.body.append(preview);
              preview.style.transform = `translate(${e.clientX - 10}px, ${
                e.clientY - 10
              }px)`;
            } else {
              selectedNodes = [];
            }

            editorView.dispatch(tr);
          };

          // TODO
          const handleMouseUp = () => {
            const tr = editorView.state.tr;

            const contents = [];

            // REVIEW: selected nodes start to finish
            let a = null;
            let b = null;

            if (borderPos) {
              selectedNodes.forEach(({ node, pos }, i) => {
                if (a === null) a = pos;
                if (i === selectedNodes.length - 1) b = pos + node.nodeSize;
                contents.push(node);
              });

              const { location, before, after } = borderPos;

              if (a > before || b < after) {
                if (location === "bottom") {
                  tr.insert(after, Fragment.from(contents));
                  tr.deleteRange(a, b);
                } else {
                  tr.deleteRange(a, b);
                  tr.insert(before, Fragment.from(contents));
                }
              }
            }

            borderPos = null;
            selectedNodes = [];
            isDragging = false;
            preview.innerHTML = "";
            preview.remove();

            editorView.dispatch(tr);
          };

          // TODO
          const handleMouseMove = (e) => {
            const tr = editorView.state.tr;
            const target = e.target;
            const block = target?.closest("[data-node-type='block']");

            if (isDragging) {
              preview.style.transform = `translate(${e.clientX - 10}px, ${
                e.clientY - 10
              }px)`;

              if (block) {
                const { clientY } = e;
                const rect = block.getBoundingClientRect();
                const { top, bottom } = rect;

                const yPercentage = ((clientY - top) / (bottom - top)) * 100;

                const pos = editorView.posAtDOM(e.target);
                // FIX: have to be cautious of node. Hopefully this is reliable
                const node = editorView.state.doc.nodeAt(pos - 1);

                borderPos = {
                  before: pos - 1,
                  after: pos - 1 + node.nodeSize,
                  location: yPercentage > 50 ? "bottom" : "top",
                };

                editorView.dispatch(tr);
              }
            }
          };

          document.addEventListener("mousedown", handleMouseDown);
          document.addEventListener("mouseup", handleMouseUp);
          document.addEventListener("mousemove", handleMouseMove);

          return {
            destroy() {
              document.removeEventListener("mousedown", handleMouseDown);
              document.removeEventListener("mouseup", handleMouseUp);
              document.removeEventListener("mousemove", handleMouseMove);
            },
          };
        },

        // IDEA
      }),
    ];
  },
});

export default DragAndDropExtension;
