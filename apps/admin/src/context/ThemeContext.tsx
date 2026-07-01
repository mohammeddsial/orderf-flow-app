import React, { createContext, useContext, ReactNode } from 'react';

// Static Figma theme (no dynamic injection)
const figmaTheme = {
  primaryColor: '#FF6B35',
  secondaryColor: '#1E2D4A',
  accentColor: '#E84545',
  backgroundColor: '#F4F6F9',
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