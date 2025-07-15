import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";

// IDEA: domSelection()
// IDEA: domSelectionRange()
// IDEA: view.posAtDom(element, 0)
// IDEA: view.state.doc.nodeAt(pos)
// IDEA: view.domAtPos(from)
// IDEA: view.nodeDOM(pos);
const DragHandleExtension = Extension.create({
  name: "DragHandleExtension",

  addProseMirrorPlugins() {
    // const arr = [];
    // let isDragging = false;
    // const editor = this.editor;
    // const preview = document.createElement("div");
    // preview.className = "preview";

    return [
      new Plugin({
        key: new PluginKey("dragHandle"),

        props: {
          handleDOMEvents: {},
        },
      }),
    ];
  },
});

export default DragHandleExtension;
