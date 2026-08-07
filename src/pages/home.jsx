import { useState, useEffect } from "react";

function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedtask = localStorage.getItem("single_user_tasks");
    return savedtask ? JSON.parse(savedtask) : [];
  });
  const [newTaskText, setNewTaskText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Work");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activities, setActivities] = useState(() => {
    const savedActivities = localStorage.getItem("single_user_activities");
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("single_user_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("single_user_activities", JSON.stringify(activities));
  }, [activities]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      category: selectedCategory,
      priority: selectedPriority,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTasks([newTask, ...tasks]);
    logActivity(`Added task: "${newTask.text}" (${selectedCategory})`);
    setNewTaskText("");
  };

  const handleToggleComplete = (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const newStatus = !task.completed;
        logActivity(`${newStatus ? "Completed" : "Reopened"} task: "${task.text}"`);
        return { ...task, completed: newStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) return;

    setTasks(tasks.filter((task) => task.id !== id));
    logActivity(`Deleted task: "${taskToDelete.text}"`);
  };

  const logActivity = (message) => {
    const newActivity = {
      id: crypto.randomUUID(),
      message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 15)); // Keep last 15 actions
  };

  const clearAllActivities = () => {
    setActivities([]);
    localStorage.removeItem("single_user_activities");
  };

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && task.completed) ||
      (statusFilter === "pending" && !task.completed);

    const matchesCategory =
      categoryFilter === "all" || task.category === categoryFilter;

    const matchesSearch =
      task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "Medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Work": return "💼";
      case "Personal": return "🏠";
      case "Health": return "❤️";
      case "Finance": return "💵";
      default: return "📌";
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
      {/* Upper Dashboard Header Section */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 border-b border-slate-900">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
            My Workspace ⚡
          </h1>
          <p className="text-slate-400 mt-1">Focus on what matters most today.</p>
        </div>

        {/* Stats Panel */}
        <div className="flex gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 px-6 py-4 rounded-2xl flex items-center gap-4 min-w-4/5">
            <div className="w-12 h-12 rounded-full border-2 border-fuchsia-500/30 flex items-center justify-center text-lg font-bold text-fuchsia-400">
              {completionPercentage}%
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">COMPLETED</p>
              <p className="text-xl font-bold text-slate-100">{completedTasks} / {totalTasks}</p>
            </div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 px-6 py-4 rounded-2xl flex flex-col justify-center min-w-30">
            <p className="text-xs text-slate-400 font-medium">PENDING</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{pendingTasks}</p>
          </div>
        </div>
      </header>

      {/* Main Board Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Panel: Task Creator & Filters (Span 4) */}
        <aside className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 1. Add Task Panel */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <span>✍️</span> Create Task
            </h2>
            <form onSubmit={handleAddTask} className="flex flex-col gap-4">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800/80 rounded-xl outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/30 text-sm transition"
              />

              <div className="grid grid-cols-2 gap-3">
                {/* Category select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer focus:border-fuchsia-500/50"
                  >
                    <option value="Work">💼 Work</option>
                    <option value="Personal">🏠 Personal</option>
                    <option value="Health">❤️ Health</option>
                    <option value="Finance">💵 Finance</option>
                  </select>
                </div>

                {/* Priority select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Priority</label>
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer focus:border-fuchsia-500/50"
                  >
                    <option value="Low">🟢 Low</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="High">🔴 High</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-xl text-sm hover:opacity-90 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-fuchsia-500/10"
              >
                Add to List
              </button>
            </form>
          </div>

          {/* 2. Filters & Search Panel */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 backdrop-blur-xl flex flex-col gap-5">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <span>🔍</span> Filters & Search
            </h2>

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search task or category..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs focus:border-fuchsia-500/50"
            />

            {/* Status Filter buttons */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Status</label>
              <div className="flex gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800/80">
                {["all", "pending", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                      statusFilter === status
                        ? "bg-slate-900 text-fuchsia-400 border border-slate-800"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Filter Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
              >
                <option value="all">📁 All Categories</option>
                <option value="Work">💼 Work</option>
                <option value="Personal">🏠 Personal</option>
                <option value="Health">❤️ Health</option>
                <option value="Finance">💵 Finance</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Right Section: Task Board & Logs (Span 8) */}
        <main className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Tasks Container */}
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 min-h-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
                <span>📋</span> Tasks List
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
                  {filteredTasks.length}
                </span>
              </h2>
            </div>

            {/* Tasks list */}
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-4xl mb-3">🍃</span>
                <p className="text-slate-400 font-medium">No tasks found matching filters.</p>
                <p className="text-xs text-slate-500 mt-1">Start by creating a new task or clearing search.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {filteredTasks.map((task) => (
                  <li
                    key={task.id}
                    className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 ${
                      task.completed
                        ? "bg-slate-950/40 border-slate-900 text-slate-500 opacity-60"
                        : "bg-slate-900/40 border-slate-850 hover:border-slate-800 text-slate-100 hover:bg-slate-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleComplete(task.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                          task.completed
                            ? "bg-linear-to-r from-violet-500 to-fuchsia-500 border-transparent text-white"
                            : "border-slate-700 hover:border-fuchsia-400"
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${task.completed ? "line-through" : ""}`}>
                          {task.text}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            {getCategoryIcon(task.category)} {task.category}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold tracking-wider uppercase ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span className="text-[10px] text-slate-500">
                            ⏱️ {task.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Activity Feed History */}
          <section className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>⚡</span> Action History
              </h2>
              {activities.length > 0 && (
                <button
                  onClick={clearAllActivities}
                  className="text-xs text-slate-400 hover:text-rose-400 font-medium transition"
                >
                  Clear history
                </button>
              )}
            </div>

            {activities.length === 0 ? (
              <p className="text-sm text-slate-500 italic py-4">No recent activity logs.</p>
            ) : (
              <ul className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {activities.map((act) => (
                  <li
                    key={act.id}
                    className="flex justify-between items-center text-xs text-slate-400 py-1 border-b border-slate-900/50 last:border-0"
                  >
                    <span>{act.message}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Home;
