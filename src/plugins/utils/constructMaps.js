function constructMaps(doc) {
  const levelMap = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] };
  const flatMap = [];

  // REVIEW: this index is very different
  doc.descendants((node, pos, parent, index) => {
    if (node.type.name === "block") {
      const indentLevel = parseInt(node?.attrs?.indentLevel);
      const levelArray = levelMap[indentLevel];

      // FIX: textContent
      const levelMapElement = {
        id: node?.attrs?.id,
        node,
        textContent: node?.textContent,
        pos,
        index,
        indentLevel,
      };

      const flatMapElement = {
        id: node?.attrs?.id,
        node,
        textContent: node?.textContent,
        pos,
        index,
        indentLevel,
      };

      levelArray.push(levelMapElement);
      flatMap.push(flatMapElement);
    }

    if (node?.attrs?.nodeType === "content") return false;
    if (node?.type.name === "text") return false;
  });

  return { flatMap, levelMap };
}

export default constructMaps;
