// File: src/components/ActionBlock.js

import React from "react";

/**
 * A reusable action block that:
 *  - Shows label + input fields based on block.type
 *  - Calls onChangeValue when inputs change
 *  - Calls onMouseDownBlock when the user presses down (for drag)
 */
export default function ActionBlock({
  block,
  onChangeValue,
  onMouseDownBlock,
}) {
  // Helper to handle changes to any numeric field (e.g. "value", "x", "y", "times")
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

      {/* Fallback: if block.type doesn't match, just show its label */}
      {block.type !== "move" &&
        block.type !== "turn" &&
        block.type !== "goto" &&
        block.type !== "repeat" && <span>{block.label}</span>}
    </div>
  );
}
