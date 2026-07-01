import React, { createContext, useContext, ReactNode } from 'react';

// Static Figma theme (no dynamic injection)
const figmaTheme = {
  primaryColor: '#b81969',
  secondaryColor: '#4a0929',
  accentColor: '#f6c0db',
  backgroundColor: '#f5f5f5',
  logoUrl: 'https://via.placeholder.com/150?text=Logo',
};

const ThemeContext = createContext(figmaTheme);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ThemeContext.Provider value={figmaTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);