import { Plugin, PluginKey } from "@tiptap/pm/state";

export const constructHierarchyKey = new PluginKey("constructHierarchy");

const construct = (doc) => {
  const obj = {};

  doc.descendants((node, pos) => {
    if (node.attrs?.nodeType === "block") {
      const cId = node.attrs.id;
      const cIndentLevel = parseInt(node.attrs.indentLevel);
      const cContentType = node.attrs.contentType;

      if (!obj[cIndentLevel]) {
        obj[cIndentLevel] = [{ id: cId, pos, contentType: cContentType }];
      } else {
        obj[cIndentLevel].push({ id: cId, pos, contentType: cContentType });
      }

      return false;
    }
  });

  return obj;
};

const constructHierarchy = new Plugin({
  key: constructHierarchyKey,

  view: () => ({
    update: () => {},
  }),

  state: {
    init(config, state) {
      return { hierarchy: construct(state.doc) };
    },
    // REVIEW: each time a change occurs this gets invoked
    // REVIEW: even if it does nothing, you still need to return a state
    apply(tr, value, oldState, newState) {
      // FIX: I need to find a way to make this calculation only when it's necessary
      // FIX: tr.docChanged
      return { hierarchy: construct(newState.doc) };
    },
  },
});

export default constructHierarchy;
