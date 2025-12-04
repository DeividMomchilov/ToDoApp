import {useState } from "react";
import ToDoList from "./ToDoList";

const translations = {
  en: {
    switchTheme: "Switch to ",
    dark: "Dark",
    light: "Light",
    switchLang: "EN",
  },
  bg: {
    switchTheme: "Превключи към ",
    dark: "Тъмен",
    light: "Светъл",
    switchLang: "БГ",
  }
}

export default function App() {
  const [theme,setTheme] = useState("light");
  const [language,setLanguage] = useState("en");
  const t = translations[language];

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const toggleLanguage = () => setLanguage ((l) => (l === "en" ? "bg" : "en"))

  return ( 
    <div className={theme + "-mode" + (language === 'bg' ? ' bg-lang' : '')}>
      <div style={{ position: 'relative' }}>
        <button className="language-toggle-btn" onClick={toggleLanguage} >
          {language === "en" ? "БГ" : "EN"}
        </button>
        <button className="theme-toggle-btn" onClick={toggleTheme} >
          {t.switchTheme} {theme === "light" ? t.dark : t.light} {language === "en" ? "Mode" : "Режим"}
        </button>
        <ToDoList language={language} />
      </div>
    </div>
  )
}