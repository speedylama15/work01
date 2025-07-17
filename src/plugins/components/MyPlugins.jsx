import { Extension } from "@tiptap/core";

const MyPlugins = Extension.create({
  name: "myPlugins",

  addProseMirrorPlugins() {
    return [];
  },
});

export default MyPlugins;
