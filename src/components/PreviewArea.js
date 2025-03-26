import React, { useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({
  sprites,
  updateSpritePosition,
  isPlaying,
}) {
  const [draggingSpriteId, setDraggingSpriteId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleSpriteMouseDown = (e, sprite) => {
    e.stopPropagation();
    const spriteRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - spriteRect.left;
    const offsetY = e.clientY - spriteRect.top;
    setDraggingSpriteId(sprite.id);
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (draggingSpriteId !== null) {
      const containerRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - offset.x;
      const newY = e.clientY - containerRect.top - offset.y;
      updateSpritePosition(draggingSpriteId, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (draggingSpriteId !== null) {
      setDraggingSpriteId(null);
    }
  };

  return (
    <div
      className="w-1/3 bg-white border-l border-gray-200 p-4 relative"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="font-bold mb-2">Stage</div>
      {sprites.map((sprite) => {
        // If sprite is hidden, do not render it.
        if (!sprite.isVisible) return null;
        return (
          <div
            key={sprite.id}
            className="absolute"
            style={{
              left: sprite.position.x,
              top: sprite.position.y,
              transform: `rotate(${sprite.rotation}deg)`,
              transition: "all 0.5s ease",
            }}
            onMouseDown={(e) => handleSpriteMouseDown(e, sprite)}
          >
            <div className="relative">
              <CatSprite />
              {isPlaying && sprite.lookText && (
                <div
                  className="absolute top-0 right-0 text-xs text-black bg-yellow-300 rounded px-1 py-0.5"
                  style={{ transform: "translate(50%, -50%)" }}
                >
                  {sprite.lookText}
                </div>
              )}
            </div>
            <div className="text-xs text-center">{sprite.name}</div>
          </div>
        );
      })}
    </div>
  );
}
