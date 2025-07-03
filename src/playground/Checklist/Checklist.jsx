import "./Checklist.css";

import Checkbox from "../Checkbox/Checkbox";

const Checklist = ({ indentLevel = 0, children }) => {
  return (
    <div
      data-node-type="block"
      data-content-type="checklist"
      data-indent-level={indentLevel}
      className="block"
    >
      <div data-node-type="content" data-content-type="checklist">
        <Checkbox />

        <p>{children}</p>
      </div>
    </div>
  );
};

export default Checklist;
