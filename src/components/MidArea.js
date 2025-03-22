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
  updateScriptBlock,
  sprites,
  currentSpriteId,
  setCurrentSpriteId,
  addSprite,
  removeSprite,
}) {
  const handleMouseUp = (e) => {
    e.stopPropagation();
    if (draggedBlock && draggedBlock.source !== containerName) {
      moveBlock(draggedBlock, containerName);
    }
    clearDrag();
  };

  const onChangeValue = (blockId, field, value) => {
    updateScriptBlock(blockId, field, value);
  };

  const onMouseDownBlock = (block) => {
    onStartDrag({ ...block, source: containerName });
  };

  return (
    <div
      onMouseUp={handleMouseUp}
      className="flex-1 h-full overflow-auto p-4 border-l border-gray-200 bg-white"
    >
      {/* Sprite Controls at the top */}
      <div className="font-bold mb-2">Mid Area</div>
      <div className="mb-4">
        <div className="flex items-center flex-wrap gap-2">
          {sprites.map((sprite) => (
            <div key={sprite.id} className="flex items-center">
              {/* Sprite selection button */}
              <button
                onClick={() => setCurrentSpriteId(sprite.id)}
                className={`px-3 py-2 mr-1 rounded relative ${
                  sprite.id === currentSpriteId
                    ? "bg-green-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {sprite.name}
                {/* Remove sprite button */}
                <button
                  onClick={() => removeSprite(sprite.id)}
                  className="text-red-500 hover:text-red-700 absolute right-0 top-0 z-10"
                  title="Remove Sprite"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 cursor-pointer border border-red-400 rounded"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </button>
            </div>
          ))}
          {/* Add Sprite button */}
          <button
            onClick={addSprite}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            Add Sprite
          </button>
        </div>
      </div>

      <div className="font-bold mb-2">Action Block Editor</div>
      <div className="border rounded-2xl h-2/3 relative">
        {blocks.length === 0 && (
          <div className="text-gray-500 absolute top-4 left-4 ">
            Drag Action blocks here
          </div>
        )}
        <div className="inline-block p-2">
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
    </div>
  );
}
