import "./NumberedList.css";

const NumberedList = ({ indentLevel = 0, startNumber, children }) => {
  return (
    <div
      data-id="789"
      data-node-type="block"
      data-content-type="numberedList"
      data-indent-level={indentLevel}
      className="block block-numberedList"
    >
      <div
        data-node-type="content"
        data-content-type="numberedList"
        className="content content-numberedList"
      >
        <p data-start-number={startNumber}>{children}</p>
      </div>
    </div>
  );
};

export default NumberedList;
