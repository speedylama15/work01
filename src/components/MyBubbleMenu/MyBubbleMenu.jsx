import { useState } from "react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  useFloating,
  autoUpdate,
  useClick,
  useDismiss,
  useInteractions,
} from "@floating-ui/react";

import BubbleMenuOption from "./BubbleMenuOption";

import "./MyBubbleMenu.css";

const colors = ["red", "blue", "green", "yellow", "purple", "indigo", "orange"];

const MyBubbleMenu = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: "bottom",
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePress: true,
    // TODO
    escapeKey: true,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  console.log();

  return (
    <BubbleMenu
      editor={editor}
      // FIX: maybe I could give it a class like isOpen and set that value
      // FIX: to false if outside of the bubble menu has been clicked
      shouldShow={({ from, to }) => from !== to}
      options={{ placement: "top" }}
      updateDelay={250}
      resizeDelay={250}
      className="my-bubble-menu"
    >
      {/* FIX: got to give it an onClick functionality */}
      {/* FIX: also gotta add more to the tooltip like Bold and CTRL + B */}
      <BubbleMenuOption icon={<p>B</p>} shortcut={<p>CTRL + B</p>} />
      <BubbleMenuOption icon={<p>I</p>} shortcut={<p>CTRL + I</p>} />
      <BubbleMenuOption icon={<p>U</p>} shortcut={<p>CTRL + U</p>} />
      <BubbleMenuOption icon={<p>S</p>} shortcut={<p>CTRL + S</p>} />
      <BubbleMenuOption
        icon={
          <p>
            A<sup>a</sup>
          </p>
        }
        shortcut={<p>CTRL + ^</p>}
      />

      {/* REVIEW */}
      <div
        className="bubble-menu_icon-button"
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="bubble-menu_color" />
      </div>

      {isOpen && (
        <div
          className="dropdown"
          style={floatingStyles}
          ref={refs.setFloating}
          {...getFloatingProps()}
        >
          {colors.map((color, i) => {
            return (
              <div
                key={`color-${i}`}
                style={{
                  backgroundColor: color,
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                }}
              ></div>
            );
          })}
        </div>
      )}
      {/* REVIEW */}

      <div className="bubble-menu_icon-button">
        <div className="bubble-menu_highlight" />
      </div>

      <div className="bubble-menu_icon-button">
        <p>L</p>
      </div>

      <div className="bubble-menu_icon-button">
        <p>#</p>
      </div>

      <div className="bubble-menu_icon-button">
        <p>😇</p>
      </div>
    </BubbleMenu>
  );
};

export default MyBubbleMenu;
