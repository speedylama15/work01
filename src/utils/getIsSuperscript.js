const getIsSuperscript = (marks) => {
  return marks.some((mark) => mark.type.name === "superscript");
};

export default getIsSuperscript;
