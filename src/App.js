import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

/**
 * Helper delay function for pausing between commands
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function App() {
  // Palette now stores separate arrays for each category
  const [isPlaying, setIsPlaying] = useState(false);
  const [palettes, setPalettes] = useState({
    motion: [
      { id: 1, type: "move", label: "Move 10 steps", value: 10 },
      { id: 2, type: "turn", label: "Turn 15°", value: 15 },
      { id: 3, type: "goto", label: "Go to x:0 y:0", x: 0, y: 0 },
      {
        id: 4,
        type: "repeat",
        label: "Repeat 2 times",
        times: 2,
        commands: [],
      },
    ],
    looks: [
      { id: 101, type: "say", label: 'Say "Hello!"', text: "Hello!" },
      { id: 102, type: "think", label: 'Think "Hmm..."', text: "Hmm..." },
      { id: 103, type: "show", label: "Show" },
      { id: 104, type: "hide", label: "Hide" },
    ],
    events: [
      { id: 201, type: "whenClicked", label: "When clicked" },
      { id: 202, type: "whenFlagClicked", label: "When flag clicked" },
    ],
    controls: [
      { id: 301, type: "wait", label: "Wait 1 sec", time: 1 },
      { id: 302, type: "forever", label: "Forever", commands: [] },
    ],
  });
  // Current active palette category – default is motion.
  const [currentPalette, setCurrentPalette] = useState("motion");

  const paletteBgColors = {
    motion: "bg-blue-500",
    looks: "bg-purple-500",
    events: "bg-yellow-500",
    controls: "bg-red-300",
  };

  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Sprite 1",
      script: [],
      position: { x: 50, y: 50 },
      rotation: 0,
      isVisible: true,
    },
  ]);
  const [currentSpriteId, setCurrentSpriteId] = useState(1);

  // Drag state for blocks
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [potentialDrag, setPotentialDrag] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /**
   * Generates a new label for a block when its values change,
   * handling new types such as say, think, wait, etc.
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
    } else if (block.type === "say") {
      return `Say "${block.text}"`;
    } else if (block.type === "think") {
      return `Think "${block.text}"`;
    } else if (block.type === "whenClicked") {
      return "When clicked";
    } else if (block.type === "whenFlagClicked") {
      return "When flag clicked";
    } else if (block.type === "wait") {
      return `Wait ${block.time} sec`;
    } else if (block.type === "forever") {
      return "Forever";
    } else if (block.type === "hide") {
      return "Hide";
    } else if (block.type === "show") {
      return "Show";
    }
    return block.label;
  }

  /**
   * Mouse move handler to support dragging
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
   * Global mouse up to cancel drag states
   */
  const handleGlobalMouseUp = () => {
    setPotentialDrag(null);
    setDraggedBlock(null);
  };

  /**
   * Start a potential drag on a block
   */
  const startPotentialDrag = (block) => {
    setPotentialDrag({ block, startPos: mousePos });
  };

  // For bounding circle collision, define sprite dimensions
  const SPRITE_RADIUS = 50;
  const SPRITE_WIDTH = 95;
  const SPRITE_HEIGHT = 100;

  const checkAndSwapCollisions = () => {
    setSprites((prevSprites) => {
      const updated = [...prevSprites];
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const s1 = updated[i];
          const s2 = updated[j];
          // Compute center of sprite 1
          const s1CenterX = s1.position.x + SPRITE_WIDTH / 2;
          const s1CenterY = s1.position.y + SPRITE_HEIGHT / 2;
          // Compute center of sprite 2
          const s2CenterX = s2.position.x + SPRITE_WIDTH / 2;
          const s2CenterY = s2.position.y + SPRITE_HEIGHT / 2;
          // Distance between centers
          const dx = s1CenterX - s2CenterX;
          const dy = s1CenterY - s2CenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          // If distance <= sum of radii, collision occurs
          if (distance <= SPRITE_RADIUS * 2) {
            console.log(
              `Collision detected between ${s1.name} and ${s2.name}. Swapping scripts.`
            );
            const tempScript = s1.script;
            updated[i] = { ...s1, script: s2.script };
            updated[j] = { ...s2, script: tempScript };
          }
        }
      }
      return updated;
    });
  };

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
        continue;
      } else if (cmd.type === "wait") {
        await delay(Number(cmd.time || 1) * 1000);
      } else if (cmd.type === "say" || cmd.type === "think") {
        // Show the look text for 2 seconds
        setSprites((prev) =>
          prev.map((s) =>
            s.id === spriteId ? { ...s, lookText: cmd.text } : s
          )
        );
        await delay(2000);
        setSprites((prev) =>
          prev.map((s) => (s.id === spriteId ? { ...s, lookText: "" } : s))
        );
        continue;
      } else if (cmd.type === "show") {
        setSprites((prev) =>
          prev.map((s) => (s.id === spriteId ? { ...s, isVisible: true } : s))
        );
        await delay(500);
      } else if (cmd.type === "hide") {
        setSprites((prev) =>
          prev.map((s) => (s.id === spriteId ? { ...s, isVisible: false } : s))
        );
        await delay(500);
      }
      // Update sprite’s position and rotation
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
      await delay(500);
      checkAndSwapCollisions();
    }
    return state;
  };

  /**
   * Play the current sprite’s script
   */
  const play = async () => {
    setIsPlaying(true);
    const currentSprite = sprites.find((s) => s.id === currentSpriteId);
    if (!currentSprite) {
      setIsPlaying(false);
      return;
    }
    const initialState = {
      ...currentSprite.position,
      rotation: currentSprite.rotation,
    };
    await runSpriteCommands(
      currentSpriteId,
      currentSprite.script,
      initialState
    );
    setIsPlaying(false);
  };

  /**
   * Update the current sprite’s script
   */
  const updateCurrentSpriteScript = (newScript) => {
    setSprites((prev) =>
      prev.map((s) =>
        s.id === currentSpriteId ? { ...s, script: newScript } : s
      )
    );
  };

  /**
   * Move a block between palette and script
   */
  const moveBlock = (block, target) => {
    if (block.source === target) return;
    const currentSprite = sprites.find((s) => s.id === currentSpriteId);
    if (!currentSprite) return;

    // From palette to script: attach bgColor from currentPalette mapping
    if (block.source === "palette" && target === "script") {
      updateCurrentSpriteScript([
        ...currentSprite.script,
        {
          ...block,
          source: "script",
          id: Date.now(),
          bgColor: paletteBgColors[currentPalette], // Add the bgColor here
        },
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
   * Clear drag states
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
        isVisible: true,
      },
    ]);
    setCurrentSpriteId(newId);
  };

  /**
   * Remove an existing sprite
   */
  const removeSprite = (id) => {
    setSprites((prev) => prev.filter((s) => s.id !== id));
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
   * Update a palette block’s properties.
   * Note: We update the palette for the current category.
   */
  function handlePaletteChange(blockId, field, value) {
    setPalettes((prev) => ({
      ...prev,
      [currentPalette]: prev[currentPalette].map((b) =>
        b.id === blockId
          ? {
              ...b,
              [field]: value,
              label: generateLabel({ ...b, [field]: value }),
            }
          : b
      ),
    }));
  }

  /**
   * Update a script block’s properties for the current sprite.
   */
  const updateScriptBlock = (blockId, field, value) => {
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
  };

  /**
   * Update a sprite’s position when dragged on the Stage.
   */
  const updateSpritePosition = (spriteId, newPosition) => {
    setSprites((prev) =>
      prev.map((sprite) =>
        sprite.id === spriteId ? { ...sprite, position: newPosition } : sprite
      )
    );
  };

  const currentSprite = sprites.find((s) => s.id === currentSpriteId);

  return (
    <div
      className="h-screen flex flex-col bg-blue-100 font-sans"
      onMouseMove={handleMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      <div className="flex items-center justify-end px-4 py-2 border-b border-gray-300">
        <button
          onClick={play}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          Play
        </button>
      </div>
      <div className="flex-1 flex flex-row h-full">
        <Sidebar
          containerName="palette"
          blocks={palettes[currentPalette]}
          setPalette={setPalettes}
          onStartDrag={startPotentialDrag}
          moveBlock={moveBlock}
          draggedBlock={draggedBlock}
          clearDrag={clearDrag}
          handleChange={handlePaletteChange}
          currentPalette={currentPalette}
          setCurrentPalette={setCurrentPalette}
        />
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
        <PreviewArea
          sprites={sprites}
          updateSpritePosition={updateSpritePosition}
          isPlaying={isPlaying}
        />
      </div>
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
