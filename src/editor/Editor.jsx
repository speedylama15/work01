import { useEditor, EditorContent } from "@tiptap/react";

import { UndoRedo, Placeholder } from "@tiptap/extensions";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Superscript from "@tiptap/extension-superscript";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import UniqueID from "@tiptap/extension-unique-id";
import HardBreak from "@tiptap/extension-hard-break";

import {
  Doc,
  Paragraph,
  NumberedList,
  BulletList,
  Checklist,
  Blockquote,
  Heading,
  Divider,
} from "../nodes";
import { MyCommands, MyShortcuts } from "../functionalities";
import { MyPlugins } from "../plugins";

import "./Editor.css";

const content = `
  <div
    data-indent-level="0"
    data-content-type="paragraph"
    data-node-type="block"
    class="block block-paragraph is-empty is-editor-empty"
    data-placeholder="a"
  >
    <div class="decorator decorator-paragraph" data-node-type="content">
      <div class="content content-paragraph" data-node-type="content">
        <p>
        </p>
      </div>
    </div>
  </div>
`;

const extensions = [
  UndoRedo,
  Text,
  Bold,
  Italic,
  Superscript,
  Strike,
  Underline,
  Highlight,
  UniqueID.configure({
    types: ["paragraph", "bulletList", "numberedList"],
  }),
  HardBreak,
  Heading,
  Divider,
  Doc,
  Paragraph,
  NumberedList,
  BulletList,
  Checklist,
  Blockquote,
  MyCommands,
  MyShortcuts,
  MyPlugins,
  Placeholder.configure({
    // FIX
    showOnlyCurrent: true,
    placeholder: "a",
  }),
];

const Editor = () => {
  const editor = useEditor({
    content,
    extensions,

    editorProps: {
      attributes: {
        class: "editor",
      },

      // handleClick(view, pos, event) {},
      // handleDrop(view, e, slice, moved) {},
      // handleClickOn(view, pos, node, nodePos, e) {},

      // handleDOMEvents: {
      //   mouseover(view, e) {},
      //   dragstart(view, e) {},
      // },
    },

    // onDrop(e, slice, moved) {},
    // onPaste(e, slice) {},
  });

  return (
    <>
      <EditorContent editor={editor} className="editor-container" />
    </>
  );
};

export default Editor;
