export const isNodeSelected = (pos, node, from, to) => {
  const s = pos + 1;
  const e = pos + node.nodeSize - 1;

  let isSelected = false;

  if (from === to) {
    if (s <= from && e >= from) isSelected = true;

    return isSelected;
  }

  if (from !== to) {
    if (s < from && from < e) isSelected = true;
    if (from <= s && e <= to) isSelected = true;
    if (s < to && to < e) isSelected = true;

    return isSelected;
  }
};
