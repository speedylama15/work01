import { Node } from "@tiptap/core";

const MyPlugins = Node.create({
  name: "myPlugins",

  addProseMirrorPlugins() {
    return [];
  },
});

export default MyPlugins;
