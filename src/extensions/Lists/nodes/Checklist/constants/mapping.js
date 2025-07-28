import { createAttributes, createOptions } from "../../../../../utils";

const additionalAttributes = {
  isChecked: {
    default: false,
    parseHTML: (element) => element.getAttribute("data-is-checked") === "true",
    renderHTML: (attributes) => ({
      "data-is-checked": attributes.isChecked,
    }),
  },
};

const mapping = {
  name: "checklist",
  // IDEA: link quote color
  marks: "bold italic underline strike superscript highlight",
  group: "block list",
  content: "inline*",
  defining: true,
  options: createOptions("checklist"),
  attributes: createAttributes("checklist", additionalAttributes),
};

export default mapping;
