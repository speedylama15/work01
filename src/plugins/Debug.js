import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

// Create a plugin key for this plugin
const debugKey = new PluginKey("debugKey");

const Debug = Extension.create({
  name: "debug",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: debugKey,

        state: {
          init() {},

          apply() {},
        },

        props: {
          handleClick(view, pos, e) {
            const { from, to } = view.state.selection;
            console.log("Clicked", { from, to, pos });
          },

          handleKeyDown() {},

          handleDOMEvents: {
            click(view, e) {
              const { from, to } = view.state.selection;
              console.log("DOM", { from, to });
            },
          },
        },

        view() {
          return {
            update() {},
            destroy() {},
          };
        },
      }),
    ];
  },
});

export default Debug;
