import { Node, mergeAttributes } from "@tiptap/core";

const name = "image";

const Image = Node.create({
  name,
  group: "block image",
  content: "",
  defining: true,
  atom: true,

  addOptions() {
    return {
      blockAttrs: { class: `block block-${name}` },
      decoratorAttrs: {
        class: `decorator decorator-${name}`,
        "data-node-type": "decorator",
      },
      contentAttrs: {
        class: `content content-${name}`,
        "data-node-type": "content",
      },
    };
  },

  addAttributes() {
    return {
      imgSrc: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({
          src: attributes.imgSrc,
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
        default: name,
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
    return [{ tag: `div[data-content-type="${name}"]` }];
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
          ["img", { src: HTMLAttributes["src"] }],
        ],
      ],
    ];
  },
});

export default Image;
