import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

import "./BubbleMenu.css";

const createInitBubbleMenu = () => {
  const bubbleMenu = document.createElement("div");
  bubbleMenu.className = "bubbleMenu";
  bubbleMenu.style.position = "absolute";

  for (let i = 1; i <= 3; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    bubbleMenu.appendChild(button);
  }

  document.body.appendChild(bubbleMenu);

  return bubbleMenu;
};

// <----------------------------------------------------------------------------------------->

const bubbleMenuPluginKey = new PluginKey("bubbleMenuPlugin");

const debounceViewUpdate = function (view, prevState, storage) {
  const { $from } = view.state.selection;

  storage.isBubbleMenuHidden = false;
  storage.bubbleMenuDOM.style.display = "flex";

  const height = storage.bubbleMenuDOM.offsetHeight;

  // IDEA: useful
  const { top, left } = view.coordsAtPos($from.pos);

  storage.bubbleMenuDOM.style.top = `${top - height}px`;
  storage.bubbleMenuDOM.style.left = `${left}px`;
};

// <----------------------------------------------------------------------------------------->

const BubbleMenu = Extension.create({
  name: "bubbleMenu",

  addStorage() {
    return {
      isBubbleMenuHidden: true,
      bubbleMenuDOM: null,
    };
  },

  addProseMirrorPlugins() {
    const storage = this.storage;

    return [
      new Plugin({
        key: bubbleMenuPluginKey,

        state: {
          init() {
            storage.bubbleMenuDOM = createInitBubbleMenu();

            return {
              isMouseDown: false,
            };
          },

          apply(tr, value) {
            const isMouseDown = tr.getMeta("isMouseDown");

            if (isMouseDown) {
              return {
                ...value,
                isMouseDown: isMouseDown === "down" ? true : false,
              };
            }

            return value;
          },
        },

        props: {
          // IDEA: I am going to have to make this document level and not extension level
          handleDOMEvents: {
            mousedown(view) {
              const { dispatch } = view;
              const { tr } = view.state;

              tr.setMeta("isMouseDown", "down");
              dispatch(tr);
            },

            mouseup(view) {
              const { dispatch } = view;
              const { tr } = view.state;

              tr.setMeta("isMouseDown", "up");
              dispatch(tr);
            },
          },
        },

        view() {
          return {
            update(view, prevState) {
              const pluginState = bubbleMenuPluginKey.getState(view.state);
              const { from, to } = view.state.selection;

              if (
                !pluginState?.isMouseDown &&
                storage.isBubbleMenuHidden &&
                from !== to
              ) {
                console.log("SHOW");
                debounceViewUpdate(view, prevState, storage);
              } else {
                if (!storage.isBubbleMenuHidden) {
                  storage.isBubbleMenuHidden = true;
                  storage.bubbleMenuDOM.style.display = "none";
                }
              }
            },
          };
        },
      }),
    ];
  },
});

export default BubbleMenu;
