import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { generateHTML } from "@tiptap/core";

// IDEA: domSelection()
// IDEA: domSelectionRange()
// IDEA: view.posAtDom(element, 0)
// IDEA: view.state.doc.nodeAt(pos)
// IDEA: view.domAtPos(from)
// IDEA: view.nodeDOM(pos);
const DragHandleExtension = Extension.create({
  name: "DragHandleExtension",

  addProseMirrorPlugins() {
    const arr = [];
    let isDragging = false;
    const editor = this.editor;
    const preview = document.createElement("div");
    preview.className = "preview";

    return [
      new Plugin({
        key: new PluginKey("dragHandle"),

        props: {
          handleDOMEvents: {
            mouseover() {},

            mouseleave() {},

            mousedown(view, e) {
              const { from, to } = view.state.selection;
              const tr = view.state.tr;

              if (e.metaKey) {
                e.preventDefault();

                isDragging = true;

                view.state.doc.nodesBetween(from, to, (node, pos) => {
                  const nodeType = node?.attrs?.nodeType;

                  if (nodeType === "block") {
                    const dom = view.nodeDOM(pos);
                    const p = dom.querySelector("p");
                    const htmlString = generateHTML(
                      view.state.doc.nodeAt(pos).toJSON(),
                      editor.extensionManager.extensions
                    );

                    p.insertAdjacentHTML("beforeEnd", htmlString);
                    preview.appendChild(dom);

                    arr.push({
                      dom,
                      node,
                      pos,
                    });

                    tr.setNodeAttribute(pos, "selected", true);
                  }
                });

                view.dispatch(tr);
              }

              // FIX
              document.body.append(preview);
              // FIX: maybe I can perfect this but right now I am satisfied
              preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            },

            mousemove(view, e) {
              if (isDragging) {
                preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
              }
            },

            mouseup(view) {
              isDragging = false;

              const tr = view.state.tr;

              arr.forEach(({ pos }) => {
                tr.setNodeAttribute(pos, "selected", false);
              });

              preview.innerHTML = "";
              preview.remove();

              view.dispatch(tr);
            },

            selectstart(view, e) {
              if (e.metaKey) e.preventDefault();
            },

            dragstart(view, e) {
              e.preventDefault();
            },
          },
        },
      }),
    ];
  },
});

export default DragHandleExtension;
