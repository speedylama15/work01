import { Node, mergeAttributes } from "@tiptap/core";

const name = "versesCollection";

const getIsSuperscript = (marks) => {
  return marks.some((mark) => mark.type.name === "superscript");
};

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

const getDepthAddition = ($from) => {
  let addition = 0;

  for (let i = 0; i < 3; i++) {
    const node = $from.node($from.depth + i);

    if (node?.attrs?.nodeType === "item") {
      addition = i;
      break;
    }
  }

  return addition;
};

const isItemSelected = (pos, item, from, to) => {
  const s = pos + 1;
  const e = pos + item.nodeSize - 1;

  let isSelected = false;

  if (s < from && from < e) isSelected = true;
  if (from <= s && e <= to) isSelected = true;
  if (s < to && to < e) isSelected = true;

  return isSelected;
};

const traverseCollection = (editor, collectionNode, callback) => {
  const { state } = editor;
  const { selection, tr } = state;
  const { $from, from, to } = selection;

  const addition = getDepthAddition($from);
  let pos = $from.before($from.depth + addition);
  const resolvedPos = tr.doc.resolve(pos);
  const startIndex = resolvedPos.index();
  let prevItemNode = {
    item: resolvedPos.nodeBefore,
    isSelected: resolvedPos.nodeBefore
      ? isItemSelected(
          pos - resolvedPos.nodeBefore.nodeSize,
          resolvedPos.nodeBefore,
          from,
          to
        )
      : false,
  };

  for (let i = startIndex; i < collectionNode.children.length; i++) {
    const item = collectionNode.children[i];
    const nextPos = pos + item.nodeSize;
    const isSelected = isItemSelected(pos, item, from, to);

    if (callback({ item, isSelected }, pos, nextPos, prevItemNode, i)) {
      break;
    }

    prevItemNode = { item, isSelected };
    pos = pos + item.nodeSize;
  }
};

const VersesCollection = Node.create({
  name,
  group: "block",
  // content: "versesItem+",
  content: "block+",
  defining: true,
  priority: 100,

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

          const node = $from.node($from.depth);
          const before = $from.before($from.depth);
          const after = before + node.nodeSize;
          const indentLevel = node?.attrs.indentLevel;

          const { versesCollection, versesItem } = state.schema.nodes;
          const attrs = { indentLevel, contentType: name, nodeType: "block" };

          // IDEA: item does not really need attributes
          const item = versesItem.create({}, node.content.cut(3));
          const collection = versesCollection.create(attrs, item);

          tr.replaceWith(before, after, collection);

          return tr;
        },
      },
    ];
  },

  addCommands() {
    return {
      indentSingleItem:
        (itemNode) =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          const pos = $from.before($from.depth);
          const indentLevel = parseInt(itemNode?.attrs?.indentLevel);

          // IDEA: max is 10
          if (indentLevel === 10) return true;

          tr.setNodeAttribute(pos, "indentLevel", indentLevel + 1);

          dispatch(tr);

          return true;
        },

      indentMultipleItems:
        () =>
        ({ editor, tr, dispatch }) => {
          let canExitLoop = false;

          const { $from } = editor.state.selection;

          const subtract = getDepthSubtract($from);
          const collectionNode = $from.node($from.depth - subtract);

          traverseCollection(
            editor,
            collectionNode,
            ({ item, isSelected }, pos) => {
              if (isSelected) canExitLoop = true;
              if (!isSelected && canExitLoop) return true;

              if (isSelected) {
                const indentLevel = parseInt(item?.attrs?.indentLevel);

                if (indentLevel !== 10)
                  tr.setNodeAttribute(pos, "indentLevel", indentLevel + 1);
              }
            }
          );

          dispatch(tr);

          return true;
        },

      outdentSingleItem:
        () =>
        ({ editor, tr, dispatch }) => {
          const { state } = editor;
          const { selection } = state;
          const { $from } = selection;

          const itemNode = $from.node($from.depth);
          const pos = $from.before($from.depth);
          const indentLevel = parseInt(itemNode?.attrs?.indentLevel);

          if (indentLevel === 0) return true;

          tr.setNodeAttribute(pos, "indentLevel", indentLevel - 1);

          dispatch(tr);

          return true;
        },

      outdentMultipleItems:
        () =>
        ({ editor, tr, dispatch }) => {
          let canExitLoop = false;

          const { $from } = editor.state.selection;

          const subtract = getDepthSubtract($from);
          const collectionNode = $from.node($from.depth - subtract);

          traverseCollection(
            editor,
            collectionNode,
            ({ item, isSelected }, pos) => {
              if (isSelected) canExitLoop = true;
              if (!isSelected && canExitLoop) return true;

              if (isSelected) {
                const indentLevel = parseInt(item?.attrs?.indentLevel);

                if (indentLevel !== 0)
                  tr.setNodeAttribute(pos, "indentLevel", indentLevel - 1);
              }
            }
          );

          dispatch(tr);

          return true;
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, from, to } = selection;
        const { parentOffset } = $from;
        const subtract = getDepthSubtract($from);
        const collectionNode = $from.node($from.depth - subtract);

        if (collectionNode.type.name === "versesCollection") {
          const start = $from.start($from.depth - subtract);
          const blockFirstItenStart = start + 1;

          if (from === to) {
            // IDEA: this is when the block is empty and it's at 0
            if (!collectionNode?.textContent && parentOffset === 0) {
              // FIX
              console.log("Set to Paragraph");
              return true;
            }
            // IDEA: this is when it is not empty and it's at 0, do NOTHING
            if (blockFirstItenStart === from) return true;
          }
        }
      },

      Tab: ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, from, to } = selection;

        const itemNode = $from.node($from.depth);

        if (from === to && itemNode?.attrs.nodeType === "item") {
          return editor.commands.indentSingleItem(itemNode);
        }

        if (from !== to) {
          return editor.commands.indentMultipleItems(itemNode);
        }

        return true;
      },

      "Shift-Tab": ({ editor }) => {
        const { state } = editor;
        const { selection } = state;
        const { $from, from, to } = selection;

        const itemNode = $from.node($from.depth);

        if (from === to && itemNode?.attrs.nodeType === "item") {
          return editor.commands.outdentSingleItem(itemNode);
        }

        if (from !== to) {
          return editor.commands.outdentMultipleItems(itemNode);
        }

        return true;
      },

      // IDEA: I don't know...
      Space: ({ editor }) => {
        const { $from, from, to } = editor.state.selection;

        if (from === to) {
          // const blockNode = $from.node($from.depth - getDepthSubtract($from));

          // if (blockNode.type.name === "versesCollection") {
          const marks = $from.marks();
          const isSuperscript = getIsSuperscript(marks);
          const text = editor.state.schema.text(" ");

          if (isSuperscript)
            return editor
              .chain()
              .unsetSuperscript()
              .insertContentAt(from, text)
              .run();
          // }
        }

        return false;
      },

      // FIX: maybe I don't need this?
      // IDEA: because I can toggle it via []
      // IDEA: I can break off via space
      //   "Shift-^": ({ editor }) => {
      //     return editor.commands.toggleSuperscript();
      //   },
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

export default VersesCollection;
