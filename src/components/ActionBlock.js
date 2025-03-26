import React from "react";

export default function ActionBlock({
  block,
  onChangeValue,
  onMouseDownBlock,
}) {
  // Helper to update any field value
  const handleInputChange = (field, newValue) => {
    onChangeValue(block.id, field, newValue);
  };

  return (
    <div
      onMouseDown={() => onMouseDownBlock(block)}
      className="bg-blue-500 text-white px-2 py-1 my-1 rounded cursor-pointer select-none"
    >
      {block.type === "move" && (
        <div className="flex items-center">
          <span>Move </span>
          <input
            type="number"
            value={block.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 w-12 p-1 text-black"
          />
          <span> steps</span>
        </div>
      )}
      {block.type === "turn" && (
        <div className="flex items-center">
          <span>Turn </span>
          <input
            type="number"
            value={block.value}
            onChange={(e) => handleInputChange("value", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 w-12 p-1 text-black"
          />
          <span>°</span>
        </div>
      )}
      {block.type === "goto" && (
        <div className="flex items-center">
          <span>Go to x:</span>
          <input
            type="number"
            value={block.x}
            onChange={(e) => handleInputChange("x", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 w-12 p-1 text-black"
          />
          <span> y:</span>
          <input
            type="number"
            value={block.y}
            onChange={(e) => handleInputChange("y", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 w-12 p-1 text-black"
          />
        </div>
      )}
      {block.type === "repeat" && (
        <div className="flex items-center">
          <span>Repeat </span>
          <input
            type="number"
            value={block.times}
            onChange={(e) => handleInputChange("times", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 w-12 p-1 text-black"
          />
          <span> times</span>
        </div>
      )}
      {block.type === "say" && (
        <div className="flex items-center">
          <span>Say </span>
          <input
            type="text"
            value={block.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 p-1 text-black"
          />
        </div>
      )}
      {block.type === "think" && (
        <div className="flex items-center">
          <span>Think </span>
          <input
            type="text"
            value={block.text}
            onChange={(e) => handleInputChange("text", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 p-1 text-black"
          />
        </div>
      )}
      {block.type === "wait" && (
        <div className="flex items-center">
          <span>Wait </span>
          <input
            type="number"
            value={block.time}
            onChange={(e) => handleInputChange("time", e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            className="mx-1 w-12 p-1 text-black"
          />
          <span> sec</span>
        </div>
      )}
      {(block.type === "whenClicked" ||
        block.type === "whenFlagClicked" ||
        block.type === "forever") && (
        <div className="flex items-center">
          <span>{block.label}</span>
        </div>
      )}
      {![
        "move",
        "turn",
        "goto",
        "repeat",
        "say",
        "think",
        "wait",
        "whenClicked",
        "whenFlagClicked",
        "forever",
      ].includes(block.type) && <span>{block.label}</span>}
    </div>
  );
}
