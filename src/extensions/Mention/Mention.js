import { Node } from "@tiptap/core";
import { createAttributes, createOptions } from "../../utils";

const name = "mention";
const group = "inline mention";
const marks = "bold italic underline strike superscript highlight";
const defining = true;
const options = createOptions(name);
const attributes = createAttributes(name);

const Mention = Node.create({
  name,
  group,
  marks,
  defining,
  inline: true,
  selectable: false,
  atom: true,

  addOptions() {
    return options;
  },

  addAttributes() {
    return attributes;
  },

  parseHTML() {
    return [{ tag: `div[data-content-type="${name}"]` }, { tag: "a" }];
  },

  renderHTML() {
    return [
      "div",
      { class: "mention" },
      [
        "img",
        {
          src: "https://i.etsystatic.com/25248572/r/il/668dc1/4691862236/il_fullxfull.4691862236_dghj.jpg",
        },
      ],
      ["a", { href: "somewhere" }, "Orthodox Christianity"],
    ];
  },
});

export default Mention;
