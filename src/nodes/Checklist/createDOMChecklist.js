const createDOMChecklist = (HTMLAttributes, editor, view, node, getPos) => {
  const { dispatch } = view;

  const svgNS = "http://www.w3.org/2000/svg";
  const block = document.createElement("div");
  const decorator = document.createElement("div");
  const content = document.createElement("div");
  const button = document.createElement("button");
  const svg = document.createElementNS(svgNS, "svg");
  const path = document.createElementNS(svgNS, "path");
  const listItem = document.createElement("list-item");

  block.className = "block block-checklist";
  block.setAttribute("data-node-type", HTMLAttributes["data-node-type"]);
  block.setAttribute("data-is-checked", HTMLAttributes["data-is-checked"]);
  block.setAttribute("data-content-type", HTMLAttributes["data-content-type"]);
  block.setAttribute("data-indent-level", HTMLAttributes["data-indent-level"]);

  decorator.className = "decorator decorator-checklist";
  decorator.setAttribute("data-node-type", "decorator");

  content.className = "content content-checklist";
  content.setAttribute("data-node-type", "content");

  button.className = "checkbox";

  svg.classList.add("checkmark");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", "24");
  svg.setAttribute("height", "24");
  svg.setAttribute("viewBox", "0 0 24 24");

  path.setAttribute("d", "M20 6 9 17l-5-5");

  block.appendChild(decorator);
  decorator.appendChild(content);
  content.appendChild(button);
  content.appendChild(listItem);
  button.appendChild(svg);
  svg.appendChild(path);

  // FIX: remove event listener
  button.addEventListener("mousedown", () => {
    const { state } = editor;
    const { tr } = state;

    const value = JSON.parse(node.attrs?.isChecked);
    const newValue = !value;

    tr.setNodeAttribute(getPos(), "isChecked", newValue);

    dispatch(tr);
  });

  return { block, button, listItem };
};

export default createDOMChecklist;
