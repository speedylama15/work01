import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export const testKey = new PluginKey("test");

const MyPlugins = Extension.create({
  name: "myPlugins",

  addProseMirrorPlugins() {
    const editor = this.editor;

    const test = new Plugin({
      key: testKey,

      view(editorView) {
        return {
          update(view, prevState) {},
        };
      },

      state: {
        init(config, state) {},

        apply(tr, value, oldState, newState) {},
      },
    });

    return [test];
  },
});

export default MyPlugins;
