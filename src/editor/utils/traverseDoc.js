const isBlockSelected = (pos, node, from, to) => {
  const s = pos + 1;
  const e = pos + node.nodeSize - 1;

  let isSelected = false;

  if (s < from && from < e) isSelected = true;
  if (from <= s && e <= to) isSelected = true;
  if (s < to && to < e) isSelected = true;

  return isSelected;
};

const traverseDoc = (editor, callback) => {
  const { state } = editor;
  const { selection, tr } = state;
  const { $from, from, to } = selection;

  let pos = $from.before($from.depth);
  const resolvedPos = tr.doc.resolve(pos);
  const startIndex = resolvedPos.index();
  const nodeBefore = resolvedPos?.nodeBefore;
  let pNode = {
    node: nodeBefore,
    isSelected: nodeBefore
      ? isBlockSelected(pos - nodeBefore.nodeSize, nodeBefore, from, to)
      : false,
  };

  for (let i = startIndex; i < tr.doc.children.length; i++) {
    const node = tr.doc.children[i];
    const nextPos = pos + node.nodeSize;
    const isSelected = isBlockSelected(pos, node, from, to);

    if (callback({ node, isSelected }, pos, nextPos, pNode, i)) {
      break;
    }

    pNode = { node, isSelected };
    pos = pos + node.nodeSize;
  }
};

export default traverseDoc;
