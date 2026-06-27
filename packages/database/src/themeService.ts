// Define the client theme settings structure
export interface ClientTheme {
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    // add any other fields you need (e.g., borderRadius, font)
  }
  
  // Generate a CSS string with CSS variables from the theme
  export const generateThemeCSS = (theme: ClientTheme): string => {
    return `
      :root {
        --primary: ${theme.primaryColor};
        --secondary: ${theme.secondaryColor};
        --accent: ${theme.accentColor};
        --background: ${theme.backgroundColor};
      }
    `;
  };