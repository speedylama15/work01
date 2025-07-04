import { Plugin, PluginKey } from "@tiptap/pm/state";

export const flattenedEditorKey = new PluginKey("flattenedEditor");

function flatten(node, depth = 0) {
  // IDEA: maybe add more?
  const result = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };

  function traverse(currentNode, currentLevel) {
    if (currentNode.type.name === "block") {
      result[currentLevel].push({
        node: currentNode?.attrs?.id,
        // FIX: remove this and maybe add pos?
        textContent: currentNode?.textContent,
        depth: currentLevel,
      });
    }

    const nextDepth =
      currentNode.type.name === "group" ? currentLevel + 1 : currentLevel;

    currentNode.content.forEach((child) => {
      traverse(child, nextDepth);
    });
  }

  traverse(node, depth);

  return result;
}

// FIX: make sure this gets invoked when operations like deletion or moving happens and not simple typings
const flattenedEditor = new Plugin({
  key: flattenedEditorKey,

  state: {
    init(config, state) {
      console.log("INIT");

      console.log(flatten(state.doc, 0));

      return { flattenedEditor: flatten(state.doc, 0) };
    },

    apply(tr, value, oldState, newState) {
      console.log("APPLY");

      if (tr.docChanged) {
        return { flattenedEditor: flatten(newState.doc, 0) };
      }
    },
  },
});

export default flattenedEditor;
