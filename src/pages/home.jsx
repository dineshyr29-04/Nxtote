import { useState } from "react";
import "./Home.css";
function Home() {
  const [tasks, setTasks] = useState([]);
  const [value, setValue] = useState("");
  const [filter, setfilter] = useState("all");

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
        settaskcom([task]);
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });

    setTasks(updatedtasks);
  };
  const filterTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }
    if (filter === "pending") {
      return !task.completed;
    }
    return true;
  });
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
        <button className={`filter-btn ${filter==="all" ? "active" : ""}`} onClick={useState("all")}>
          All
        </button>
        <button className={`filter-btn ${filter==="completed" ?"active" :""}`} onClick={useState("completed")}>
          Completed
        </button>
        <button className={`filter-btn ${filter==="pending" ?"active" :""}`}onClick={useState("pending")}>
          Pending
        </button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        {filterTasks.map((task) => {
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






import { useState } from "react";
import "./Home.css";

function Home() {

  // =========================
  // STATES
  // =========================

  // Stores all tasks
  const [tasks, setTasks] = useState([]);

  // Stores input field value
  const [value, setValue] = useState("");

  // Stores current filter
  // possible values:
  // "all", "completed", "pending"
  const [filter, setFilter] = useState("all");



  // =========================
  // ADD TASK
  // =========================

  const handleAddTask = () => {

    // Prevent empty tasks
    if (value.trim() === "") return;

    // Create new task object
    const newTask = {
      id: Date.now(),
      text: value,
      completed: false,
    };

    // Add task to tasks array
    setTasks([...tasks, newTask]);

    // Clear input field
    setValue("");
  };



  // =========================
  // DELETE TASK
  // =========================

  const handleDeleteTask = (id) => {

    // Keep all tasks except clicked one
    const updatedTasks = tasks.filter(
      (task) => task.id !== id
    );

    setTasks(updatedTasks);
  };



  // =========================
  // TOGGLE COMPLETE
  // =========================

  const handleToggleComplete = (id) => {

    const updatedTasks = tasks.map((task) => {

      // If clicked task found
      if (task.id === id) {

        // Toggle completed value
        return {
          ...task,
          completed: !task.completed,
        };
      }

      return task;
    });

    setTasks(updatedTasks);
  };



  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks = tasks.filter((task) => {

    // Show only completed
    if (filter === "completed") {
      return task.completed;
    }

    // Show only pending
    if (filter === "pending") {
      return !task.completed;
    }

    // Show all
    return true;
  });



  // =========================
  // UI
  // =========================

  return (
    <div className="home-container">

      <h1 className="home-title">
        Task Manager
      </h1>



      {/* =========================
          INPUT SECTION
      ========================= */}

      <div className="task-input-section">

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter a task..."
          className="task-input"
        />

        <button
          className="add-btn"
          onClick={handleAddTask}
        >
          Add
        </button>

      </div>



      {/* =========================
          FILTER BUTTONS
      ========================= */}

      <div className="filter-section">

        <button
          className={`filter-btn ${
            filter === "all" ? "active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`filter-btn ${
            filter === "completed" ? "active" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button
          className={`filter-btn ${
            filter === "pending" ? "active" : ""
          }`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>

      </div>



      {/* =========================
          TASK LIST
      ========================= */}

      <ul className="task-list">

        {filteredTasks.map((task) => (

          <li
            key={task.id}
            className={`task-item ${
              task.completed ? "completed" : ""
            }`}
          >

            {/* Task Text */}
            <span className="task-text">
              {task.text}
            </span>



            {/* Action Buttons */}
            <div className="task-actions">

              <button
                className="complete-btn"
                onClick={() =>
                  handleToggleComplete(task.id)
                }
              >
                ✔
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDeleteTask(task.id)
                }
              >
                ✖
              </button>

            </div>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default Home;