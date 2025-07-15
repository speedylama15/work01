import { generateHTML } from "@tiptap/core";

const documentLevelEventsInitializer = (editor) => {
  let isDragging = false;
  const arr = [];
  const preview = document.createElement("div");
  preview.className = "preview";

  const { view } = editor;

  const handleMouseDown = (e) => {
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
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  };

  const handleMouseUp = () => {
    isDragging = false;

    const tr = view.state.tr;

    arr.forEach(({ pos }) => {
      tr.setNodeAttribute(pos, "selected", false);
    });

    preview.innerHTML = "";
    preview.remove();

    view.dispatch(tr);
  };

  document.addEventListener("mousedown", handleMouseDown);

  document.addEventListener("mousemove", handleMouseMove);

  document.addEventListener("mouseup", handleMouseUp);

  // FIX: just in case I need this
  // selectstart(view, e) {
  //   if (e.metaKey) e.preventDefault();
  // },

  // dragstart(view, e) {
  //   e.preventDefault();
  // },
};

export default documentLevelEventsInitializer;
