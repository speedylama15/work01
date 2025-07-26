import { useEditor, EditorContent } from "@tiptap/react";

import Text from "@tiptap/extension-text";
import { UndoRedo } from "@tiptap/extensions";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Highlight from "@tiptap/extension-highlight";
import Strike from "@tiptap/extension-strike";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import UniqueID from "@tiptap/extension-unique-id";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";

import Blockquote from "../../extensions/nodes/Blockquote";
import BulletList from "../../extensions/nodes/BulletList";
import Checklist from "../../extensions/nodes/Checklist";
import Document from "../../extensions/nodes/Document";
import Heading1 from "../../extensions/nodes/Heading1";
import Heading2 from "../../extensions/nodes/Heading2";
import Heading3 from "../../extensions/nodes/Heading3";
import Image from "../../extensions/nodes/Image";
import NumberedList from "../../extensions/nodes/NumberedList";
import Paragraph from "../../extensions/nodes/Paragraph";
import VerseSimple from "../../extensions/nodes/VerseSimple";
import VersesFormatted from "../../extensions/nodes/VersesFormatted";
import VerseWithChapter from "../../extensions/nodes/VerseWithChapter";
import Audio from "../../extensions/nodes/Audio";
import Video from "../../extensions/nodes/Video";
import Quote from "../../extensions/marks/Quote";
import Divider from "../../extensions/nodes/Divider";

import MyCommands from "../../extensions/commands/MyCommands";
import MyShortcuts from "../../extensions/shortcuts/MyShortcuts";
import DragAndDropNode from "../../extensions/plugins/DragAndDropNode/DragAndDropNode";
import Placeholder from "../../extensions/plugins/Placeholder/Placeholder";

import "./Editor.css";

const content = ``;

const extensions = [
  UndoRedo,
  Text,
  Bold,
  Italic,
  Superscript,
  Strike,
  Underline,
  Highlight,
  Quote,
  UniqueID.configure({
    // FIX: add more
    types: ["paragraph", "bulletList", "numberedList", "checklist"],
  }),
  Paragraph,
  Checklist,
  Document,
  Heading1,
  Heading2,
  Heading3,
  NumberedList,
  BulletList,
  Blockquote,
  VerseWithChapter,
  VerseSimple,
  VersesFormatted,
  Image,
  Video,
  Audio,
  Divider,
  Link,
  Color,
  TextStyle,
  MyCommands,
  MyShortcuts,
  DragAndDropNode,
  Placeholder,
];

const Editor = () => {
  const editor = useEditor({
    content,
    extensions,

    parseOptions: {
      preserveWhitespace: "full",
    },

    onCreate() {
      const doc = document.getElementsByClassName("ProseMirror")[0];
      doc.classList.remove("tiptap");
    },

    editorProps: {
      attributes: {
        class: "editor",
      },

      handleDrop: async (view, e) => {
        e.preventDefault();

        const tr = view.state.tr;
        const dispatch = view.dispatch;

        const files = e.dataTransfer?.files;

        const promises = Array.from(files).map((file) => {
          return new Promise((resolve) => {
            const url = URL.createObjectURL(file);
            const reader = new FileReader();

            reader.onload = (e) => {
              resolve({ file, url, result: e.target.result });
            };

            reader.readAsArrayBuffer(file);
          });
        });

        const data = await Promise.all(promises);

        data.forEach(({ file, url }) => {
          console.log(file);

          const videoNode = view.state.schema.nodes.video.create({
            videoSrc: url,
          });

          tr.insert(0, videoNode);
        });

        dispatch(tr);
      },
    },
  });

  return (
    <div className="editor-main">
      <EditorContent editor={editor} className="editor-container" />
    </div>
  );
};

export default Editor;

// if (file.type === "audio/mpeg") {
//   const audioNode = view.state.schema.nodes.audio.create({
//     audioSrc: url,
//   });

//   tr.insert(0, audioNode);
// }

// const imageNode = view.state.schema.nodes.image.create({
//   imgSrc: url,
// });

// tr.insert(0, imageNode);
