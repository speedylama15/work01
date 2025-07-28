import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "heading2",
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight quote",
  group: "block heading",
  content: "inline*",
  defining: true,
  options: createOptions("heading2"),
  attributes: createAttributes("heading2"),
};

export default mapping;
