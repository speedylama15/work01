import { Node, mergeAttributes } from "@tiptap/core";

import { createChecklist } from "./helpers/createChecklist";

const Checklist = Node.create({
  name: "checklist",
  group: "block list",
  content: "inline*",
  marks: "bold italic underline superscript highlight",
  defining: true,

  addOptions() {
    return {
      blockAttrs: { class: "block block-checklist" },
      decoratorAttrs: {
        class: "decorator decorator-checklist",
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: "content content-checklist",
        "data-node-type": "content",
      },
    };
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
              contentType: "checklist",
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
      // FIX: I need to add in more attributes like aria
      // FIX: maybe allow customizability?
      const { block, p } = createChecklist(
        HTMLAttributes,
        editor,
        view,
        node,
        getPos
      );

      return { dom: block, contentDOM: p };
    };
  },

  addAttributes() {
    return {
      isChecked: {
        default: false,
        parseHTML: (element) =>
          element.getAttribute("data-is-checked") === "true",
        renderHTML: (attributes) => ({
          "data-is-checked": attributes.isChecked,
        }),
      },
      indentLevel: {
        default: 0,
        parseHTML: (element) => element.getAttribute("data-indent-level"),
        renderHTML: (attributes) => ({
          "data-indent-level": attributes.indentLevel,
        }),
      },
      contentType: {
        default: "checklist",
        parseHTML: (element) => element.getAttribute("data-content-type"),
        renderHTML: (attributes) => ({
          "data-content-type": attributes.contentType,
        }),
      },
      nodeType: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-node-type"),
        renderHTML: (attributes) => ({
          "data-node-type": attributes.nodeType,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-content-type="checklist"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      [
        "div",
        this.options.decoratorAttrs,
        [
          "div",
          this.options.contentAttrs,
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
