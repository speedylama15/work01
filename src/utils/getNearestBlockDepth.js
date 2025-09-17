const getNearestBlockDepth = ($from) => {
  let subtract = 0;

  for (let i = 0; i < 10; i++) {
    const node = $from.node($from.depth - i);

    if (node?.attrs?.nodeType === "block") {
      subtract = i;
      break;
    }
  }

  return $from.depth - subtract;
};

export default getNearestBlockDepth;
