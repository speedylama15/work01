import { Plugin, PluginKey } from "@tiptap/pm/state";
import constructMaps from "../utils/constructMaps";

export const mapsKey = new PluginKey("maps");

const maps = new Plugin({
  key: mapsKey,

  state: {
    init(config, state) {
      // FIX
      console.log("maps plugin", constructMaps(state.doc));

      // FIX
      return constructMaps(state.doc);
    },

    apply(tr, value, oldState, newState) {
      // FIX
      return constructMaps(newState.doc);
    },
  },
});

export default maps;
