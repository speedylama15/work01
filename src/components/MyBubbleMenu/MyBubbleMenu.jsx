import { BubbleMenu } from "@tiptap/react/menus";
import TextIcon from "./icons/text.svg?react";
import BoldIcon from "./icons/bold.svg?react";

import "./MyBubbleMenu.css";

const MyBubbleMenu = ({ editor }) => {
  // REVIEW: this only triggers when from and to differ
  // IDEA: I need to retrieve the selection
  // IDEA: need to get its node type
  // IDEA: need to obtain its mark/s
  // IDEA: need commands of set, unset, and toggle

  return (
    <BubbleMenu
      editor={editor}
      // FIX
      shouldShow={({ from, to }) => from !== to}
      options={{ strategy: "absolute", placement: "top" }}
      updateDelay={250}
      resizeDelay={250}
      className="my-bubble-menu"
    >
      <section className="my-bubble-menu__first-section">
        <button className="my-bubble-menu__nodes-dropdown-button">
          <TextIcon />

          <p>Paragraph</p>
        </button>
      </section>

      <section className="my-bubble-menu__second-section">
        <button className="my-bubble-menu__mark-button">
          <BoldIcon />
        </button>

        <button className="my-bubble-menu__mark-button">
          {/* Italic */}
          <BoldIcon />
        </button>

        <button className="my-bubble-menu__mark-button">
          {/* Underline */}
          <BoldIcon />
        </button>

        <button className="my-bubble-menu__mark-button">
          {/* Strike */}
          <BoldIcon />
        </button>

        <button className="my-bubble-menu__mark-button">
          {/* Superscript if allowed */}
          <BoldIcon />
        </button>
      </section>

      <section className="my-bubble-menu__third-section">
        <button className="my-bubble-menu__decoration-dropdown-button">
          <TextIcon />

          <p>Color</p>
        </button>
      </section>
    </BubbleMenu>
  );
};

export default MyBubbleMenu;
