import React, { createContext, useContext, useState } from "react";

const CommandContext = createContext();

export function useCommand() {
  return useContext(CommandContext);
}

export function CommandProvider({ children }) {
  const [commands, setCommands] = useState([]);

  const addCommand = (command) => {
    setCommands((prev) => [...prev, command]);
  };

  const clearCommands = () => {
    setCommands([]);
  };

  return (
    <CommandContext.Provider value={{ commands, addCommand, clearCommands }}>
      {children}
    </CommandContext.Provider>
  );
}
