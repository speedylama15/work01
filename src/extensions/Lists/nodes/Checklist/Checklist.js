import { Node, mergeAttributes } from "@tiptap/core";
import createDOMChecklist from "./utils/createDOMChecklist";
import mapping from "./constants/mapping";

const { name, marks, group, content, defining, options, attributes } = mapping;

const Checklist = Node.create({
  name,
  marks,
  group,
  content,
  defining,

  addOptions() {
    return options;
  },

  addAttributes() {
    return attributes;
  },

  addInputRules() {
    return [
      {
        find: /^\s*(\[([( |x])?\])\s$/,
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
              isChecked: false,
            })
            .run();
        },
      },
    ];
  },

  addNodeView() {
    return ({ HTMLAttributes, editor, view, node, getPos }) => {
      const { block, p } = createDOMChecklist(
        HTMLAttributes,
        editor,
        view,
        node,
        getPos
      );

      return { dom: block, contentDOM: p };
    };
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, options.blockAttrs),
      [
        "div",
        options.decoratorAttrs,
        [
          "div",
          options.contentAttrs,
          [
            "button",
            { class: "checkbox" },
            [
              "svg",
              {
                class: "checkmark",
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
              },
              [
                "path",
                {
                  d: "M20 6 9 17l-5-5",
                },
              ],
            ],
          ],
          ["p", {}, 0],
        ],
      ],
    ];
  },
});

export default Checklist;
