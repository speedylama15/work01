import { createAttributes, createOptions } from "../../../utils";

const mapping = {
  name: "paragraph",
  // IDEA: link color
  marks: "bold italic underline strike superscript highlight",
  group: "block paragraph",
  content: "inline*",
  defining: true,
  priority: 200,
  options: createOptions("paragraph"),
  attributes: createAttributes("paragraph"),
};

export default mapping;
