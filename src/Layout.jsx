import {
  Paragraph,
  BulletList,
  Checklist,
  Heading,
  NumberedList,
  Quote,
  Verse,
} from "./playground";

import "./Layout.css";

const Layout = () => {
  return (
    <div className="layout">
      <Paragraph>Paragraph</Paragraph>
      <Paragraph indentLevel={1}>
        Before beginning my talk, a word or two on why it is important to have
        an Orthodox world-view, and why it is more difficult to build one today
        than in past centuries.
      </Paragraph>

      <BulletList>Bullet List</BulletList>
      <Paragraph indentLevel={1}>Paragraph</Paragraph>
      <BulletList indentLevel={1}>Bullet List</BulletList>
      <BulletList indentLevel={2}>Bullet List</BulletList>

      <NumberedList startNumber={1}>Numbered List</NumberedList>
      <Paragraph indentLevel={1}>Paragraph</Paragraph>
      <NumberedList startNumber={10} indentLevel={1}>
        Numbered List
      </NumberedList>
      <NumberedList startNumber={1} indentLevel={2}>
        Numbered List
      </NumberedList>

      <Checklist>Checklist</Checklist>
      <Paragraph indentLevel={1}>Paragraph</Paragraph>
      <Checklist indentLevel={1}>Checklist</Checklist>
      <Checklist indentLevel={1}>Checklist</Checklist>
    </div>
  );
};

export default Layout;
