import { useTodos } from "./hooks/useTodos";

export default function ToDoList({ t }) {
  const {
    taskList,
    task,
    setTask,
    editingTaskId,
    isLoading,
    saveTask,
    deleteTask,
    startEdit,
    moveTaskUp,
    moveTaskDown,
  } = useTodos(t);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="overflow-hidden rounded-[28px] border border-white/40 bg-white/75 shadow-2xl shadow-slate-300/30 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-black/30">
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 px-6 py-6 text-white dark:border-slate-800/80 sm:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">{t.appTitle}</h2>
          <p className="mt-2 text-sm text-blue-100">
            Organize, edit and reorder your daily tasks.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <input
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400"
              type="text"
              placeholder={t.placeholder}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveTask();
              }}
            />

            <button
              onClick={saveTask}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
            >
              {editingTaskId !== null ? t.edit : t.add}
            </button>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
              Loading...
            </div>
          ) : taskList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
              {t.empty}
            </div>
          ) : (
            <ul className="space-y-4">
              {taskList.map((taskItem, index) => (
                <li
                  key={taskItem.id}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:hover:border-slate-700 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <span className="block truncate text-base font-semibold text-slate-800 dark:text-slate-100">
                      {taskItem.title}
                    </span>
                    <span className="mt-1 block text-xs text-slate-400 dark:text-slate-500">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(taskItem)}
                      className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                      {t.edit}
                    </button>

                    <button
                      onClick={() => moveTaskUp(taskItem.id)}
                      disabled={index === 0}
                      className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.up}
                    </button>

                    <button
                      onClick={() => moveTaskDown(taskItem.id)}
                      disabled={index === taskList.length - 1}
                      className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {t.down}
                    </button>

                    <button
                      onClick={() => deleteTask(taskItem.id)}
                      className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                    >
                      {t.delete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}