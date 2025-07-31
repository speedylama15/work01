import { Node, mergeAttributes } from "@tiptap/core";

const name = "video";

const Video = Node.create({
  name,
  group: "block video",
  defining: true,

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
      videoSrc: {
        default: null,
        parseHTML: (element) => element.getAttribute("src"),
        renderHTML: (attributes) => ({
          src: attributes.videoSrc,
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
          ["video", { src: HTMLAttributes["src"], controls: true }],
        ],
      ],
    ];
  },
});

export default Video;
