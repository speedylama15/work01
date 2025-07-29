import { createAttributes, createOptions } from "../../../../../utils";

const additionalAttributes = {
  verseNumber: {
    default: null,
    parseHTML: (element) => element.getAttribute("data-verse-number"),
    renderHTML: (attributes) => ({
      "data-verse-number": attributes.verseNumber,
    }),
  },
};

const mapping = {
  name: "verse",
  // IDEA: link color
  marks: "bold italic underline strike highlight",
  group: "block verse",
  content: "inline*",
  defining: true,
  options: createOptions("verse"),
  attributes: createAttributes("verse", additionalAttributes),
};

export default mapping;
