import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "heading1",
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight quote",
  group: "block heading",
  content: "inline*",
  defining: true,
  options: createOptions("heading1"),
  attributes: createAttributes("heading1"),
};

export default mapping;
