import React, { useEffect, useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ commands }) {
  const [position, setPosition] = useState({ x: 0, rotation: 0 });

  useEffect(() => {
    let x = 0;
    let rotation = 0;
    commands.forEach((cmd) => {
      if (cmd.type === "move") x += 20;
      if (cmd.type === "turnLeft") rotation -= 15;
      if (cmd.type === "turnRight") rotation += 15;
    });
    setPosition({ x, rotation });
  }, [commands]);

  return (
    <div className="flex-none h-full overflow-y-auto p-4">
      <div
        style={{
          transform: `translateX(${position.x}px) rotate(${position.rotation}deg)`,
          transition: "transform 0.5s ease",
        }}
      >
        <CatSprite />
      </div>
    </div>
  );
}
