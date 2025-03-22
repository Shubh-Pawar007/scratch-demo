import React, { useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites, updateSpritePosition }) {
  const [draggingSpriteId, setDraggingSpriteId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleSpriteMouseDown = (e, sprite) => {
    e.stopPropagation();
    // Get the bounding rectangle of the sprite element
    const spriteRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - spriteRect.left;
    const offsetY = e.clientY - spriteRect.top;
    setDraggingSpriteId(sprite.id);
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (draggingSpriteId !== null) {
      // Get container's bounding rect
      const containerRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - containerRect.left - offset.x;
      const newY = e.clientY - containerRect.top - offset.y;
      updateSpritePosition(draggingSpriteId, { x: newX, y: newY });
    }
  };

  const handleMouseUp = (e) => {
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
      {sprites.map((sprite) => (
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
          <CatSprite />
          <div className="text-xs text-center">{sprite.name}</div>
        </div>
      ))}
    </div>
  );
}
