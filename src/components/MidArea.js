// File: src/components/MidArea.js

import React from "react";
import ActionBlock from "./ActionBlock";

export default function MidArea({
  containerName,
  blocks,
  onStartDrag,
  moveBlock,
  draggedBlock,
  clearDrag,
  // This is the parent's callback for updating script block values
  updateScriptBlock,
}) {
  const handleMouseUp = (e) => {
    e.stopPropagation();
    if (draggedBlock && draggedBlock.source !== containerName) {
      moveBlock(draggedBlock, containerName);
    }
    clearDrag();
  };

  // Called by ActionBlock on input changes
  const onChangeValue = (blockId, field, value) => {
    updateScriptBlock(blockId, field, value);
  };

  // Called by ActionBlock on mouse down
  const onMouseDownBlock = (block) => {
    onStartDrag({ ...block, source: containerName });
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="flex-1 h-[calc(100vh-80px)] overflow-auto p-4 border-l border-gray-200 bg-white"
    >
      <div className="font-bold mb-2">Script Editor</div>
      <div className="inline-block border border-gray-200 p-2">
        {blocks.map((block) => (
          <ActionBlock
            key={block.id}
            block={block}
            onChangeValue={onChangeValue}
            onMouseDownBlock={onMouseDownBlock}
          />
        ))}
      </div>
    </div>
  );
}
