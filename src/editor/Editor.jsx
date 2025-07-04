import { useEditor, EditorContent } from "@tiptap/react";
// import { Doc, Paragraph, BulletList, NumberedList } from "../nodes";
// import { MyCommands, MyShortcuts } from "../functionalities";
// import { Plugins } from "../plugins";

import { Doc, Block, BlockContent, Group } from "../nodes";
import { AltCommands, AltShortcuts } from "../functionalities";
import { AltPlugins } from "../plugins";

import { UndoRedo } from "@tiptap/extensions";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Superscript from "@tiptap/extension-superscript";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import UniqueID from "@tiptap/extension-unique-id";

import "./Editor.css";

const content = `
<div
  data-id="f24df2c2-0fbe-4f78-8c3d-43ae432e4bf1"
  data-indent-level="0"
  data-content-type="paragraph"
  data-node-type="block"
  class="block"
>
  <div class="content" data-node-type="content">
    <p>a</p>
  </div>
  <div class="group" data-node-type="group">
    <div
      data-id="a91b6bb5-7d34-4e71-a049-ca5198d89dde"
      data-indent-level="0"
      data-content-type="paragraph"
      data-node-type="block"
      class="block"
    >
      <div class="content" data-node-type="content">
        <p>b</p>
      </div>
      <div class="group" data-node-type="group">
        <div
          data-id="1a3b92df-1138-43db-9278-c2301a4e137b"
          data-indent-level="0"
          data-content-type="paragraph"
          data-node-type="block"
          class="block"
        >
          <div class="content" data-node-type="content">
            <p>c</p>
          </div>
        </div>
      </div>
    </div>
    <div
      data-id="1b099f71-8c69-4b81-8b2f-640c25265bdb"
      data-indent-level="0"
      data-content-type="paragraph"
      data-node-type="block"
      class="block"
    >
      <div class="content" data-node-type="content">
        <p>d</p>
      </div>
      <div class="group" data-node-type="group">
        <div
          data-id="5a257c0b-6e53-45b3-b6b9-3194d4d1cd4e"
          data-indent-level="0"
          data-content-type="paragraph"
          data-node-type="block"
          class="block"
        >
          <div class="content" data-node-type="content">
            <p>e</p>
          </div>
        </div>
        <div
          data-id="94559cd2-2a98-4631-8b37-95b1ae6d8ef6"
          data-indent-level="0"
          data-content-type="paragraph"
          data-node-type="block"
          class="block"
        >
          <div class="content" data-node-type="content">
            <p>f</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div
  data-id="b9e09e59-f779-4efa-90c5-1294b04c48ce"
  data-indent-level="0"
  data-content-type="paragraph"
  data-node-type="block"
  class="block"
>
  <div class="content" data-node-type="content">
    <p>g</p>
  </div>
</div>
`;

const editorProps = {
  attributes: {
    class: "editor",
  },
};

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
    types: ["block"],
  }),
  Doc,
  Block,
  BlockContent,
  Group,
  AltPlugins,
  AltCommands,
  AltShortcuts,
];

const Editor = () => {
  const editor = useEditor({
    content,
    editorProps,
    extensions,
  });

  return (
    <>
      <EditorContent editor={editor} className="editor-container" />
    </>
  );
};

export default Editor;
