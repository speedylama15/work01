import { Node, mergeAttributes } from "@tiptap/core";

const getNearestBlockDepth = ($from) => {
  let error = null;
  let depth = 0;

  for (let i = $from.depth; i >= 0; i--) {
    const node = $from.node(i);

    if (!node) {
      error = "something has gone wrong";
      break;
    }

    if (node.attrs.nodeType === "block" || node.type.name === "doc") {
      depth = i;
      break;
    }
  }

  if (error) return { depth: 0, error };

  return { depth };
};

const name = "collection";

const Collection = Node.create({
  name,
  content: "block+",
  group: "block collection",
  // FIX
  selectable: true,

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

  addInputRules() {
    return [
      {
        find: /^``` /,
        handler: ({ state }) => {
          const { selection, tr } = state;
          const { $from } = selection;

          const depth = getNearestBlockDepth($from).depth;
          const node = $from.node(depth);
          const before = $from.before(depth);
          const after = before + node.nodeSize;
          const indentLevel = node?.attrs.indentLevel;

          const { paragraph, collection } = state.schema.nodes;
          const attrs = { indentLevel, contentType: name, nodeType: "block" };

          const pNode = paragraph.create(
            { nodeType: "block", contentType: "paragraph", indentLevel: 0 },
            node.content.cut(3)
          );
          const cNode = collection.create(attrs, pNode);

          tr.replaceWith(before, after, cNode);

          return tr;
        },
      },
    ];
  },

  addKeyboardShortcuts() {
    return {
      Tab: ({ editor }) => {
        // REVIEW: from and to can differ
        // REVIEW: need to handle when working with Table
        const { tr } = editor.state;
        const { dispatch } = editor.view;
        const { $from, from, to } = editor.state.selection;

        if (from === to) {
          const { depth } = getNearestBlockDepth($from);
          if (!depth) return;

          const node = $from.node(depth);
          if (!node) return;
          const before = $from.before(depth);

          tr.setNodeAttribute(
            before,
            "indentLevel",
            parseInt(node.attrs.indentLevel) + 1
          );

          dispatch(tr);
        }
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
      ["div", this.options.contentAttrs, 0],
    ];
  },
});

export default Collection;
