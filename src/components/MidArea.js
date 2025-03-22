import React from "react";

export default function MidArea({
  containerName,
  blocks,
  onStartDrag,
  moveBlock,
  draggedBlock,
  clearDrag,
}) {
  const handleMouseDown = (block) => {
    onStartDrag({ ...block, source: containerName });
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    if (draggedBlock && draggedBlock.source !== containerName) {
      moveBlock(draggedBlock, containerName);
    }
    clearDrag();
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="flex-1 h-full overflow-auto p-4 border-l border-gray-200"
    >
      <div className="font-bold mb-2">Mid Area</div>
      <div className="w-fit inline-block border-gray-200">
        {blocks.map((block) => (
          <div
            key={block.id}
            onMouseDown={() => handleMouseDown(block)}
            className="bg-blue-500 text-white px-2 py-1 my-1 rounded cursor-pointer select-none"
          >
            {block.label}
          </div>
        ))}
      </div>
    </div>
  );
}
