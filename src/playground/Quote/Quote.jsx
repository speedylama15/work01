import "./Quote.css";

const Quote = ({ indentLevel = 0, children }) => {
  return (
    <>
      <div
        data-node-type="block"
        data-content-type="blockquote"
        data-indent-level={indentLevel}
        className="block"
      >
        <div data-node-type="content">
          <blockquote class="bn-inline-content">
            I am the way and the truth and the life.
            <br />
            No one comes to the Father except through me.
          </blockquote>

          <p>Jesus Christ of Nazareth</p>
        </div>
      </div>
    </>
  );
};

export default Quote;
