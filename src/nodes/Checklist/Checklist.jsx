import { Node, mergeAttributes } from "@tiptap/core";

const Checklist = Node.create({
  name: "checklist",
  group: "block list",
  content: "inline*",
  // FIX: add more marks later
  marks: "bold italic underline superscript highlight",
  defining: true,

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

  // FIX: I need to add in more attributes like aria
  // FIX: maybe allow customizability?
  addNodeView() {
    return ({ HTMLAttributes, editor, view, node, getPos }) => {
      const { dispatch } = view;

      const svgNS = "http://www.w3.org/2000/svg";
      const block = document.createElement("div");
      const decorator = document.createElement("div");
      const content = document.createElement("div");
      const button = document.createElement("button");
      const svg = document.createElementNS(svgNS, "svg");
      const path = document.createElementNS(svgNS, "path");
      const p = document.createElement("p");

      block.className = "block block-checklist";
      block.setAttribute("data-node-type", HTMLAttributes["data-node-type"]);
      block.setAttribute("data-is-checked", HTMLAttributes["data-is-checked"]);
      block.setAttribute("data-selected", HTMLAttributes["data-selected"]);
      block.setAttribute(
        "data-content-type",
        HTMLAttributes["data-content-type"]
      );
      block.setAttribute(
        "data-indent-level",
        HTMLAttributes["data-indent-level"]
      );

      decorator.className = "decorator decorator-checklist";
      decorator.setAttribute("data-node-type", "decorator");

      content.className = "content content-checklist";
      content.setAttribute("data-node-type", "content");

      button.className = "checkbox";

      svg.classList.add("checkmark");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      svg.setAttribute("viewBox", "0 0 24 24");

      path.setAttribute("d", "M20 6 9 17l-5-5");

      block.appendChild(decorator);
      decorator.appendChild(content);
      content.appendChild(button);
      content.appendChild(p);
      button.appendChild(svg);
      svg.appendChild(path);

      button.addEventListener("mousedown", () => {
        const { state } = editor;
        const { tr } = state;

        const value = JSON.parse(node.attrs?.isChecked);
        const newValue = !value;

        tr.setNodeAttribute(getPos(), "isChecked", newValue);

        dispatch(tr);
      });

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
      selected: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-selected"),
        renderHTML: (attributes) => ({
          "data-selected": attributes.selected,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-content-type="checklist"]' }];
  },

  // FIX: have to make sure that it matches above
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        class: "block block-checklist",
      }),
      [
        "div",
        {
          class: "decorator decorator-checklist",
          "data-node-type": "content",
        },
        [
          "div",
          {
            class: "content content-checklist",
            "data-node-type": "content",
          },
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

{
  /* <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
>
  <path d="M20 6 9 17l-5-5"></path>
</svg>; */
}

export default Checklist;
