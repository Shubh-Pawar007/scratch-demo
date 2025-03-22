import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

// Helper function to execute a sprite’s script and update its state.
function executeScript(script, initialState) {
  let state = { ...initialState };
  script.forEach((cmd) => {
    if (cmd.type === "move") {
      state.x += Number(cmd.value || 10);
    } else if (cmd.type === "turn") {
      state.rotation += Number(cmd.value || 15);
    } else if (cmd.type === "goto") {
      state.x = Number(cmd.x || 0);
      state.y = Number(cmd.y || 0);
    } else if (cmd.type === "repeat") {
      const times = Number(cmd.times || 2);
      for (let i = 0; i < times; i++) {
        state = executeScript(cmd.commands || [], state);
      }
    }
  });
  return state;
}

// Define a helper to regenerate the block label
function generateLabel(block) {
  if (block.type === "move") {
    return `Move ${block.value} steps`;
  } else if (block.type === "turn") {
    return `Turn ${block.value}°`;
  } else if (block.type === "goto") {
    return `Go to x:${block.x} y:${block.y}`;
  } else if (block.type === "repeat") {
    return `Repeat ${block.times} times`;
  }
  return block.label;
}

export default function App() {
  // Palette and sprites state (unchanged)
  const [palette, setPalette] = useState([
    { id: 1, type: "move", label: "Move 10 steps", value: 10 },
    { id: 2, type: "turn", label: "Turn 15°", value: 15 },
    { id: 3, type: "goto", label: "Go to x:0 y:0", x: 0, y: 0 },
    { id: 4, type: "repeat", label: "Repeat 2 times", times: 2, commands: [] },
  ]);

  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Sprite 1",
      script: [],
      position: { x: 50, y: 50 },
      rotation: 0,
    },
  ]);
  const [currentSpriteId, setCurrentSpriteId] = useState(1);

  // (drag state for blocks remains unchanged)
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [potentialDrag, setPotentialDrag] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const startPotentialDrag = (block) => {
    setPotentialDrag({ block, startPos: mousePos });
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (potentialDrag && !draggedBlock) {
      const dx = e.clientX - potentialDrag.startPos.x;
      const dy = e.clientY - potentialDrag.startPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 10) {
        setDraggedBlock(potentialDrag.block);
        setPotentialDrag(null);
      }
    }
  };

  const handleGlobalMouseUp = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  const currentSprite = sprites.find((s) => s.id === currentSpriteId);

  const updateCurrentSpriteScript = (newScript) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === currentSpriteId ? { ...s, script: newScript } : s
      )
    );
  };

  const moveBlock = (block, target) => {
    if (block.source === target) return;
    if (block.source === "palette" && target === "script") {
      updateCurrentSpriteScript([
        ...currentSprite.script,
        { ...block, source: "script", id: Date.now() },
      ]);
    } else if (block.source === "script" && target === "palette") {
      updateCurrentSpriteScript(
        currentSprite.script.filter((b) => b.id !== block.id)
      );
    }
  };

  const clearDrag = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  const addSprite = () => {
    const newId = Date.now();
    setSprites((prev) => [
      ...prev,
      {
        id: newId,
        name: `Sprite ${prev.length + 1}`,
        script: [],
        position: { x: 50, y: 50 },
        rotation: 0,
      },
    ]);
    setCurrentSpriteId(newId);
  };

  const play = () => {
    const updatedSprites = sprites.map((sprite) => {
      const newState = executeScript(sprite.script, sprite.position);
      return {
        ...sprite,
        position: { x: newState.x, y: newState.y },
        rotation: newState.rotation,
      };
    });
    for (let i = 0; i < updatedSprites.length; i++) {
      for (let j = i + 1; j < updatedSprites.length; j++) {
        const s1 = updatedSprites[i];
        const s2 = updatedSprites[j];
        const dx = s1.position.x - s2.position.x;
        const dy = s1.position.y - s2.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 50) {
          const temp = s1.script;
          updatedSprites[i] = { ...s1, script: s2.script };
          updatedSprites[j] = { ...s2, script: temp };
        }
      }
    }
    setSprites(updatedSprites);
  };

  function handlePaletteChange(blockId, field, value) {
    setPalette((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? {
              ...b,
              [field]: value,
              label: generateLabel({ ...b, [field]: value }),
            }
          : b
      )
    );
  }

  function updateScriptBlock(blockId, field, value) {
    setSprites((prevSprites) =>
      prevSprites.map((sprite) =>
        sprite.id === currentSpriteId
          ? {
              ...sprite,
              script: sprite.script.map((b) =>
                b.id === blockId
                  ? {
                      ...b,
                      [field]: value,
                      label: generateLabel({ ...b, [field]: value }),
                    }
                  : b
              ),
            }
          : sprite
      )
    );
  }

  // Callback to update sprite position when dragged on stage
  const updateSpritePosition = (spriteId, newPosition) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId ? { ...sprite, position: newPosition } : sprite
      )
    );
  };

  return (
    <div
      className="bg-blue-100 pt-6 font-sans min-h-screen"
      onMouseMove={handleMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      {draggedBlock && (
        <div
          className="pointer-events-none fixed z-50 px-2 py-1 rounded text-white text-sm bg-blue-600"
          style={{ left: mousePos.x + 10, top: mousePos.y + 10 }}
        >
          {draggedBlock.label}
        </div>
      )}

      {/* Top bar with Sprite selector, Play, and Add Sprite buttons */}
      <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-300">
        <div>
          {sprites.map((sprite) => (
            <button
              key={sprite.id}
              onClick={() => setCurrentSpriteId(sprite.id)}
              className={`px-3 py-1 mr-2 rounded ${
                sprite.id === currentSpriteId
                  ? "bg-green-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {sprite.name}
            </button>
          ))}
          <button
            onClick={addSprite}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            Add Sprite
          </button>
        </div>
        <button
          onClick={play}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          Play
        </button>
      </div>

      <div className="h-[calc(100vh-80px)] flex flex-row">
        {/* Left: Palette */}
        <Sidebar
          containerName="palette"
          blocks={palette}
          setPalette={setPalette}
          onStartDrag={startPotentialDrag}
          moveBlock={moveBlock}
          draggedBlock={draggedBlock}
          clearDrag={clearDrag}
          handleChange={handlePaletteChange}
        />
        {/* Center: Script Editor */}
        <MidArea
          containerName="script"
          blocks={currentSprite.script}
          onStartDrag={startPotentialDrag}
          moveBlock={moveBlock}
          draggedBlock={draggedBlock}
          clearDrag={clearDrag}
          updateScriptBlock={updateScriptBlock}
        />
        {/* Right: Stage */}
        <PreviewArea
          sprites={sprites}
          updateSpritePosition={updateSpritePosition}
        />
      </div>
    </div>
  );
}
