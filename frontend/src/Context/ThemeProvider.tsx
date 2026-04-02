import React, { createContext, ReactNode, useEffect, useState } from "react";
type Theme = "light" | "dark";
interface ThemeContextType{
    theme :Theme;
    toggleTheme :()=>void;
}
export const ThemeContext = createContext<ThemeContextType |unknown>(undefined);
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }:ThemeProviderProps) => {

  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "light"
  );

  // Apply theme to body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};