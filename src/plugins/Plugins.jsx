import { Node } from "@tiptap/core";

import constructHierarchy from "./constructHierarchy";

const Plugins = Node.create({
  name: "plugins",

  addProseMirrorPlugins() {
    return [constructHierarchy];
  },
});

export default Plugins;
