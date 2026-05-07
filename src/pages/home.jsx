import { useState } from "react";
import "./Home.css";
function Home() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [taskcom,settaskcom]=useState([]);
  const handleAddTask = () => {
    if (value.trim() === "") return;

    const newtasks = {
      id: Date.now(),
      text: value,
      completed: false,
    };

    setTasks([...tasks, newtasks]);
    setValue("");
  };

  const handleDeleteTask = (id) => {
    const newtask = tasks.filter((task) => task.id != id);
    setTasks(newtask);
  };
  const handleToggleComplete = (id) => {
    const updatedtasks = tasks.map((task) => {
      if (task.id == id) {
        settaskcom([task])
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });

    setTasks(updatedtasks);
  };
  const handleSortCompleted=()=>{
    
    const completedtask=tasks.filter((task)=>(
      task => task.completed
    ))
  }
  return (
    <div className="home-container">
      <h1 className="home-title">Task Manager</h1>

      {/* Input Section */}
      <div className="task-input-section">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a task..."
          className="task-input"
        />
        <button className="add-btn" onClick={handleAddTask}>
          Add
        </button>
      </div>

      {/* Filter Section (for future use) */}
      <div className="filter-section">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Completed</button>
        <button className="filter-btn">Pending</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {tasks.map((task) => {
          return (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed" : ""}`}
            >
              <span className="task-text">{task.text}</span>
              <div className="task-actions">
                <button
                  className="complete-btn"
                  onClick={() => handleToggleComplete(task.id)}
                >
                  ✔
                </button>

                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  ✖
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Home;
