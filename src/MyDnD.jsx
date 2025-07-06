import { useState, useRef } from "react";

import "./MyDnd.css";

// REVIEW: In dragstart and drop events: Full access to data
// REVIEW: In dragover, dragenter, dragleave: Only access to data types, not the actual data
const MyDnD = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, icon: "🤕", content: "I am hungry." },
    { id: 2, icon: "🤔", content: "How should I go about this?" },
    { id: 3, icon: "☦️", content: "Lord help me!" },
    { id: 4, icon: "⛪️", content: "I want to go to church." },
    { id: 5, icon: "💪", content: "Lord give me courage!" },
  ]);
  const insertAtTop = useRef(false);
  const blockIndex = useRef(null);
  const xPer = useRef(0);
  const yPer = useRef(0);

  const handleOnDragStart = (e, block, index) => {
    e.dataTransfer.setData("text/plain", block.id);
    e.target.dataset.isDragged = true;
    blockIndex.current = index;
  };

  const handleOnDragEnter = (e) => {
    // console.log(e.target, yPer.current);
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();

    const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
    const blockElement = elementUnderMouse?.closest(".dndBlock");

    if (blockElement) {
      const { top, right, bottom, left } = blockElement.getBoundingClientRect();

      const xPercentage = ((e.clientX - left) / (right - left)) * 100;
      const yPercentage = ((e.clientY - bottom) / (top - bottom)) * 100;

      xPer.current = xPercentage;
      yPer.current = yPercentage;

      if (yPercentage > 50) {
        insertAtTop.current = true;
        blockElement.dataset.insertAtTop = true;
        blockElement.dataset.insertAtBottom = false;
      } else {
        blockElement.dataset.insertAtTop = false;
        blockElement.dataset.insertAtBottom = true;
      }
    }
  };

  // IDEA: this is what resets
  const handleOnDragLeave = (e) => {
    xPer.current = 0;
    yPer.current = 0;
    insertAtTop.current = false;
    blockIndex.current = null;
    e.target.dataset.insertAtTop = false;
    e.target.dataset.insertAtBottom = false;
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
  };

  const handleOnDragEnd = (e) => {
    e.target.dataset.isDragged = false;
  };

  return (
    <div className="dndBlocks-container">
      {blocks.map((block, index) => {
        return (
          <div
            key={block.id}
            className="dndBlock"
            draggable={true}
            onDragStart={(e) => handleOnDragStart(e, block, index)}
            onDragEnd={handleOnDragEnd}
            onDragOver={handleOnDragOver}
            onDragEnter={handleOnDragEnter}
            onDragLeave={handleOnDragLeave}
            data-id={block.id}
            onDrop={handleOnDrop}
            data-dnd-block={true}
            data-is-dragged={false}
            data-insert-at-top={false}
            data-insert-at-bottom={false}
          >
            <h1>{block.id}</h1>

            <section className="dndBlock-section">
              <span>{block.icon}</span>
              <p>{block.content}</p>
            </section>
          </div>
        );
      })}
    </div>
  );
};

export default MyDnD;
