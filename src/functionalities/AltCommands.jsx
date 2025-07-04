import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { v4 as uuidv4 } from "uuid";

const AltCommands = Extension.create({
  name: "myCommands",

  addCommands() {
    return {};
  },
});

export default AltCommands;
