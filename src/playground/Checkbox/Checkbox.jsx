import { useState } from "react";

import "./Checkbox.css";

// FIX: handle disabled state
// FIX: what is focus-visible
// FIX: deal with hovering
const Checkbox = ({ id, disabled = false }) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleOnClick = () => {
    if (disabled) return;

    setIsChecked((prev) => !prev);
  };

  return (
    <>
      <button
        id={id}
        type="button"
        role="checkbox"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        value={isChecked ? "on" : "off"}
        data-slot="checkbox"
        disabled={disabled}
        onClick={handleOnClick}
        className="checkbox"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20 6 9 17l-5-5"></path>
        </svg>
      </button>
    </>
  );
};

export default Checkbox;
