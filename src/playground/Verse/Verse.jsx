import "./Verse.css";

const Verse = ({ indentLevel, verseNumber, children }) => {
  return (
    <>
      <div
        data-node-type="block"
        data-content-type="verse"
        data-indent-level={indentLevel}
        className="block"
      >
        <div data-node-type="content">
          <p>
            <sup>{verseNumber}</sup>
            {children}
          </p>
        </div>
      </div>
    </>
  );
};

export default Verse;
