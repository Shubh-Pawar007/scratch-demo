import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  const [sidebarBlocks, setSidebarBlocks] = useState([
    { id: 1, type: "event", label: "When clicked", source: "sidebar" },
    { id: 2, type: "move", label: "Move 10 steps", source: "sidebar" },
    { id: 3, type: "turnLeft", label: "Turn Left 15°", source: "sidebar" },
    { id: 4, type: "turnRight", label: "Turn Right 15°", source: "sidebar" },
  ]);
  const [midBlocks, setMidBlocks] = useState([]);
  const [draggedBlock, setDraggedBlock] = useState(null); // Block that is actually dragging
  const [potentialDrag, setPotentialDrag] = useState(null); // Temporary state on mouse down
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // When the user presses down on a block, record it along with the starting position.
  const startPotentialDrag = (block) => {
    setPotentialDrag({ block, startPos: mousePos });
  };

  // Global mouse move updates the mouse position and checks if movement exceeds threshold.
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (potentialDrag && !draggedBlock) {
      const dx = e.clientX - potentialDrag.startPos.x;
      const dy = e.clientY - potentialDrag.startPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 10) {
        // threshold (10 pixels)
        setDraggedBlock(potentialDrag.block);
        setPotentialDrag(null);
      }
    }
  };

  // Global mouse up handler (if drop not handled by a container)
  const handleGlobalMouseUp = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  // Move a block from one container to the other.
  const moveBlock = (block, target) => {
    if (block.source === target) return; // no change if dropped in the same container
    if (block.source === "sidebar" && target === "mid") {
      setSidebarBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setMidBlocks((prev) => [...prev, { ...block, source: target }]);
    } else if (block.source === "mid" && target === "sidebar") {
      setMidBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setSidebarBlocks((prev) => [...prev, { ...block, source: target }]);
    }
  };

  // Helper to clear both potential and actual drag states.
  const clearDrag = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  return (
    <div
      className="bg-blue-100 pt-6 font-sans"
      onMouseMove={handleMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      {/* Ghost preview shows only when a block is actively dragging */}
      {draggedBlock && (
        <div
          className="pointer-events-none fixed z-50 px-2 py-1 rounded text-white text-sm bg-blue-600"
          style={{ left: mousePos.x + 10, top: mousePos.y + 10 }}
        >
          {draggedBlock.label}
        </div>
      )}

      <div className="h-screen overflow-hidden flex flex-row">
        <div className="flex-1 flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar
            containerName="sidebar"
            blocks={sidebarBlocks}
            onStartDrag={startPotentialDrag}
            moveBlock={moveBlock}
            draggedBlock={draggedBlock}
            clearDrag={clearDrag}
          />
          <MidArea
            containerName="mid"
            blocks={midBlocks}
            onStartDrag={startPotentialDrag}
            moveBlock={moveBlock}
            draggedBlock={draggedBlock}
            clearDrag={clearDrag}
          />
        </div>
        <div className="w-1/3 bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea commands={midBlocks} />
        </div>
      </div>
    </div>
  );
}
