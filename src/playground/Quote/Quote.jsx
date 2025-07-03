import Quotes from "../../assets/icons/quotes.svg?react";

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
          {/* <div className="quote_icon-container">
            <Quotes />
          </div> */}

          <blockquote>{children}</blockquote>

          <p>Jesus Christ of Nazareth</p>
        </div>
      </div>
    </>
  );
};

export default Quote;
