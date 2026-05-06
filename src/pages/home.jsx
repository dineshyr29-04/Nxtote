import "./Home.css";
function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Task Manager</h1>

      {/* Input Section */}
      <div className="task-input-section">
        <input
          type="text"
          placeholder="Enter a task..."
          className="task-input"
        />
        <button className="add-btn">Add</button>
      </div>

      {/* Filter Section (for future use) */}
      <div className="filter-section">
        <button className="filter-btn active">All</button>
        <button className="filter-btn">Completed</button>
        <button className="filter-btn">Pending</button>
      </div>

      {/* Task List */}
      <ul className="task-list">
        <li className="task-item">
          <span className="task-text">Learn React</span>
          <div className="task-actions">
            <button className="complete-btn">✔</button>
            <button className="delete-btn">✖</button>
          </div>
        </li>

        <li className="task-item completed">
          <span className="task-text">Build Project</span>
          <div className="task-actions">
            <button className="complete-btn">✔</button>
            <button className="delete-btn">✖</button>
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Home;
