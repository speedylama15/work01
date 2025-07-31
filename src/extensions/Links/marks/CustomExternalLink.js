import Link from "@tiptap/extension-link";

import "./menu.css";

const name = "customExternalLink";

const getHasPastedLink = (marks) => {
  let hasPastedLink = false;

  for (let i = 0; i < marks.length; i++) {
    const mark = marks[i];

    if (mark.type.name === name) {
      hasPastedLink = true;

      break;
    }
  }

  return hasPastedLink;
};

const createMenu = (node, rect) => {
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.style.position = "absolute";

  const span = document.createElement("span");
  span.textContent = "Convert to";
  menu.appendChild(span);

  const buttonContainer = document.createElement("div");
  menu.appendChild(buttonContainer);

  const buttons = ["URL", "Bookmark", "Mention", "Embed"];
  buttons.forEach((text) => {
    const button = document.createElement("button");
    button.textContent = text;
    buttonContainer.appendChild(button);
  });

  menu.style.left = `${(rect.right - rect.left) / 2}px`;
  menu.style.top = `${rect.bottom + 10}px`;

  document.body.appendChild(menu);

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target)) {
      // IDEA: these 2 need to be packaged together
      menu.remove();
      node.storage.menuDOM = null;
      // IDEA: these 2 need to be packaged together
    }
  });

  return menu;
};

const destroyMenu = (menu) => {
  menu.remove();
};

const CustomExternalLink = Link.extend({
  name,

  addStorage() {
    return { menuDOM: null };
  },

  // IDEA: use this for edit
  onSelectionUpdate() {
    // console.log("CUSTOM LINK ON SELECTION UPDATE");

    return true;
  },

  onUpdate(params) {
    const { editor, appendedTransactions } = params;

    const isPaste = appendedTransactions.some((tr) => {
      return tr.meta.appendedTransaction.getMeta("paste");
    });

    if (this && this.storage.menuDOM) {
      destroyMenu(this.storage.menuDOM);

      this.storage.menuDOM = null;
    }

    if (isPaste) {
      const { $from } = editor.state.selection;

      const marks = $from.marks();

      const hasPastedLink = getHasPastedLink(marks);

      if (hasPastedLink) {
        // const dom = editor.view.domAtPos($from.pos)?.node.parentElement;
        // const blockDom = dom.closest('[data-node-type="block"]');

        const dom = editor.view.domAtPos($from.pos)?.node.parentElement;
        const blockDom = dom.closest('[data-node-type="block"]');
        const rect = blockDom.getBoundingClientRect();

        this.storage.menuDOM = createMenu(this, rect);
      }
    }
  },

  // IDEA: if multple separate links are pasted just convert them to url
});

export default CustomExternalLink;
