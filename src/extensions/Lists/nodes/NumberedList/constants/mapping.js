import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "numberedList",
  // IDEA: link quote color
  marks: "bold italic underline strike superscript highlight",
  group: "block list",
  content: "inline*",
  defining: true,
  options: createOptions("numberedList"),
  attributes: createAttributes("numberedList"),
};

export default mapping;
