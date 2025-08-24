import Document from "../extensions/nodes/Document/Document";
import Text from "@tiptap/extension-text";
import Paragraph from "../extensions/nodes/Paragraph/Paragraph";
import Heading1 from "../extensions/nodes/Heading1/Heading1";
import Heading2 from "../extensions/nodes/Heading2/Heading2";
import Heading3 from "../extensions/nodes/Heading3/Heading3";
import BulletList from "../extensions/nodes/BulletList/BulletList";
import NumberedList from "../extensions/nodes/NumberedList/NumberedList";
import Checklist from "../extensions/nodes/Checklist/Checklist";
import Blockquote from "../extensions/nodes/Blockquote/Blockquote";
import Verse from "../extensions/nodes/Verse/Verse";
import VersesCollection from "../extensions/nodes/VersesCollection/VersesCollection";
import VersesItem from "../extensions/nodes/VersesCollection/VersesItem";
import VerseWithCitation from "../extensions/nodes/VerseWithCitation/VerseWithCitation";
import Audio from "../extensions/nodes/Audio/Audio";
import Image from "../extensions/nodes/Image/Image";
import Video from "../extensions/nodes/Video/Video";
import Divider from "../extensions/nodes/Divider/Divider";
import MyTable from "../extensions/nodes/Table/MyTable";
import MyTableHeader from "../extensions/nodes/Table/MyTableHeader";
import MyTableRow from "../extensions/nodes/Table/MyTableRow";
import MyTableCell from "../extensions/nodes/Table/MyTableCell";
import MyTableParagraph from "../extensions/nodes/Table/MyTableParagraph";

import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Highlight from "@tiptap/extension-highlight";
import Strike from "@tiptap/extension-strike";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import HardBreak from "@tiptap/extension-hard-break";
import ExternalLink from "../extensions/marks/ExternalLink/ExternalLink";

import { UndoRedo } from "@tiptap/extensions";
import UniqueID from "@tiptap/extension-unique-id";
import Placeholder from "../extensions/functionalities/Placeholder/Placeholder";
import Brackets from "../extensions/functionalities/Brackets/Brackets";

const nodes = [
  Document,
  Paragraph,
  Text,
  Heading1,
  Heading2,
  Heading3,
  BulletList,
  NumberedList,
  Checklist,
  Blockquote,
  Verse,
  VersesCollection,
  VersesItem,
  VerseWithCitation,
  Audio,
  Image,
  Video,
  Divider,
  MyTable.configure({
    resizable: true,
    handleWidth: 5,
    cellMinWidth: 150,
    lastColumnResizable: true,
    allowTableNodeSelection: true,
  }),
  MyTableHeader,
  MyTableRow,
  MyTableCell,
  MyTableParagraph,
];

const marks = [
  Bold,
  Italic,
  Highlight,
  Strike,
  Superscript,
  Underline,
  ExternalLink,
];

const IDs = UniqueID.configure({
  types: [
    Paragraph.name,
    Heading1.name,
    Heading2.name,
    Heading3.name,
    BulletList.name,
    NumberedList.name,
    Checklist.name,
    Blockquote.name,
    Verse.name,
    VersesCollection.name,
    VersesItem.name,
    VerseWithCitation.name,
    Audio.name,
    Image.name,
    Video.name,
    Divider.name,
    MyTable.name,
  ],
});

const functionalities = [UndoRedo, IDs, Placeholder, HardBreak, Brackets];

export default { nodes, marks, functionalities };
