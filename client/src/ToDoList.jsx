import { useState } from "react";

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
export default function ToDoList({language = "en"}) {
    const t = translations[language];
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState("");

    const handleAddTask = () =>{
        if(task.trim() !== ""){
            setTaskList(state => [...state,task]);
            setTask("");
        }
    }

    const handleDeleteTask = (index) =>{
        setTaskList(taskList.filter((_, i) => i !== index));
    }

    const handleEditTask = (index,task) => {
        setTaskList(taskList.filter((_, i) => i !== index));
        setTask(task);
    }

    function handleMoveTaskUp(index){
        if(index > 0){
            const updatedTasks = [...taskList];
            [updatedTasks[index], updatedTasks[index - 1]] = 
            [updatedTasks[index - 1], updatedTasks[index]];
            setTaskList(updatedTasks);
        }
    }

    function handleMoveTaskDown(index){
        if(index < taskList.length - 1){
            const updatedTasks = [...taskList];
            [updatedTasks[index], updatedTasks[index + 1]] = 
            [updatedTasks[index + 1], updatedTasks[index]];
            setTaskList(updatedTasks);
        }
    }


    return (      
        <div className="todo-app">
            <h1 className="todo-title">{t.title}</h1>
            <div className="todo-input-group">
                <input className="todo-input" 
                       type="text" 
                       placeholder={t.placeholder}
                       value={task}
                       onChange={(e) => setTask(e.target.value)}
                       onKeyDown={e => { if (e.key === 'Enter') handleAddTask(); }}/>
                <button className="todo-add-btn" 
                        onClick={handleAddTask}>{t.add}
                </button>
            </div>
            <ul className="todo-list">
                {taskList.map((task,index) => (
                    <li className="todo-item" key={index}>
                    <span className="todo-text">{task}</span>
                    <div className="todo-actions">
                        <button className="todo-edit-btn" onClick={() => handleEditTask(index,task)}>{t.edit}</button>
                        <button className="todo-move-up-btn" onClick={() => handleMoveTaskUp(index)}  disabled={index === 0}>▲</button>
                        <button className="todo-move-down-btn" onClick={() => handleMoveTaskDown(index)} disabled={index === taskList.length - 1}>▼</button>
                        <button className="todo-delete-btn" onClick={() => handleDeleteTask(index)}>🗑</button>
                    </div>
                </li>
                ))}               
            </ul>
        </div>
    );
}