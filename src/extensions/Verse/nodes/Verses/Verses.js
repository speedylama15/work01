import { Node, mergeAttributes } from "@tiptap/core";
import { PluginKey, Plugin, TextSelection } from "@tiptap/pm/state";

import { createOptions, createAttributes } from "../../../../utils";
import getHasSuperscript from "./utils/getHasSuperscript";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

const name = "verses";
// IDEA: color should also be allowed
const marks = "bold italic underline strike highlight superscript";
const group = "block verse";
const content = "inline*";
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
        find: /\[(\d+)\] $/,
        handler: ({ state, match, range, chain }) => {
          const filter = match[0].match(/\[(\d+)\] /);
          const number = filter[1];

          const { selection } = state;
          const { from } = selection;

          const text1 = state.schema.text(number, [
            state.schema.marks.superscript.create(),
          ]);
          const text2 = state.schema.text(" ");

          chain()
            .insertContentAt(from, text1)
            .unsetSuperscript()
            .insertContentAt(from + text1.nodeSize, text2)
            .deleteRange(range)
            .run();
        },
      },
      // IDEA: move these 2 into a different section
      {
        find: /\[$/,
        handler: ({ state, range }) => {
          const { tr } = state;

          tr.insertText("[]", range.from, range.to);
          tr.setSelection(TextSelection.create(tr.doc, range.from + 1));
          return tr;
        },
      },
      {
        find: /\{$/,
        handler: ({ state, range }) => {
          const { tr } = state;

          tr.insertText("{}", range.from, range.to);
          tr.setSelection(TextSelection.create(tr.doc, range.from + 1));
          return tr;
        },
      },
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

        if (hasSuperscript) {
          const textNode = editor.state.schema.text(" ");

          return editor
            .chain()
            .unsetSuperscript()
            .insertContentAt($from.pos, textNode)
            .run();
        }
      },

      Enter: ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) {
          const { tr } = editor.state;

          console.log(tr.doc.resolve($from.pos));

          return true;

          return editor.commands.insertContent("\n");
        }
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

        if (node.type.name === name) {
          const span = editor.state.schema.nodes.span.create({});

          return editor.commands.insertContentAt($from.pos, span);
        }
      },

      "Shift-^": ({ editor }) => {
        const { $from } = editor.state.selection;

        const node = $from.node($from.depth);

        if (node.type.name === name) {
          return editor.commands.toggleSuperscript();
        }
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("versesPluginKey"),

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },

        view() {
          return {
            update() {
              // console.log("updating inside view");
            },
          };
        },

        appendTransaction() {
          // console.log("append");
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
            let start = $from.start($from.depth);

            if (node.type.name === "verses") {
              const regex = /(\n|\t)/;
              const newlineRegex = /\n/g;
              const tabRegex = /\t/g;

              const arr = node.textContent.split(regex);
              if (arr.length > 0 && arr[0] === "") arr.shift();

              arr.forEach((str) => {
                const isNewline = newlineRegex.test(str);
                const isTab = tabRegex.test(str);

                if (isNewline || isTab) {
                  const decoration = Decoration.inline(
                    start,
                    start + str.length,
                    { class: isNewline ? "newline" : "tab" }
                  );

                  decorations.push(decoration);
                }

                start = isNewline || isTab ? start + 1 : start + str.length;
              });

              // console.log(decorations);

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
