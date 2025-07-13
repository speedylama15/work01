import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const PlaceholderDecor = Extension.create({
  name: "placeholderDecor",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("placeholderDecor"),

        state: {
          init() {
            return DecorationSet.empty;
          },

          apply(tr, value, oldState, newState) {
            const decorations = [];

            const { selection } = newState;
            const { $from } = selection;

            tr.doc.descendants((node, pos) => {
              const contentType = node?.attrs?.contentType;
              const nodeType = node?.attrs?.nodeType;

              if (nodeType === "block" && !node.childCount) {
                let nodeDecor = null;

                if (
                  contentType === "bulletList" ||
                  contentType === "checklist" ||
                  contentType === "numberedList"
                ) {
                  nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                    class: "emptyList",
                  });
                }

                if (contentType === "heading") {
                  nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                    class: "emptyHeading",
                  });
                }

                if (contentType === "paragraph") {
                  if ($from.pos - 1 === pos) {
                    nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                      class: "emptyBlock",
                    });
                  }
                }

                if (nodeDecor) {
                  decorations.push(nodeDecor);
                }

                return false;
              }
            });

            return DecorationSet.create(tr.doc, decorations);
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

export default PlaceholderDecor;
