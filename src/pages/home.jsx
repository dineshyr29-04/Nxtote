import { useState, useEffect } from "react";
import { useAuth } from "../context/authprovider";
import { createNote, getNotes, updateNote, deleteNote } from "../api/notesapi";
import Toast from "../components/Toastnotification";
import { Plus, Trash2, Check, Search, Calendar, ListTodo, Activity, CheckCircle, Clock, AlertCircle } from "lucide-react";

function Home() {
    const { user } = useAuth();

    // State initialization
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [newTaskContent, setNewTaskContent] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Work");
    const [selectedPriority, setSelectedPriority] = useState("Medium");

    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [activities, setActivities] = useState(() => {
        const savedActivities = localStorage.getItem("single_user_activities");
        return savedActivities ? JSON.parse(savedActivities) : [];
    });

    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Sync activities to localStorage
    useEffect(() => {
        localStorage.setItem("single_user_activities", JSON.stringify(activities));
    }, [activities]);

    // Fetch notes from API on mount
    useEffect(() => {
        const fetchnotes = async () => {
            try {
                const response = await getNotes();
                // Extract tasks array from the backend's apiResponse wrapper (.data)
                const notesList = response.data || [];
                const formattedNotes = notesList.map((item) => ({
                    ...item,
                    text: item.title || "", // Map backend title to frontend text
                }));
                setTasks(formattedNotes);
            } catch (error) {
                console.error("Failed to load notes:", error);
                triggerToast("Failed to sync tasks from cloud.", "error");
            }
        };
        fetchnotes();
    }, []);

    // Greeting helper based on local time
    const getGreeting = () => {
        const hour = new Date().getHours();
        const displayName = user?.name || "Guest";
        if (hour < 12) return `Good morning, ${displayName} 🌅`;
        if (hour < 18) return `Good afternoon, ${displayName} ☀️`;
        if (hour < 21) return `Good evening, ${displayName} 🌌`;
        return `Hello, ${displayName} 🌙`;
    };

    const triggerToast = (message, type = "success") => {
        setToast({ show: true, message, type });
    };

    // Add Task Handler
    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskText.trim()) {
            triggerToast("Task title is required", "error");
            return;
        }

        const notePayload = {
            text: newTaskText.trim(),
            content: newTaskContent.trim(),
            category: selectedCategory,
            priority: selectedPriority,
            completed: false,
        };

        try {
            const response = await createNote(notePayload);
            // Extract the created note from backend's apiResponse wrapper (.data)
            if (response && response.data) {
                const formattedNewNote = {
                    ...response.data,
                    text: response.data.title || "", // Map backend title to frontend text
                };
                setTasks((prev) => [...prev, formattedNewNote]);
                setNewTaskText("");
                setNewTaskContent("");
                logActivity(`Created task: "${formattedNewNote.text}"`);
                triggerToast("Task added successfully! 🎉");
            }
        } catch (error) {
            console.error("Failed to add task:", error);
            triggerToast("Failed to create task.", "error");
        }
    };

    // Toggle Complete Handler
    const handleToggleComplete = async (id) => {
        const taskToToggle = tasks.find((task) => task.id === id);
        if (!taskToToggle) return;

        const newstatus = !taskToToggle.completed;
        try {
            await updateNote(id, { completed: newstatus });
            
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    logActivity(`${newstatus ? "Completed" : "Reopened"} task: "${task.text}"`);
                    triggerToast(newstatus ? "Task completed! 🎉" : "Task reopened");
                    return { ...task, completed: newstatus };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Failed to update status:", error);
            triggerToast("Failed to update task status.", "error");
        }
    };

    // Delete Task Handler
    const handleDeleteTask = async (id) => {
        try {
            const taskToDelete = tasks.find((task) => task.id === id);
            if (!taskToDelete) return;
            
            const isDeleted = await deleteNote(id);
            if (isDeleted) {
                setTasks((prev) => prev.filter((task) => task.id !== id));
                logActivity(`Deleted task: "${taskToDelete.text}"`);
                triggerToast("Task deleted.");
            }
        } catch (err) {
            console.error("Failed to delete task:", err);
            triggerToast("Failed to delete the task.", "error");
        }
    };

    // Activity Logger
    const logActivity = (message) => {
        const newActivity = {
            id: crypto.randomUUID(),
            message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setActivities((prev) => [newActivity, ...prev].slice(0, 10));
    };

    const clearAllActivities = () => {
        setActivities([]);
        localStorage.removeItem("single_user_activities");
        triggerToast("History cleared.");
    };

    // Filters and Analytics
    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "completed" && task.completed) ||
            (statusFilter === "pending" && !task.completed);

        const matchesCategory = categoryFilter === "all" || task.category === categoryFilter;

        const matchesSearch =
            (task.text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.category || "").toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesCategory && matchesSearch;
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionPercentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High":
                return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            case "Medium":
                return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "Low":
                return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            default:
                return "text-zinc-400 bg-zinc-500/10 border-zinc-500/20";
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Work":
                return "💼";
            case "Personal":
                return "🏠";
            case "Health":
                return "❤️";
            case "Finance":
                return "💵";
            default:
                return "📌";
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-[#0d1117] text-slate-100 font-sans antialiased overflow-hidden pb-16">
            {/* 🔮 Background Glow Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-violet-600/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-80 h-80 rounded-full bg-fuchsia-600/5 blur-[120px] pointer-events-none"></div>

            {/* Dashboard Header */}
            <header className="relative max-w-7xl mx-auto px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-800/60 z-10">
                <div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
                        {getGreeting()}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-400 mt-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span>
                            {new Date().toLocaleDateString(undefined, {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="flex gap-4">
                    <div className="bg-[#161b22]/70 border border-slate-800/80 px-5 py-3 rounded-2xl flex items-center gap-4 min-w-[190px] backdrop-blur-md">
                        <div className="w-10 h-10 rounded-full border-2 border-fuchsia-500/30 flex items-center justify-center text-xs font-black text-fuchsia-400">
                            {completionPercentage}%
                        </div>
                        <div>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                Progress Bar
                            </p>
                            <p className="text-base font-extrabold text-slate-100">
                                {completedTasks} / {totalTasks}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#161b22]/70 border border-slate-800/80 px-5 py-3 rounded-2xl flex flex-col justify-center min-w-[100px] backdrop-blur-md">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                            Pending Tasks
                        </p>
                        <p className="text-xl font-black text-rose-400 mt-0.5">{pendingTasks}</p>
                    </div>
                </div>
            </header>

            {/* Main Board Layout */}
            <div className="relative max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
                {/* Left Side Panel: Creation and Filters (Span 4) */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                    {/* Create Task Card */}
                    <div className="bg-[#161b22]/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl hover:border-slate-800 transition duration-300">
                        <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-fuchsia-400" />
                            <span>Create New Note</span>
                        </h2>
                        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                placeholder="Task Title..."
                                className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800/80 rounded-xl outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 text-xs text-slate-100 transition"
                            />
                            <textarea
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                placeholder="Details or additional notes..."
                                rows={2}
                                className="w-full px-4 py-3 bg-[#0d1117] border border-slate-800/80 rounded-xl outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 text-xs text-slate-100 transition resize-none"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 py-2 bg-[#0d1117] border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="Work">💼 Work</option>
                                        <option value="Personal">🏠 Personal</option>
                                        <option value="Health">❤️ Health</option>
                                        <option value="Finance">💵 Finance</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                                        Priority
                                    </label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="px-3 py-2 bg-[#0d1117] border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="Low">🟢 Low</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="High">🔴 High</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-95 text-white font-bold rounded-xl text-xs hover:scale-[1.01] active:scale-[0.99] transition duration-200 shadow-md shadow-fuchsia-500/10"
                            >
                                Add Note
                            </button>
                        </form>
                    </div>

                    {/* Search & Filters Card */}
                    <div className="bg-[#161b22]/50 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
                        <h2 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4 text-fuchsia-400" />
                            <span>Quick Filters</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes details..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-[#0d1117] border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 focus:border-fuchsia-500/50"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Status
                                </label>
                                <div className="flex gap-1 bg-[#0d1117] p-1 rounded-xl border border-slate-800/50">
                                    {["all", "pending", "completed"].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setStatusFilter(status)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                                                statusFilter === status
                                                    ? "bg-[#161b22] text-fuchsia-400 border border-slate-850"
                                                    : "text-slate-400 hover:text-slate-100"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-[#0d1117] border border-slate-800/80 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                >
                                    <option value="all">📁 All Categories</option>
                                    <option value="Work">💼 Work</option>
                                    <option value="Personal">🏠 Personal</option>
                                    <option value="Health">❤️ Health</option>
                                    <option value="Finance">💵 Finance</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Right Side Panel: Workspace board (Span 8) */}
                <main className="lg:col-span-8 flex flex-col gap-6">
                    {/* Tasks card list board */}
                    <div className="bg-[#161b22]/30 border border-slate-800/50 rounded-3xl p-6 min-h-[460px] backdrop-blur-sm flex flex-col">
                        <div className="flex items-center justify-between mb-6 border-b border-slate-800/60 pb-4">
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <ListTodo className="w-5 h-5 text-fuchsia-400" />
                                <span>Note Cards</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#161b22] border border-slate-800 text-slate-400">
                                    {filteredTasks.length}
                                </span>
                            </h2>
                        </div>

                        {/* Empty Board state */}
                        {filteredTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center my-auto py-16 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#161b22] border border-slate-800 flex items-center justify-center mb-4 text-xl">
                                    📭
                                </div>
                                <p className="text-slate-400 font-bold text-sm">No notes found</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    No outstanding notes match your active filters. Try adding one!
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {filteredTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`group flex items-start justify-between p-5 rounded-2xl border transition-all duration-200 ${
                                            task.completed
                                                ? "bg-[#161b22]/20 border-slate-900/40 text-slate-500 opacity-60"
                                                : "bg-[#161b22]/40 border-slate-800/80 hover:border-slate-800 text-slate-100 hover:bg-[#161b22]/60"
                                        }`}
                                    >
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Completed Checkbox */}
                                            <button
                                                onClick={() => handleToggleComplete(task.id)}
                                                className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition-all ${
                                                    task.completed
                                                        ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 border-transparent text-white"
                                                        : "border-slate-700 hover:border-fuchsia-400 bg-[#0d1117]"
                                                }`}
                                            >
                                                {task.completed && (
                                                    <Check className="w-3 h-3 stroke-[3]" />
                                                )}
                                            </button>

                                            {/* Note content */}
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm font-semibold truncate ${task.completed ? "line-through text-slate-500" : "text-slate-200"}`}
                                                >
                                                    {task.text}
                                                </p>
                                                {task.content && (
                                                    <p className={`text-xs text-slate-400 mt-1 leading-relaxed ${task.completed ? "line-through text-slate-600" : ""}`}>
                                                        {task.content}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-3 flex-wrap">
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {getCategoryIcon(task.category)} {task.category}
                                                    </span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                                                    <span
                                                        className={`text-[9px] px-2 py-0.5 rounded-md border font-extrabold uppercase ${getPriorityColor(task.priority)}`}
                                                    >
                                                        {task.priority}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action buttons (Shown on hover) */}
                                        <button
                                            onClick={() => handleDeleteTask(task.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition duration-150 ml-4 self-center"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Action History Feed */}
                    <section className="bg-[#161b22]/30 border border-slate-800/80 rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                            <h2 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-fuchsia-400" />
                                <span>Recent Logs</span>
                            </h2>
                            {activities.length > 0 && (
                                <button
                                    onClick={clearAllActivities}
                                    className="text-xs text-slate-500 hover:text-rose-450 transition font-semibold"
                                >
                                    Clear History
                                </button>
                            )}
                        </div>

                        {activities.length === 0 ? (
                            <p className="text-xs text-slate-500 italic py-1">No action records.</p>
                        ) : (
                            <ul className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                                {activities.map((act) => (
                                    <li
                                        key={act.id}
                                        className="flex justify-between items-center text-[11px] text-slate-400 py-1 border-b border-slate-800/40 last:border-0"
                                    >
                                        <span>{act.message}</span>
                                        <span className="text-[9px] text-slate-650 font-mono">
                                            {act.time}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                </main>
            </div>

            {/* Toast Alerts */}
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, show: false })}
                />
            )}
        </div>
    );
}

export default Home;
