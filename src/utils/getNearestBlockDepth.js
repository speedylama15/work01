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

export default getNearestBlockDepth;
