import { Extension } from "@tiptap/core";
import { PluginKey, Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const Placeholder = Extension.create({
  name: "placeholder",

  // IDEA: maybe I should use a switch case?
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("placeholderPluginKey"),

        state: {
          init() {
            return DecorationSet.empty;
          },

          apply(tr, value, oldState, newState) {
            const decorations = [];

            const { selection } = newState;
            const { from, to } = selection;

            tr.doc.descendants((node, pos) => {
              const contentType = node?.attrs?.contentType;
              const nodeType = node?.attrs?.nodeType;

              // REVIEW: now we establish that all blocks that we work with here are EMPTY
              if (
                nodeType === "block" &&
                contentType !== "versesCollection" &&
                !node.childCount
              ) {
                let nodeDecor = null;

                if (
                  contentType === "bulletList" ||
                  contentType === "checklist" ||
                  contentType === "numberedList"
                ) {
                  nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                    class: "empty-list",
                  });
                }

                if (contentType === "blockquote") {
                  nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                    class: "empty-blockquote",
                  });
                }

                if (
                  contentType === "heading1" ||
                  contentType === "heading2" ||
                  contentType === "heading3"
                ) {
                  nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                    class: "empty-heading",
                  });
                }

                if (contentType === "verse") {
                  if (from === to && from === pos + 1) {
                    nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                      class: "empty-verse",
                    });
                  }
                }

                if (contentType === "paragraph") {
                  if (from === to && from === pos + 1) {
                    nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                      class: "empty-paragraph",
                    });
                  }
                }

                if (nodeDecor) {
                  decorations.push(nodeDecor);
                }

                return true;
              }

              if (contentType === "versesItem" && !node.childCount) {
                let nodeDecor = null;

                if (from === to && from === pos + 1) {
                  nodeDecor = Decoration.node(pos, pos + node.nodeSize, {
                    class: "empty-versesItem",
                  });
                }

                if (nodeDecor) {
                  decorations.push(nodeDecor);
                }

                return true;
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

export default Placeholder;
