const createOptions = (name, additionalOptions = {}) => {
  return {
    blockAttrs: { class: `block block-${name}` },
    decoratorAttrs: {
      class: `decorator decorator-${name}`,
      "data-node-type": `decorator`,
    },
    contentAttrs: {
      class: `content content-${name}`,
      "data-node-type": `content`,
    },
    ...additionalOptions,
  };
};

export default createOptions;
