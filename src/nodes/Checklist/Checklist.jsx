import { Node, mergeAttributes } from "@tiptap/core";

const Checklist = Node.create({
  name: "checklist",
  group: "block list",
  content: "inline*",
  // FIX: add more marks later
  marks: "bold italic underline superscript highlight",
  defining: true,

  // FIX: add a markdown []
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
            })
            .run();
        },
      },
    ];
  },

  // FIX: I need to add in more attributes like aria
  // FIX: I need to add a "click" event listener and strikethrough mark to the paragraph
  // FIX: maybe allow customizability?
  addNodeView() {
    return (params) => {
      console.log(params);

      const { HTMLAttributes } = params;

      const svgNS = "http://www.w3.org/2000/svg";

      const block = document.createElement("div");
      const decorator = document.createElement("div");
      const content = document.createElement("div");
      const button = document.createElement("button");
      const svg = document.createElementNS(svgNS, "svg"); // ← Use createElementNS
      const path = document.createElementNS(svgNS, "path"); // ← Use createElementNS
      const p = document.createElement("p");

      block.className = "block block-checklist";
      block.setAttribute(
        "data-content-type",
        HTMLAttributes["data-content-type"]
      );
      block.setAttribute(
        "data-indent-level",
        HTMLAttributes["data-indent-level"]
      );
      block.setAttribute("data-node-type", HTMLAttributes["data-node-type"]);
      // FIX
      block.setAttribute("data-is-checked", true);

      decorator.className = "decorator decorator-checklist";
      decorator.setAttribute("data-node-type", "decorator");

      content.className = "content content-checklist";
      content.setAttribute("data-node-type", "content");

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

      return { dom: block, contentDOM: p };
    };
  },

  addAttributes() {
    return {
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
            {},
            [
              "svg",
              {
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
