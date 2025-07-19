import {
  canInsertNode,
  isNodeSelection,
  mergeAttributes,
  Node,
  nodeInputRule,
} from "@tiptap/core";
import { NodeSelection, TextSelection } from "@tiptap/pm/state";

const Divider = Node.create({
  name: "divider",
  group: "block",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type,
      }),
    ];
  },

  parseHTML() {
    return [{ tag: "hr" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["hr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addCommands() {
    return {
      setHorizontalRule:
        () =>
        ({ chain, state }) => {
          if (!canInsertNode(state, state.schema.nodes[this.name])) {
            return false;
          }

          const { selection } = state;
          const { $from: $originFrom, $to: $originTo } = selection;
          const currentChain = chain();

          if ($originFrom.parentOffset === 0) {
            currentChain.insertContentAt(
              {
                from: Math.max($originFrom.pos - 1, 0),
                to: $originTo.pos,
              },
              {
                type: this.name,
              }
            );
          } else if (isNodeSelection(selection)) {
            currentChain.insertContentAt($originTo.pos, {
              type: this.name,
            });
          } else {
            currentChain.insertContent({ type: this.name });
          }

          return currentChain
            .command(({ tr, dispatch }) => {
              if (dispatch) {
                const { $to } = tr.selection;
                const posAfter = $to.end();

                if ($to.nodeAfter) {
                  if ($to.nodeAfter.isTextblock) {
                    tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1));
                  } else if ($to.nodeAfter.isBlock) {
                    tr.setSelection(NodeSelection.create(tr.doc, $to.pos));
                  } else {
                    tr.setSelection(TextSelection.create(tr.doc, $to.pos));
                  }
                } else {
                  const node =
                    $to.parent.type.contentMatch.defaultType?.create();

                  if (node) {
                    tr.insert(posAfter, node);
                    tr.setSelection(TextSelection.create(tr.doc, posAfter + 1));
                  }
                }

                // IDEA: this exists
                tr.scrollIntoView();
              }
              return true;
            })
            .run();
        },
    };
  },
});

export default Divider;
