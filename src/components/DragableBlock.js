import React from "react";
import { useDrag } from "react-dnd";

export default function DraggableBlock({ type, children }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "block",
    item: { type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="px-2 py-1 my-2 text-sm cursor-pointer rounded bg-opacity-80 text-white"
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor:
          type === "move"
            ? "#3B82F6"
            : type === "turnLeft" || type === "turnRight"
            ? "#3B82F6"
            : "#FACC15",
      }}
    >
      {children}
    </div>
  );
}
