import { Node, mergeAttributes } from "@tiptap/core";
import { Fragment } from "@tiptap/pm/model";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";

const getDepthSubtract = ($from) => {
  let subtract = 0;

  for (let i = 0; i < 3; i++) {
    const node = $from.node($from.depth - i);

    if (node?.attrs?.nodeType === "block") {
      subtract = i;
      break;
    }
  }

  return subtract;
};

const name = "verseWithCitation";

const VerseWithCitation = Node.create({
  name,
  // IDEA: link color
  marks: "bold italic underline strike highlight",
  group: "block verse",
  content: "inline*",
  defining: true,
  // FIX
  priority: 99,

  addOptions() {
    return {
      blockAttrs: { class: `block block-${name}` },
      contentAttrs: {
        class: `content content-${name}`,
      },
    };
  },

  addAttributes() {
    return {
      contentType: {
        default: name,
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      nodeType: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
      citation: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-citation"),
        renderHTML: (attributes) => ({
          "data-citation": attributes.citation,
        }),
      },
      isBracketMode: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-is-bracket-mode"),
        renderHTML: (attributes) => ({
          "data-is-bracket-mode": attributes.isBracketMode,
        }),
      },
    };
  },

  addInputRules() {
    return [
      {
        // find: /^\[([^\]]*)\]\[([^\]]*)\] /,
        find: /^\[([^\]]*)\]\[([^\]]*)\]\s/,
        handler: ({ chain, state, match }) => {
          // FIX
          console.log("input rule");

          const { selection } = state;
          const { $from } = selection;

          const subtract = getDepthSubtract($from);
          const node = $from.node($from.depth - subtract);
          const isNumberRegex = /^\d+$/;
          const citation = match[1];
          const verse = match[2];
          const input = match.input;
          const isVerse = isNumberRegex.test(citation);

          if (node) {
            const { id, indentLevel } = node;
            const before = $from.before($from.depth - subtract);

            const f = 2 + citation.length + 1;
            const t = f + verse.length;
            const content = node.content.cut(f, t);

            if (isVerse) {
              const verseNode = state.schema.nodes.verse.create(
                {
                  id,
                  indentLevel,
                  contentType: name,
                  nodeType: "block",
                  verseNumber: citation,
                },
                content
              );

              chain()
                .insertContentAt(
                  { from: before, to: before + node.nodeSize },
                  verseNode
                )
                .run();
            } else {
              const verseWithCitation =
                state.schema.nodes.verseWithCitation.create(
                  {
                    id,
                    indentLevel,
                    contentType: name,
                    nodeType: "block",
                    citation,
                    isBracketMode: false,
                  },
                  content
                );

              const paragraph = state.schema.nodes.paragraph.create(
                { indentLevel: 0, contentType: "paragraph", nodeType: "block" },
                node.content.cut(input.length - 1)
              );

              chain()
                .insertContentAt(
                  { from: before, to: before + node.nodeSize },
                  verseWithCitation
                )
                .insertContent(paragraph)
                .setMeta("vwcInputRule", true)
                .run();
            }
          }
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        // FIX
        key: new PluginKey("inspection"),

        appendTransaction(transactions, oldState, newState) {
          const { $from: $oFrom } = oldState.selection;
          const { $from: $nFrom } = newState.selection;
          const oNode = $oFrom.parent;
          const nNode = $nFrom.parent;
          const isVWCInputRule = transactions.some(
            (tr) => tr.meta.vwcInputRule
          );

          // const regex = /^\[([^\]]*)\]\[([^\]]*)\]\s/
          const regex = /^\[([^\]]*)\]\[([^\]]*)\]/;

          // IDEA: ID cannot be the same
          // IDEA: 입성을 할 때, 그 노드가 vwc
          if (oNode.attrs.id !== nNode.attrs.id && nNode.type.name === name) {
            const newTr = newState.tr;

            const nBefore = $nFrom.before(
              $nFrom.depth - getDepthSubtract($nFrom)
            );

            const { id, indentLevel, citation } = nNode.attrs;

            // FIX
            console.log("Brackets");

            const nodes = [
              newState.schema.text("["),
              newState.schema.text(citation),
              newState.schema.text("]"),
              newState.schema.text("["),
              ...nNode.content.content,
              newState.schema.text("]"),
            ];

            const pNode = newState.schema.nodes.paragraph.create(
              {
                id,
                indentLevel,
              },
              Fragment.from(nodes)
            );

            return newTr
              .replaceWith(nBefore, nBefore + nNode.nodeSize, pNode)
              .setSelection(
                TextSelection.create(newTr.doc, nBefore + pNode.nodeSize - 2)
              );
          } else if (
            oNode.attrs.id !== nNode.attrs.id &&
            !isVWCInputRule &&
            regex.test(oNode.textContent)
            // &&
            // !regex.test(nNode.textContent)
            // &&
            // $oFrom.end($oFrom.depth - getDepthSubtract($oFrom)) === $oFrom.pos
          ) {
            // TODO
            // FIX
            console.log("VWC");

            const newTr = newState.tr;

            const match = oNode.textContent.match(regex);
            const citation = match[1];
            const verse = match[2];

            const { id, indentLevel } = oNode;
            const oBefore = $oFrom.before(
              $oFrom.depth - getDepthSubtract($oFrom)
            );

            const f = 2 + citation.length + 1;
            const t = f + verse.length;
            const content = oNode.content.cut(f, t);

            const verseWithCitation =
              newState.schema.nodes.verseWithCitation.create(
                {
                  id,
                  indentLevel,
                  contentType: name,
                  nodeType: "block",
                  citation,
                  isBracketMode: false,
                },
                content
              );

            return newTr.replaceWith(
              oBefore,
              oBefore + oNode.nodeSize,
              verseWithCitation
            );
          }
        },

        state: {
          init() {
            return {};
          },

          apply(tr, value, oldState, newState) {},
        },

        props: {},
      }),
    ];
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    // // FIX
    // console.log(
    //   "UMM RENDERHTML???",
    //   HTMLAttributes,
    //   HTMLAttributes["data-is-bracket-mode"]
    // );

    console.log("UMM RENDERHTML???");

    return HTMLAttributes["data-is-bracket-mode"]
      ? [
          "div",
          mergeAttributes(HTMLAttributes, this.options.blockAttrs),
          [
            "div",
            mergeAttributes(
              // { "data-verse-number": HTMLAttributes["data-verse-number"] },
              this.options.contentAttrs
            ),
            // ["verse-with-citation", {}, 0],
            ["h1", {}, 0],
          ],
        ]
      : [
          "div",
          mergeAttributes(HTMLAttributes, this.options.blockAttrs),
          [
            "div",
            mergeAttributes(
              { "data-verse-number": HTMLAttributes["data-verse-number"] },
              this.options.contentAttrs
            ),
            [
              "div",
              {
                class: "citation",
                "data-citation": HTMLAttributes["data-citation"],
                contenteditable: "false",
              },
            ],
            ["verse-with-citation", {}, 0],
          ],
        ];
  },
});

export default VerseWithCitation;
