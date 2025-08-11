import { createAttributes, createOptions } from "../../../utils";

const mapping = {
  name: "blockquote",
  // IDEA: link quote color
  marks: "bold italic underline strike superscript highlight",
  group: "block quote",
  content: "inline*",
  defining: true,
  options: createOptions("blockquote"),
  attributes: createAttributes("blockquote"),
};

export default mapping;
