import { useEditor, EditorContent } from "@tiptap/react";

import Text from "@tiptap/extension-text";
import { TextStyle, Color } from "@tiptap/extension-text-style";

// node
import Document from "./nodes/Document/Document";
import Paragraph from "./nodes/Paragraph/Paragraph";
import "./nodes/Paragraph/Paragraph.css";
import Heading1 from "./nodes/Heading1/Heading1";
import "./nodes/Heading1/Heading1.css";
import Heading2 from "./nodes/Heading2/Heading2";
import "./nodes/Heading2/Heading2.css";
import Heading3 from "./nodes/Heading3/Heading3";
import "./nodes/Heading3/Heading3.css";
import BulletList from "./nodes/BulletList/BulletList";
import "./nodes/BulletList/BulletList.css";
import NumberedList from "./nodes/NumberedList/NumberedList";
import "./nodes/NumberedList/NumberedList.css";
import Divider from "./nodes/Divider/Divider";
import "./nodes/Divider/Divider.css";
import Checklist from "./nodes/Checklist/Checklist";
import "./nodes/Checklist/Checklist.css";
import Blockquote from "./nodes/Blockquote/Blockquote";
import "./nodes/Blockquote/Blockquote.css";
import MyTable from "./nodes/Table/MyTable";
import MyTableCell from "./nodes/Table/MyTableCell";
import MyTableRow from "./nodes/Table/MyTableRow";
import MyTableHeader from "./nodes/Table/MyTableHeader";
import MyTableParagraph from "./nodes/Table/content/MyTableParagraph";
import "./nodes/Table/Table.css";
// node

// mark
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Highlight from "@tiptap/extension-highlight";
import Strike from "@tiptap/extension-strike";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
// mark

// functionality
import { UndoRedo } from "@tiptap/extensions";
import UniqueID from "@tiptap/extension-unique-id";
import HardBreak from "@tiptap/extension-hard-break";
// functionality

// component
import MyBubbleMenu from "./components/MyBubbleMenu/MyBubbleMenu";
import Utilbar from "./components/Utilbar/Utilbar";
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
// component

// style
import "./App.css";
import "./nodes/Block.css";
import "./nodes/List.css";
import "./nodes/Verse.css";
// style

const App = () => {
  const editor = useEditor({
    content: "",
    extensions: [
      // REVIEW: node
      Document,
      Paragraph,
      Text,
      Heading1,
      Heading2,
      Heading3,
      BulletList,
      NumberedList,
      Checklist,
      Divider,
      Blockquote,
      MyTable.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 150,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
      }),
      MyTableCell,
      MyTableRow,
      MyTableHeader,
      MyTableParagraph,
      // REVIEW: mark
      TextStyle,
      Color,
      Highlight,
      Bold,
      Italic,
      Strike,
      Superscript,
      Underline,
      // REVIEW: functionality
      HardBreak,
      UndoRedo,
      UniqueID.configure({
        types: [
          Paragraph.name,
          Heading1.name,
          Heading2.name,
          Heading3.name,
          BulletList.name,
          NumberedList.name,
          Checklist.name,
          Divider.name,
          Blockquote.name,
          MyTable.name,
        ],
      }),
    ],

    onCreate() {
      document
        .getElementsByClassName("ProseMirror")[0]
        .classList.remove("tiptap");
    },
  });

  return (
    <div className="page">
      <Sidebar />

      <div className="content-body">
        <Header />

        <div className="content-area">
          <div className="editor-main">
            <EditorContent editor={editor} className="editor-container" />

            <MyBubbleMenu editor={editor} />
          </div>

          <Utilbar />
        </div>
      </div>
    </div>
  );
};

export default App;
