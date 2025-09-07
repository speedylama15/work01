import { useState } from "react";
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  useHover,
  useRole,
  useInteractions,
} from "@floating-ui/react";

import "./BubbleMenuOption.css";

const BubbleMenuOption = ({ icon, shortcut }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: "top",
    // IDEA: make this a prop?
    middleware: [offset(2), flip(), shift()],
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: 500, close: 100 },
  });

  const role = useRole(context, {
    role: "tooltip",
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    role,
  ]);

  return (
    <div
      className="bubble-menu-option"
      ref={refs.setReference}
      {...getReferenceProps()}
    >
      <div className="bubble-menu-option_icon-container">
        {/* IDEA: place the icons here */}
        {icon}
      </div>

      {isOpen && (
        <div
          className="bubble-menu-option_tooltip"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          {shortcut}
        </div>
      )}
    </div>
  );
};

export default BubbleMenuOption;
