const createAttributes = (name, additionalAttributes = {}) => {
  return {
    contentType: {
      default: name,
      parseHTML: (element) => element.getAttribute("data-content-type"),
      renderHTML: (attributes) => ({
        "data-content-type": attributes.contentType,
      }),
    },
    indentLevel: {
      default: 0,
      parseHTML: (element) => element.getAttribute("data-indent-level"),
      renderHTML: (attributes) => ({
        "data-indent-level": attributes.indentLevel,
      }),
    },
    nodeType: {
      default: "block",
      parseHTML: (element) => element.getAttribute("data-node-type"),
      renderHTML: (attributes) => ({
        "data-node-type": attributes.nodeType,
      }),
    },
    ...additionalAttributes,
  };
};

export default createAttributes;
