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
  name: "verseWithCitation",
  // IDEA: link color
  marks: "bold italic underline strike highlight",
  group: "block verse",
  content: "inline*",
  defining: true,
  options: createOptions("verseWithCitation"),
  attributes: createAttributes("verseWithCitation", additionalAttributes),
};

export default mapping;
