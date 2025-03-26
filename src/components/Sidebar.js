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
  const categories = [
    { key: "motion", label: "Motion" },
    { key: "looks", label: "Looks" },
    { key: "events", label: "Events" },
    { key: "controls", label: "Controls" },
  ];

  // Mapping for block bgColors (used when rendering ActionBlock)
  const paletteBgColors = {
    motion: "bg-blue-500",
    looks: "bg-purple-500",
    events: "bg-yellow-500",
    controls: "bg-red-300",
  };

  // Mappings for category button backgrounds in selected/unselected states
  const selectedBg = {
    motion: "bg-blue-500",
    looks: "bg-purple-500",
    events: "bg-yellow-500",
    controls: "bg-red-300",
  };

  const unselectedBg = {
    motion: "bg-blue-300",
    looks: "bg-purple-300",
    events: "bg-yellow-300",
    controls: "bg-red-100",
  };

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
      className="w-80 max-w-[300px] h-[calc(100vh-80px)] flex flex-col p-2 border-r border-gray-200 bg-white"
      onMouseUp={handleMouseUp}
    >
      {/* Category selection buttons */}
      <div className="flex space-x-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCurrentPalette(cat.key)}
            className={`px-2 py-1 rounded text-white ${
              currentPalette === cat.key
                ? selectedBg[cat.key]
                : unselectedBg[cat.key]
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Block list area */}
      <div className="flex-1 overflow-y-auto">
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
            bgColor={paletteBgColors[currentPalette]}
          />
        ))}
      </div>
    </div>
  );
}
