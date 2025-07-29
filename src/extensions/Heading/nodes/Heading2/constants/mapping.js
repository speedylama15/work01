import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "heading2",
  // IDEA: color
  marks: "bold italic underline strike superscript highlight",
  group: "block heading",
  content: "inline*",
  defining: true,
  options: createOptions("heading2"),
  attributes: createAttributes("heading2"),
};

export default mapping;
