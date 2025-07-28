import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "bulletList",
  // IDEA: link quote color
  marks: "bold italic underline strike superscript highlight",
  group: "block list",
  content: "inline*",
  defining: true,
  options: createOptions("bulletList"),
  attributes: createAttributes("bulletList"),
};

export default mapping;

// IDEA: defining
// IDEA: Target with defining: true → wraps pasted content
// IDEA: Target with defining: false → gets completely replaced
// IDEA: The target node (where you're pasting) takes precedence
// REVIEW: blockquote, code, list, headings
