'use client';

import React, { createContext, useState, useContext } from 'react';

interface ColorContextType {
  color: string;
  setColor: (color: string) => void;
}

const ColorContext = createContext<ColorContextType>({
  color: '#4F46E5',
  setColor: () => {},
});

export const ColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState('#4F46E5');

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColor = () => {
  return useContext(ColorContext);
};