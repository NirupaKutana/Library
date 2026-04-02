import { useContext } from "react";
import { ThemeContext } from "../Context/ThemeProvider"

const Theme: React.FC  = () => {
     const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeToggle must be used inside ThemeProvider");
  }

  const { theme, toggleTheme }:any = context;
  return (
    
       <button onClick={toggleTheme} className="theme-btn">
       {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
   
  )
}

export default Theme
