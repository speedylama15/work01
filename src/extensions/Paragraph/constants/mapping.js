import { createAttributes, createOptions } from "../../../utils";

const mapping = {
  name: "paragraph",
  // IDEA: link quote color
  marks: "bold italic underline strike superscript highlight",
  group: "block paragraph",
  content: "inline*",
  defining: true,
  options: createOptions("paragraph"),
  attributes: createAttributes("paragraph"),
};

export default mapping;
