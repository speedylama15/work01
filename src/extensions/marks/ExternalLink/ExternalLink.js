import Link from "@tiptap/extension-link";
import { Plugin, PluginKey } from "@tiptap/pm/state";

const name = "externalLink";

const ExternalLinkPluginKey = new PluginKey("externalLinkPluginKey");

const ExternalLink = Link.extend({
  name,

  addStorage() {
    return { toShow: false, pos: null };
  },

  onCreate() {
    const app = document.querySelector(".app");
    const portal = document.createElement("div");
    portal.className = "portal";
    app.appendChild(portal);

    const dropdownExternalLink = document.createElement("div");
    dropdownExternalLink.className = "dropdown_external-link";
    dropdownExternalLink.innerHTML = `
      <div data-action="edit">Edit Link</div>
      <div data-action="remove">Remove Link</div>
      <div data-action="copy">Copy URL</div>
      <input />
    `;

    dropdownExternalLink.style.cssText += `
      display: none;
    `;

    // FIX: maybe put this at a separate file?
    // FIX: also need to destroy this
    document.addEventListener("click", (e) => {
      if (!dropdownExternalLink.contains(e.target)) {
        dropdownExternalLink.style.display = "none";
        this.storage.toShow = false;
        this.storage.pos = null;
      }
    });

    portal.appendChild(dropdownExternalLink);
  },

  addProseMirrorPlugins() {
    const storage = this.storage;

    return [
      new Plugin({
        key: ExternalLinkPluginKey,

        appendTransaction(transactions, oldState, newState) {
          const { $from } = newState.selection;
          const marks = $from.marks();
          const isLink = marks.some(
            (mark) => mark.type.name === "externalLink"
          );
          const isPaste = transactions.some(
            (transaction) =>
              transaction.getMeta("paste") ||
              transaction.getMeta("uiEvent") === "paste"
          );

          if (isLink && isPaste) {
            storage.toShow = true;
            storage.pos = $from.pos;
          }

          return null;
        },

        props: {
          handleKeyDown() {
            storage.toShow = false;
            storage.pos = null;
          },
        },

        view() {
          return {
            update(view) {
              if (storage.toShow) {
                const { top, left } = view.coordsAtPos(storage.pos);
                const d = document.querySelector(".dropdown_external-link");
                d.style.cssText += `
                  display: flex;
                  top: ${top}px;
                  left: ${left}px;
                `;
              } else {
                const d = document.querySelector(".dropdown_external-link");
                if (d) d.style.display = "none";
                storage.toShow = false;
                storage.pos = null;
              }
            },

            destroy() {},
          };
        },
      }),
    ];
  },
});

export default ExternalLink;
