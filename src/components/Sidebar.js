import React from "react";
import Icon from "./Icon";

export default function Sidebar({
  containerName,
  blocks,
  onStartDrag,
  moveBlock,
  draggedBlock,
  clearDrag,
}) {
  const handleMouseDown = (block) => {
    // Start potential drag (the block is not immediately removed)
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
      className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200"
      onMouseUp={handleMouseUp}
    >
      <div className="font-bold mb-2">Sidebar</div>
      {/* Fixed blocks example (if any) */}
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When this sprite clicked"}
      </div>
      <div className="font-bold mt-4 mb-2">Motion</div>
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
  );
}
