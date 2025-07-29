import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "heading3",
  // IDEA: color
  marks: "bold italic underline strike superscript highlight",
  group: "block heading",
  content: "inline*",
  defining: true,
  options: createOptions("heading3"),
  attributes: createAttributes("heading3"),
};

export default mapping;
