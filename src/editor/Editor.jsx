import { useEditor, EditorContent } from "@tiptap/react";

import { UndoRedo } from "@tiptap/extensions";
import UniqueID from "@tiptap/extension-unique-id";

// import Image from "../../extensions/nodes/Image";
// import Audio from "../../extensions/nodes/Audio";
// import Video from "../../extensions/nodes/Video";

// FIX
import MyBubbleMenu from "../components/MyBubbleMenu/MyBubbleMenu";
import Placeholder from "../plugins/Placeholder/Placeholder";
import DragAndDropNode from "../plugins/DragAndDropNode/DragAndDropNode";
import MyCommands from "../commands/MyCommands";
import MyShortcuts from "../shortcuts/MyShortcuts";
import { DragHandle } from "../plugins";

import Text from "@tiptap/extension-text";
import {
  BulletList,
  Checklist,
  Document,
  NumberedList,
  Paragraph,
  Heading1,
  Heading2,
  Heading3,
  Blockquote,
  Verse,
  Verses,
  VerseWithCitation,
  CustomExternalLink,
} from "../extensions";

import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Highlight from "@tiptap/extension-highlight";
import Strike from "@tiptap/extension-strike";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";

import "./Editor.css";

const ID = UniqueID.configure({
  types: [
    Paragraph.name,
    BulletList.name,
    Checklist.name,
    NumberedList.name,
    Heading1.name,
    Heading2.name,
    Heading3.name,
    Blockquote.name,
    Verse.name,
    Verses.name,
    VerseWithCitation.name,
    // IDEA: may have to make changes to this
    CustomExternalLink.name,
  ],
});

const functionalities = [
  UndoRedo,
  ID,
  Placeholder,
  DragAndDropNode,
  MyCommands,
  MyShortcuts,
  DragHandle,
];
const nodes = [
  Document,
  Paragraph,
  Text,
  BulletList,
  Checklist,
  NumberedList,
  Heading1,
  Heading2,
  Heading3,
  Blockquote,
  Verse,
  Verses,
  VerseWithCitation,
  CustomExternalLink.configure({ autolink: true, linkOnPaste: true }),
];
const marks = [Bold, Italic, Highlight, Strike, Superscript, Underline];

const content = ``;

const extensions = [
  ...functionalities,
  ...nodes,
  ...marks,

  // Image,
  // Video,
  // Audio,
  // Divider,
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
      <MyBubbleMenu editor={editor} />
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
