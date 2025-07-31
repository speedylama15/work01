import { BubbleMenu } from "@tiptap/react/menus";

import "./MyBubbleMenu.css";

const MyBubbleMenu = ({ editor }) => {
  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ from, to }) => from !== to}
      options={{ strategy: "absolute", placement: "top" }}
      updateDelay={250}
      resizeDelay={250}
      className="my-bubble-menu"
    >
      <h1>BUBBLE</h1>
    </BubbleMenu>
  );
};

export default MyBubbleMenu;
