import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import getHasSuperscript from "./utils/getHasSuperscript";
import { createOptions, createAttributes } from "../../../../utils";

const name = "verses";
// IDEA: color should also be allowed
const marks = "bold italic underline strike highlight superscript";
const group = "block verse";
const content = "text*";
const whitespace = "pre";
const defining = true;
const priority = 150;
const options = createOptions("verses");
const attributes = createAttributes("verses");

const Verses = Node.create({
  name,
  marks,
  group,
  content,
  whitespace,
  defining,
  priority,

  addOptions() {
    return options;
  },

  addAttributes() {
    return attributes;
  },

  addInputRules() {
    return [
      {
        find: /^```([a-z]+)?[\s\n]$/,
        handler: ({ range, chain, state }) => {
          const { selection } = state;
          const { $from } = selection;

          const node = $from.node($from.depth);
          const indentLevel = node?.attrs.indentLevel;

          chain()
            .deleteRange(range)
            .setNode(this.name, {
              indentLevel,
              contentType: name,
              nodeType: "block",
            })
            .run();
        },
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      Space: ({ editor }) => {
        const { $from } = editor.state.selection;

        let hasSuperscript = getHasSuperscript($from);

        if (hasSuperscript) return editor.commands.unsetSuperscript();
      },

      Enter: ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        let hasSuperscript = getHasSuperscript($from);

        if (hasSuperscript) return editor.commands.unsetSuperscript();

        if (node.type.name === name) return editor.commands.insertContent("\n");
      },

      "Mod-Enter": ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) {
          const after = $from.after($from.depth);

          return editor.commands.insertContentAt(after, { type: "paragraph" });
        }
      },

      Tab: ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) return editor.commands.insertContent("\t");
      },

      "Shift-^": ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) return editor.commands.toggleSuperscript();
      },
    };
  },

  addProseMirrorPlugins() {
    // const decors = [];

    return [
      new Plugin({
        key: new PluginKey("versesPluginKey"),

        props: {
          decorations(state) {
            return this.getState(state);
          },

          handleKeyDown() {},
        },

        view() {
          return {
            update() {
              console.log("updating inside view");
            },
          };
        },

        appendTransaction() {
          console.log("append");
        },

        state: {
          init(config, editorState) {
            const decorations = [];

            return DecorationSet.create(editorState.doc, decorations);
          },

          apply(tr, oldSet, oldState, newState) {
            const decorations = [];

            const { $from } = newState.selection;
            const node = $from.node($from.depth);
            const start = $from.start($from.depth);

            if (node.type.name === "verses") {
              const regex = /(\[\d+\])/;
              const arr = node.textContent.split(regex);
              if (arr.length > 0 && arr[0] === "") arr.shift();

              const data = [];
              let step = 0;
              let foundationalStr = "";
              // let s = start - step * 2;
              let s = start;

              arr.forEach((str, i) => {
                const isMatching = regex.test(str);
                if (isMatching) {
                  if (foundationalStr) {
                    data.push(foundationalStr);

                    const decor = Decoration.inline(
                      s,
                      s + foundationalStr.length,
                      {
                        class: "initial-highlight",
                      }
                    );

                    decorations.push(decor);
                    step = step + 1;
                    s = s + foundationalStr.length;
                  }
                  foundationalStr = str;
                } else {
                  foundationalStr = foundationalStr + str;
                }

                if (i === arr.length - 1) {
                  data.push(foundationalStr);

                  const decor = Decoration.inline(
                    s,
                    s + foundationalStr.length,
                    {
                      class: "initial-highlight",
                    }
                  );

                  decorations.push(decor);
                }
              });

              // console.log("data testing", data);

              return DecorationSet.create(newState.doc, decorations);
              // IDEA
            }

            return oldSet.map(tr.mapping, tr.doc);
          },
        },
      }),
    ];
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, options.blockAttrs),
      ["div", options.decoratorAttrs, ["div", options.contentAttrs, 0]],
    ];
  },
});

export default Verses;
