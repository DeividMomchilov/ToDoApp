import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useTodos(t) {
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setIsLoading(true);

      const response = await fetch("/api/ToDo");
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTaskList(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(t.loadError);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveTask() {
    const trimmedTask = task.trim();
    if (trimmedTask === "") return;

    try {
      if (editingTaskId !== null) {
        const currentTask = taskList.find((x) => x.id === editingTaskId);

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

        toast.success(t.updateSuccess);
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

        toast.success(t.addSuccess);
      }

      setTask("");
      await loadTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(t.saveError);
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`/api/ToDo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      toast.success(t.deleteSuccess);
      await loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(t.deleteError);
    }
  }

  function startEdit(taskItem) {
    setTask(taskItem.title);
    setEditingTaskId(taskItem.id);
  }

  async function moveTaskUp(id) {
    try {
      const response = await fetch(`/api/ToDo/${id}/move-up`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to move task up");
      }

      toast.success(t.moveSuccess);
      await loadTasks();
    } catch (error) {
      console.error("Error moving task up:", error);
      toast.error(t.moveError);
    }
  }

  async function moveTaskDown(id) {
    try {
      const response = await fetch(`/api/ToDo/${id}/move-down`, {
        method: "PUT",
      });

      if (!response.ok) {
        throw new Error("Failed to move task down");
      }

      toast.success(t.moveSuccess);
      await loadTasks();
    } catch (error) {
      console.error("Error moving task down:", error);
      toast.error(t.moveError);
    }
  }

  return {
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
  };
}