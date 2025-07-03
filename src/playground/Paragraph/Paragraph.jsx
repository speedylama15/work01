import "./Paragraph.css";

const Paragraph = ({ indentLevel = 0, children }) => {
  return (
    <div
      data-id="123"
      data-node-type="block"
      data-content-type="paragraph"
      data-indent-level={indentLevel}
      className="block block-paragraph"
    >
      <div
        data-node-type="content"
        data-content-type="paragraph"
        className="content content-paragraph"
      >
        <p>{children}</p>
      </div>
    </div>
  );
};

export default Paragraph;
