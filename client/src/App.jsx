import { useEffect, useMemo, useState } from "react";
import { Toaster } from "sonner";
import ToDoList from "./ToDoList";
import { translations } from "./data/translations";

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  const t = useMemo(() => translations[language], [language]);
  const isDark = theme === "dark";

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("language", language);
  }, [theme, language]);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Task Manager
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {t.appTitle}
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setLanguage((prev) => (prev === "en" ? "bg" : "en"))}
                className="rounded-2xl border border-white/50 bg-white/70 px-4 py-2 text-sm font-medium shadow-lg shadow-slate-200/40 backdrop-blur transition hover:scale-[1.02] hover:bg-white dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-black/20 dark:hover:bg-slate-800"
              >
                {t.switchLanguage}
              </button>

              <button
                onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
                className="rounded-2xl border border-white/50 bg-white/70 px-4 py-2 text-sm font-medium shadow-lg shadow-slate-200/40 backdrop-blur transition hover:scale-[1.02] hover:bg-white dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-black/20 dark:hover:bg-slate-800"
              >
                {isDark ? t.themeLight : t.themeDark}
              </button>
            </div>
          </div>

          <ToDoList t={t} />
        </div>

        <Toaster richColors position="top-right" />
      </div>
    </div>
  );
}