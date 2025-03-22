import React from "react";
import Icon from "./Icon";
import ActionBlock from "./ActionBlock";

export default function Sidebar({
  containerName,
  blocks,
  onStartDrag,
  moveBlock,
  draggedBlock,
  clearDrag,
  handleChange, // function from parent to update palette blocks
}) {
  const generateLabel = (block) => {
    if (block.type === "move") return `Move ${block.value} steps`;
    if (block.type === "turn") return `Turn ${block.value}°`;
    if (block.type === "goto") return `Go to x:${block.x} y:${block.y}`;
    if (block.type === "repeat") return `Repeat ${block.times} times`;
    return block.label;
  };

  // Called by ActionBlock when the user presses down on the block.
  const handleMouseDownBlock = (block) => {
    onStartDrag({ ...block, source: containerName });
  };

  // On mouse up, if a block dragged from another container is dropped here, move it.
  const handleMouseUp = (e) => {
    e.stopPropagation();
    if (draggedBlock && draggedBlock.source !== containerName) {
      moveBlock(draggedBlock, containerName);
    }
    clearDrag();
  };

  return (
    <div
      className="w-60 flex-none h-[calc(100vh-80px)] overflow-y-auto flex flex-col p-2 border-r border-gray-200 bg-white"
      onMouseUp={handleMouseUp}
    >
      <div className="font-bold mb-2">Motion Blocks</div>
      {blocks.map((block) => (
        <ActionBlock
          key={block.id}
          block={block}
          onChangeValue={(blockId, field, value) =>
            handleChange(blockId, field, value)
          }
          onMouseDownBlock={handleMouseDownBlock}
        />
      ))}
    </div>
  );
}
