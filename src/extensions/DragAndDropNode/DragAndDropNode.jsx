import { Extension } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { isNodeSelected } from "./helpers/isNodeSelected";

const DragAndDropNode = Extension.create({
  name: "dragAndDropNode",

  addProseMirrorPlugins() {
    let borderData = null;
    let selectedNodes = [];
    let isDragging = false;

    const preview = document.createElement("div");
    preview.className = "drag-and-drop-node-preview";

    return [
      new Plugin({
        key: new PluginKey("dragAndDropNodePlugin"),

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
                    class: "drag-and-drop-node-selected-node",
                  }
                );

                decorations.push(nodeDecoration);
              });
            }

            if (borderData) {
              const { before, after, location } = borderData;

              const borderDecoration = Decoration.node(before, after, {
                class:
                  location === "top"
                    ? "drag-and-drop-node-top"
                    : "drag-and-drop-node-bottom",
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
          // TODO
          // REVIEW: I need to dispatch tr for decorations() to be invoked
          const handleMouseDown = (e) => {
            const tr = editorView.state.tr;
            const selection = editorView.state.selection;
            const { from, to, $from } = selection;

            if (e.metaKey && from) {
              e.preventDefault();

              isDragging = true;

              // FIX: maybe this is the solution?
              // let pos = $from.before($from.depth);
              let pos = $from.before(1);
              const resolvedPos = tr.doc.resolve(pos);
              const index = resolvedPos.index();

              for (let i = index; i < tr.doc.children.length; i++) {
                const node = tr.doc.children[i];
                const isSelected = isNodeSelected(pos, node, from, to);

                if (i !== index && !isSelected) break;

                if (isSelected) {
                  const dom = editorView.nodeDOM(pos);
                  const clonedDOM = dom.cloneNode(true);
                  preview.appendChild(clonedDOM);

                  selectedNodes.push({ node, pos });
                }

                pos += node.nodeSize;
              }

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

                const before = pos - 1;
                const after = before + node.nodeSize;
                const location = yPercentage > 50 ? "bottom" : "top";
                const insertPos = location === "top" ? before : after;

                borderData = {
                  before,
                  after,
                  location,
                  insertPos,
                };

                editorView.dispatch(tr);
              }
            }
          };

          // TODO
          const handleMouseUp = () => {
            const tr = editorView.state.tr;

            const contents = [];

            // REVIEW: selected nodes start to finish
            let a = null;
            let b = null;

            if (borderData) {
              selectedNodes.forEach(({ node, pos }, i) => {
                if (a === null) a = pos;
                if (i === selectedNodes.length - 1) b = pos + node.nodeSize;
                contents.push(node);
              });

              const { location, insertPos } = borderData;

              let direction;

              if (location === "top" && b < insertPos) direction = "downward";
              if (location === "top" && a > insertPos) direction = "upward";
              if (location === "bottom" && b < insertPos)
                direction = "downward";
              if (location === "bottom" && a > insertPos) direction = "upward";

              if (a <= insertPos && insertPos <= b) {
                // FIX
                console.log("DO NOTHING");
              } else {
                if (direction === "upward") {
                  tr.deleteRange(a, b);
                  tr.insert(insertPos, Fragment.from(contents));
                } else {
                  tr.insert(insertPos, Fragment.from(contents));
                  tr.deleteRange(a, b);
                }
              }
            }

            borderData = null;
            selectedNodes = [];
            isDragging = false;
            preview.innerHTML = "";
            preview.remove();

            editorView.dispatch(tr);
          };

          document.addEventListener("mousedown", handleMouseDown);
          document.addEventListener("mousemove", handleMouseMove);
          document.addEventListener("mouseup", handleMouseUp);

          return {
            destroy() {
              document.removeEventListener("mousedown", handleMouseDown);
              document.removeEventListener("mousemove", handleMouseMove);
              document.removeEventListener("mouseup", handleMouseUp);
            },
          };
        },

        // IDEA
      }),
    ];
  },
});

export default DragAndDropNode;
