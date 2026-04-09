import { useState, useEffect } from "react";

const translations = {
  en: {
    title: "ToDo List",
    placeholder: "Add a new task...",
    add: "Add",
    edit: "Edit",
    up: "▲",
    down: "▼",
    delete: "🗑",
  },
  bg: {
    title: "Списък със задачи",
    placeholder: "Добави нова задача...",
    add: "Добави",
    edit: "Редактирай",
    up: "▲",
    down: "▼",
    delete: "🗑",
  }
};

export default function ToDoList({ language = "en" }) {
  const t = translations[language];
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const response = await fetch("/api/ToDo");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTaskList(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function handleAddTask() {
    const trimmedTask = task.trim();
    if (trimmedTask === "") return;

    try {
      if (editingTaskId !== null) {
        const currentTask = taskList.find(t => t.id === editingTaskId);

        const response = await fetch(`/api/ToDo/${editingTaskId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTask,
            isCompleted: currentTask?.isCompleted ?? false,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        setEditingTaskId(null);
      } else {
        const response = await fetch("/api/ToDo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: trimmedTask,
            isCompleted: false,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add task");
        }
      }

      setTask("");
      await loadTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }

  async function handleDeleteTask(id) {
    try {
      const response = await fetch(`/api/ToDo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  function handleEditTask(taskItem) {
    setTask(taskItem.title);
    setEditingTaskId(taskItem.id);
  }

  async function handleMoveTaskUp(id) {
    try {
      const response = await fetch(`/api/ToDo/${id}/move-up`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to move task up");
      }

      await loadTasks();
    } catch (error) {
      console.error("Error moving task up:", error);
    }
  }

  async function handleMoveTaskDown(id) {
    try {
      const response = await fetch(`/api/ToDo/${id}/move-down`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to move task down");
      }

      await loadTasks();
    } catch (error) {
      console.error("Error moving task down:", error);
    }
  }

  return (
    <div className="todo-app">
      <h1 className="todo-title">{t.title}</h1>

      <div className="todo-input-group">
        <input
          className="todo-input"
          type="text"
          placeholder={t.placeholder}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
          }}
        />

        <button className="todo-add-btn" onClick={handleAddTask}>
          {editingTaskId !== null ? t.edit : t.add}
        </button>
      </div>

      <ul className="todo-list">
        {taskList.map((taskItem, index) => (
          <li className="todo-item" key={taskItem.id}>
            <span className="todo-text">{taskItem.title}</span>

            <div className="todo-actions">
              <button
                className="todo-edit-btn"
                onClick={() => handleEditTask(taskItem)}
              >
                {t.edit}
              </button>

              <button
                className="todo-move-up-btn"
                onClick={() => handleMoveTaskUp(taskItem.id)}
                disabled={index === 0}
              >
                {t.up}
              </button>

              <button
                className="todo-move-down-btn"
                onClick={() => handleMoveTaskDown(taskItem.id)}
                disabled={index === taskList.length - 1}
              >
                {t.down}
              </button>

              <button
                className="todo-delete-btn"
                onClick={() => handleDeleteTask(taskItem.id)}
              >
                {t.delete}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}