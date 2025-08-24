import { Node, mergeAttributes } from "@tiptap/core";

const name = "paragraph";

const Paragraph = Node.create({
  name,
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight externalLink",
  group: "block",
  content: "inline*",
  priority: 120,

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
    };
  },

  addCommands() {
    return {
      setParagraph:
        (selectedNode) =>
        ({ editor, tr, dispatch }) => {
          const { state, schema } = editor;
          const { selection } = state;
          const { $from } = selection;

          const node = selectedNode ? selectedNode : $from.node($from.depth);
          const before = $from.before($from.depth);
          const after = before + node.nodeSize;
          const content = node.content;
          const { id, indentLevel } = node.attrs;

          const attrs = {
            id,
            indentLevel,
            contentType: "paragraph",
            nodeType: "block",
          };

          const paragraphNode = schema.nodes.paragraph.create(attrs, content);

          tr.replaceWith(before, after, paragraphNode);
          // FIX
          // tr.setSelection(
          //   TextSelection.create(tr.doc, tr.mapping.map(before) + 1)
          // );

          dispatch(tr);

          return true;
        },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }, { tag: "p" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, this.options.blockAttrs),
      ["div", this.options.contentAttrs, ["paragraph", {}, 0]],
    ];
  },
});

export default Paragraph;
