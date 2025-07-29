const getHasSuperscript = ($from) => {
  let hasSuperscript = false;

  const marks = $from.marks();

  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i];

    if (mark.type.name === "superscript") {
      hasSuperscript = true;

      break;
    }
  }

  return hasSuperscript;
};

export default getHasSuperscript;
