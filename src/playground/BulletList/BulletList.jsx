import "./BulletList.css";

const BulletList = ({ indentLevel = 0, children }) => {
  return (
    <div
      data-id="456"
      data-node-type="block"
      data-content-type="bulletList"
      data-indent-level={indentLevel}
      className="block block-bulletList"
    >
      <div
        data-node-type="content"
        data-content-type="bulletList"
        className="content content-bulletList"
      >
        <p>{children}</p>
      </div>
    </div>
  );
};

export default BulletList;
