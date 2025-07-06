import { Node } from "@tiptap/core";
import maps from "../class/maps";

const MyPlugins = Node.create({
  name: "myPlugins",

  addProseMirrorPlugins() {
    return [maps];
  },
});

export default MyPlugins;
