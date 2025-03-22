import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

/**
 * A helper delay function for pausing between commands
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Collision checker:
 * Loops through sprites and swaps their scripts if two sprites collide.
 */
const COLLISION_DISTANCE = 50; // adjust as needed
export default function App() {
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

  // Drag state for blocks
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [potentialDrag, setPotentialDrag] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /**
   * Generates a new label for a block when its values change
   */
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

  /**
   * Called on mouse move anywhere in the app to handle block dragging
   */
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

  /**
   * Called on mouse up anywhere in the app to end a drag
   */
  const handleGlobalMouseUp = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  /**
   * Called when user first presses down on a block to "potentially" drag
   */
  const startPotentialDrag = (block) => {
    setPotentialDrag({ block, startPos: mousePos });
  };

  /**
   * Collision checker: loops through sprites and swaps scripts if they collide
   */
  const checkAndSwapCollisions = () => {
    setSprites((prevSprites) => {
      const updated = [...prevSprites];
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const s1 = updated[i];
          const s2 = updated[j];
          const dx = s1.position.x - s2.position.x;
          const dy = s1.position.y - s2.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < COLLISION_DISTANCE) {
            console.log(
              `Collision detected between ${s1.name} and ${s2.name}. Swapping animations.`
            );
            // Swap scripts
            const tempScript = s1.script;
            updated[i] = { ...s1, script: s2.script };
            updated[j] = { ...s2, script: tempScript };
          }
        }
      }
      return updated;
    });
  };

  /**
   * Asynchronously run a list of commands sequentially for a given sprite,
   * starting with an initial state (if not provided, initialize from the sprite)
   */
  const runSpriteCommands = async (spriteId, commands, initState = null) => {
    let state = initState;
    if (!state) {
      const sprite = sprites.find((s) => s.id === spriteId);
      state = { ...sprite.position, rotation: sprite.rotation };
    }

    for (const cmd of commands) {
      if (cmd.type === "move") {
        const steps = Number(cmd.value || 10);
        const radians = state.rotation * (Math.PI / 180);
        state.x += Math.cos(radians) * steps;
        state.y += Math.sin(radians) * steps;
      } else if (cmd.type === "turn") {
        state.rotation += Number(cmd.value || 15);
      } else if (cmd.type === "goto") {
        state.x = Number(cmd.x || 0);
        state.y = Number(cmd.y || 0);
      } else if (cmd.type === "repeat") {
        const times = Number(cmd.times || 2);
        for (let i = 0; i < times; i++) {
          state = await runSpriteCommands(spriteId, cmd.commands || [], state);
        }
        continue; // skip the rest for this block
      }

      // Update the sprite's state in React after each command
      setSprites((prev) =>
        prev.map((s) =>
          s.id === spriteId
            ? {
                ...s,
                position: { x: state.x, y: state.y },
                rotation: state.rotation,
              }
            : s
        )
      );

      // Wait a bit before processing the next command
      await delay(500);

      // Check for collisions and swap animations if any sprites collided
      checkAndSwapCollisions();
    }

    return state;
  };

  /**
   * The "Play" function:
   * - Runs the current sprite's commands asynchronously.
   * - This can be extended to run all sprites if desired.
   */
  const play = async () => {
    const currentSprite = sprites.find((s) => s.id === currentSpriteId);
    if (!currentSprite) return;

    const initialState = {
      ...currentSprite.position,
      rotation: currentSprite.rotation,
    };
    await runSpriteCommands(
      currentSpriteId,
      currentSprite.script,
      initialState
    );
  };

  /**
   * Update the script for the currently selected sprite
   */
  const updateCurrentSpriteScript = (newScript) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === currentSpriteId ? { ...s, script: newScript } : s
      )
    );
  };

  /**
   * Move a block between containers (palette <-> script)
   */
  const moveBlock = (block, target) => {
    if (block.source === target) return;

    const currentSprite = sprites.find((s) => s.id === currentSpriteId);
    if (!currentSprite) return;

    // From palette to script
    if (block.source === "palette" && target === "script") {
      updateCurrentSpriteScript([
        ...currentSprite.script,
        { ...block, source: "script", id: Date.now() },
      ]);
    }
    // From script back to palette
    else if (block.source === "script" && target === "palette") {
      updateCurrentSpriteScript(
        currentSprite.script.filter((b) => b.id !== block.id)
      );
    }
  };

  /**
   * Clears the drag states
   */
  const clearDrag = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  /**
   * Add a new sprite
   */
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

  /**
   * Remove an existing sprite by id
   */
  const removeSprite = (id) => {
    setSprites((prev) => prev.filter((s) => s.id !== id));
    // If we removed the current sprite, pick another or reset
    if (id === currentSpriteId) {
      const newSprites = sprites.filter((s) => s.id !== id);
      if (newSprites.length > 0) {
        setCurrentSpriteId(newSprites[0].id);
      } else {
        setCurrentSpriteId(0);
      }
    }
  };

  /**
   * Update a palette block's properties (e.g. move steps, turn degrees, etc.)
   */
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

  /**
   * Update a script block's properties for the current sprite
   */
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

  /**
   * When a sprite is dragged on the Stage, update its position
   */
  const updateSpritePosition = (spriteId, newPosition) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId ? { ...sprite, position: newPosition } : sprite
      )
    );
  };

  // Identify the current sprite object (if any)
  const currentSprite = sprites.find((s) => s.id === currentSpriteId);

  return (
    <div
      className="h-screen flex flex-col bg-blue-100 font-sans"
      onMouseMove={handleMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      {/* Top bar with only the "Play" button */}
      <div className="flex items-center justify-end px-4 py-2 border-b border-gray-300">
        <button
          onClick={play}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          Play
        </button>
      </div>

      {/* Main area: 3 columns filling remaining space */}
      <div className="flex-1 flex flex-row h-full">
        {/* 1) Left column: Palette */}
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

        {/* 2) Center column: Script Editor */}
        <MidArea
          containerName="script"
          blocks={currentSprite?.script || []}
          onStartDrag={startPotentialDrag}
          moveBlock={moveBlock}
          draggedBlock={draggedBlock}
          clearDrag={clearDrag}
          updateScriptBlock={updateScriptBlock}
          sprites={sprites}
          currentSpriteId={currentSpriteId}
          setCurrentSpriteId={setCurrentSpriteId}
          addSprite={addSprite}
          removeSprite={removeSprite}
        />

        {/* 3) Right column: Stage */}
        <PreviewArea
          sprites={sprites}
          updateSpritePosition={updateSpritePosition}
        />
      </div>

      {/* Drag preview */}
      {draggedBlock && (
        <div
          className="pointer-events-none fixed z-50 px-2 py-1 rounded text-white text-sm bg-blue-600"
          style={{ left: mousePos.x + 10, top: mousePos.y + 10 }}
        >
          {draggedBlock.label}
        </div>
      )}
    </div>
  );
}
