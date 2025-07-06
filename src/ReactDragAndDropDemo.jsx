import { useState, useRef } from "react";

const ReactDragDropDemo = () => {
  const [blocks, setBlocks] = useState([
    { id: "1", content: "First Block", type: "paragraph" },
    { id: "2", content: "Second Block", type: "paragraph" },
    { id: "3", content: "Third Block", type: "heading" },
    { id: "4", content: "Fourth Block", type: "paragraph" },
    { id: "5", content: "Fifth Block", type: "list" },
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  const [dragPosition, setDragPosition] = useState(null); // 'above' or 'below'
  const dragCounter = useRef(0);

  // IDEA
  const handleDragStart = (e, block) => {
    console.log("Drag started:", block);
    setDraggedItem(block);

    console.log("EEEEEEE", e);

    // Set drag data
    e.dataTransfer.setData("text/plain", block.id);
    e.dataTransfer.effectAllowed = "move";

    // Add visual feedback to dragged item
    e.target.style.opacity = "0.5";
  };

  // IDEA
  const handleDragEnd = (e) => {
    console.log("Drag ended");
    setDraggedItem(null);
    setDragOverItem(null);
    setDragPosition(null);
    dragCounter.current = 0;

    // Reset visual feedback
    e.target.style.opacity = "1";
  };

  // IDEA
  const handleDragOver = (e) => {
    e.preventDefault(); // This is crucial for allowing drop
    e.dataTransfer.dropEffect = "move";
  };

  // IDEA
  const handleDragEnter = (e, targetBlock) => {
    e.preventDefault();
    dragCounter.current++;

    if (draggedItem && draggedItem.id !== targetBlock.id) {
      setDragOverItem(targetBlock);

      // Determine if we're dragging over the top or bottom half
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const position = e.clientY < midY ? "above" : "below";
      setDragPosition(position);

      console.log(`Drag over ${targetBlock.content} - position: ${position}`);
    }
  };

  // IDEA
  const handleDragLeave = (e) => {
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setDragOverItem(null);
      setDragPosition(null);
    }
  };

  // IDEA
  const handleDrop = (e, targetBlock) => {
    e.preventDefault();
    console.log("Drop event:", { draggedItem, targetBlock, dragPosition });

    if (!draggedItem || draggedItem.id === targetBlock.id) {
      return;
    }

    const draggedId = e.dataTransfer.getData("text/plain");
    console.log("Dragged ID from dataTransfer:", draggedId);

    // Find indices
    const draggedIndex = blocks.findIndex(
      (block) => block.id === draggedItem.id
    );
    const targetIndex = blocks.findIndex(
      (block) => block.id === targetBlock.id
    );

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create new array without the dragged item
    const newBlocks = blocks.filter((block) => block.id !== draggedItem.id);

    // Calculate the insertion index
    let insertIndex = targetIndex;

    // If dragged item was before target, adjust target index
    if (draggedIndex < targetIndex) {
      insertIndex = targetIndex - 1;
    }

    // Adjust based on drop position
    if (dragPosition === "below") {
      insertIndex += 1;
    }

    // Insert the dragged item at the new position
    newBlocks.splice(insertIndex, 0, draggedItem);

    console.log(
      "New order:",
      newBlocks.map((b) => b.content)
    );
    setBlocks(newBlocks);

    // Clear states
    setDraggedItem(null);
    setDragOverItem(null);
    setDragPosition(null);
    dragCounter.current = 0;
  };

  const getBlockIcon = (type) => {
    switch (type) {
      case "heading":
        return "📝";
      case "list":
        return "📋";
      case "paragraph":
      default:
        return "📄";
    }
  };

  // IDEA
  const getDropIndicatorStyle = (block) => {
    if (dragOverItem?.id === block.id && dragPosition) {
      const baseStyle = {
        position: "absolute",
        left: "0",
        right: "0",
        height: "2px",
        backgroundColor: "#3b82f6",
        zIndex: 10,
        borderRadius: "1px",
      };

      if (dragPosition === "above") {
        return { ...baseStyle, top: "-1px" };
      } else {
        return { ...baseStyle, bottom: "-1px" };
      }
    }
    return null;
  };

  const containerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "24px",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
    fontFamily: "system-ui, -apple-system, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    padding: "24px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "24px",
    textAlign: "center",
  };

  const instructionStyle = {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#dbeafe",
    borderRadius: "8px",
    border: "1px solid #bfdbfe",
  };

  const instructionTitleStyle = {
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: "8px",
  };

  const instructionListStyle = {
    color: "#1e3a8a",
    fontSize: "14px",
    lineHeight: "1.4",
    margin: 0,
    paddingLeft: "16px",
  };

  const blockContainerStyle = {
    marginBottom: "12px",
  };

  const getBlockStyle = (block) => {
    const baseStyle = {
      position: "relative",
      border: "2px dashed #d1d5db",
      borderRadius: "8px",
      padding: "16px",
      cursor: "move",
      transition: "all 0.2s ease",
      backgroundColor: "white",
    };

    let additionalStyle = {};

    if (draggedItem?.id === block.id) {
      additionalStyle = {
        opacity: "0.5",
        transform: "rotate(1deg)",
      };
    }

    if (dragOverItem?.id === block.id) {
      additionalStyle = {
        ...additionalStyle,
        borderColor: "#60a5fa",
        backgroundColor: "#dbeafe",
      };
    }

    return { ...baseStyle, ...additionalStyle };
  };

  const blockContentStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const iconStyle = {
    fontSize: "20px",
  };

  const textContainerStyle = {
    flex: "1",
  };

  const blockTextStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const blockTitleStyle = {
    fontWeight: "500",
    color: "#1f2937",
  };

  const blockTypeStyle = {
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "2px 8px",
    borderRadius: "4px",
  };

  const blockIdStyle = {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
  };

  const dragHandleStyle = {
    color: "#9ca3af",
  };

  const debugStyle = {
    marginTop: "32px",
    padding: "16px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
  };

  const debugTitleStyle = {
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  };

  const debugContentStyle = {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: "1.5",
  };

  const debugItemStyle = {
    marginBottom: "4px",
  };

  const consoleNoteStyle = {
    marginTop: "16px",
    fontSize: "12px",
    color: "#6b7280",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>React Drag & Drop Demo</h1>

        <div style={instructionStyle}>
          <h3 style={instructionTitleStyle}>How it works:</h3>
          <ul style={instructionListStyle}>
            <li>• Drag any block by holding and moving it</li>
            <li>• Blue line shows where the block will be dropped</li>
            <li>• Drop above or below other blocks to reorder</li>
            <li>• Console logs show the technical details</li>
          </ul>
        </div>

        <div>
          {blocks.map((block, index) => (
            <div key={block.id} style={blockContainerStyle}>
              <div
                style={getBlockStyle(block)}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, block)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, block)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, block)}
              >
                {/* Drop indicator */}
                {getDropIndicatorStyle(block) && (
                  <div style={getDropIndicatorStyle(block)} />
                )}

                <div style={blockContentStyle}>
                  <span style={iconStyle}>{getBlockIcon(block.type)}</span>
                  <div style={textContainerStyle}>
                    <div style={blockTextStyle}>
                      <span style={blockTitleStyle}>{block.content}</span>
                      <span style={blockTypeStyle}>{block.type}</span>
                    </div>
                    <div style={blockIdStyle}>ID: {block.id}</div>
                  </div>
                  <div style={dragHandleStyle}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M10 13a1 1 0 100-2 1 1 0 000 2zM10 8a1 1 0 100-2 1 1 0 000 2zM10 3a1 1 0 100-2 1 1 0 000 2zM6 13a1 1 0 100-2 1 1 0 000 2zM6 8a1 1 0 100-2 1 1 0 000 2zM6 3a1 1 0 100-2 1 1 0 000 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Debug Information */}
        <div style={debugStyle}>
          <h3 style={debugTitleStyle}>Debug Info:</h3>
          <div style={debugContentStyle}>
            <div style={debugItemStyle}>
              Dragged Item: {draggedItem ? draggedItem.content : "None"}
            </div>
            <div style={debugItemStyle}>
              Drag Over: {dragOverItem ? dragOverItem.content : "None"}
            </div>
            <div style={debugItemStyle}>Position: {dragPosition || "None"}</div>
            <div style={debugItemStyle}>
              Current Order: {blocks.map((b) => b.content).join(" → ")}
            </div>
          </div>
        </div>

        {/* Event Log */}
        <div style={consoleNoteStyle}>
          Open browser console to see detailed drag & drop event logs
        </div>
      </div>
    </div>
  );
};

export default ReactDragDropDemo;
