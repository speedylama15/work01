import { createAttributes, createOptions } from "../../../../../utils";

const mapping = {
  name: "verses",
  // IDEA: link color
  marks: "bold italic underline strike highlight superscript",
  group: "block verse",
  content: "inline*",
  whitespace: "pre",
  defining: true,
  priority: 150,
  options: createOptions("verses"),
  attributes: createAttributes("verses"),
};

export default mapping;
