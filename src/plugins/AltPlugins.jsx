import { Node } from "@tiptap/core";

import flattenedEditor from "./flattenedEditor";

const Plugins = Node.create({
  name: "plugins",

  addProseMirrorPlugins() {
    return [flattenedEditor];
  },
});

export default Plugins;
