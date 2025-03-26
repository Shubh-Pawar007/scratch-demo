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
  handleChange,
  currentPalette,
  setCurrentPalette,
}) {
  // Define the available categories
  const categories = [
    { key: "motion", label: "Motion" },
    { key: "looks", label: "Looks" },
    { key: "events", label: "Events" },
    { key: "controls", label: "Controls" },
  ];

  const handleMouseDownBlock = (block) => {
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
      className="w-80 flex-none h-[calc(100vh-80px)] overflow-y-auto flex flex-col p-2 border-r border-gray-200 bg-white"
      onMouseUp={handleMouseUp}
    >
      {/* Category selection tabs */}
      <div className="mb-2 flex space-x-2">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCurrentPalette(cat.key)}
            className={
              currentPalette === cat.key
                ? "bg-blue-700 text-white px-2 py-1 rounded"
                : "bg-gray-300 px-2 py-1 rounded"
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="font-bold mb-2">
        {currentPalette.charAt(0).toUpperCase() + currentPalette.slice(1)}{" "}
        Blocks
      </div>
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
