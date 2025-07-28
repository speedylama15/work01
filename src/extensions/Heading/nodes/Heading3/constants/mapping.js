import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "heading3",
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight quote",
  group: "block heading",
  content: "inline*",
  defining: true,
  options: createOptions("heading3"),
  attributes: createAttributes("heading3"),
};

export default mapping;
