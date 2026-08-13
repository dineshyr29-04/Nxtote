import { useState, useEffect } from "react";
import { useAuth } from "../context/authprovider";
import { createNote, getNotes, updateNote, deleteNote } from "../api/notesapi";
import Toast from "../components/Toastnotification";
import { Plus, Trash2, Check, Search, Calendar, ListTodo, Activity, Pencil, X } from "lucide-react";

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

    // Editing states
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTaskText, setEditTaskText] = useState("");
    const [editTaskContent, setEditTaskContent] = useState("");

    const [activities, setActivities] = useState(() => {
        const savedActivities = localStorage.getItem("single_user_activities");
        return savedActivities ? JSON.parse(savedActivities) : [];
    });

    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Sync activities to localStorage
    useEffect(() => {
        localStorage.setItem("single_user_activities", JSON.stringify(activities));
    }, [activities]);

    // Fetch notes on mount
    useEffect(() => {
        const fetchnotes = async () => {
            try {
                const response = await getNotes();
                const notesList = response.data || [];
                const formattedNotes = notesList.map((item) => ({
                    ...item,
                    text: item.title || "",
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
            if (response && response.data) {
                const formattedNewNote = {
                    ...response.data,
                    text: response.data.title || "",
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

    // Edit Content Handler (UI logic only as requested)
    const handleeditcontent = async (id, updatedText, updatedContent) => {
        if (!updatedText.trim()) {
            triggerToast("Task title cannot be empty", "error");
            return;
        }

        try {
            const response = await updateNote(id, updatedContent.trim(),updatedText.trim());
            const

            // Update state locally for visual proof & testing
            const updatedTasks = tasks.map((task) => {
                if (task.id === id) {
                    logActivity(`Edited task: "${task.text}" ➔ "${updatedText.trim()}"`);
                    return {
                        ...task,
                        text: updatedText.trim(),
                        content: updatedContent.trim()
                    };
                }
                return task;
            });

            setTasks(updatedTasks);
            setEditingTaskId(null); // Exit edit mode
            triggerToast("Task updated successfully!");
        } catch (error) {
            console.error("Failed to edit task:", error);
            triggerToast("Failed to update task details.", "error");
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
                return "text-rose-300 bg-rose-500/10 border-rose-500/25";
            case "Medium":
                return "text-amber-300 bg-amber-500/10 border-amber-500/25";
            case "Low":
                return "text-emerald-300 bg-emerald-500/10 border-emerald-500/25";
            default:
                return "text-slate-300 bg-slate-500/10 border-slate-500/25";
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

    const getCategoryBadgeClass = (category) => {
        switch (category) {
            case "Work":
                return "text-blue-300 bg-blue-500/10 border-blue-500/25";
            case "Personal":
                return "text-indigo-300 bg-indigo-500/10 border-indigo-500/25";
            case "Health":
                return "text-pink-300 bg-pink-500/10 border-pink-500/25";
            case "Finance":
                return "text-emerald-300 bg-emerald-500/10 border-emerald-500/25";
            default:
                return "text-slate-300 bg-slate-500/10 border-slate-500/25";
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-950 via-[#0a0d18] to-[#02050f] text-slate-100 font-sans antialiased overflow-hidden pb-16">

            {/* 🔮 Glow Accents */}
            <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] left-[-15%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute top-[40%] right-[30%] w-[350px] h-[350px] rounded-full bg-violet-600/5 blur-[150px] pointer-events-none"></div>

            {/* Dashboard Header */}
            <header className="relative max-w-7xl mx-auto px-6 pt-10 pb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-indigo-500/10 z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                        {getGreeting()}
                    </h1>
                    <div className="flex items-center gap-2 text-indigo-300/60 mt-2 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
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
                    <div className="bg-[#101424]/40 border border-white/5 shadow-xl px-5 py-3 rounded-2xl flex items-center gap-4 min-w-[190px] backdrop-blur-xl">
                        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
                            {completionPercentage}%
                        </div>
                        <div>
                            <p className="text-[9px] text-indigo-300/50 font-bold uppercase tracking-wider">
                                Progress Bar
                            </p>
                            <p className="text-base font-extrabold text-slate-100">
                                {completedTasks} / {totalTasks}
                            </p>
                        </div>
                    </div>
                    <div className="bg-[#101424]/40 border border-white/5 shadow-xl px-5 py-3 rounded-2xl flex flex-col justify-center min-w-[100px] backdrop-blur-xl">
                        <p className="text-[9px] text-indigo-300/50 font-bold uppercase tracking-wider">
                            Pending Tasks
                        </p>
                        <p className="text-xl font-bold text-indigo-300 mt-0.5">{pendingTasks}</p>
                    </div>
                </div>
            </header>

            {/* Main Board Layout */}
            <div className="relative max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
                {/* Left Side Panel: Creation and Filters (Span 4) */}
                <aside className="lg:col-span-4 flex flex-col gap-6">
                    {/* Create Task Card */}
                    <div className="bg-[#101424]/30 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-3xl p-6 backdrop-blur-xl hover:border-indigo-500/20 transition duration-300">
                        <h2 className="text-sm font-bold text-indigo-200 mb-4 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-indigo-400" />
                            <span>Create New Note</span>
                        </h2>
                        <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={newTaskText}
                                onChange={(e) => setNewTaskText(e.target.value)}
                                placeholder="Task Title..."
                                className="w-full px-4 py-3 bg-[#080a14]/60 border border-indigo-500/20 rounded-xl outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/20 text-xs text-slate-100 transition"
                            />
                            <textarea
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                placeholder="Details or additional notes..."
                                rows={2}
                                className="w-full px-4 py-3 bg-[#080a14]/60 border border-indigo-500/20 rounded-xl outline-none focus:border-indigo-400/50 focus:ring-1 focus:ring-indigo-400/20 text-xs text-slate-100 transition resize-none"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] text-indigo-300/50 font-bold uppercase tracking-wider">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="px-3 py-2 bg-[#080a14]/60 border border-indigo-500/20 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="Work">💼 Work</option>
                                        <option value="Personal">🏠 Personal</option>
                                        <option value="Health">❤️ Health</option>
                                        <option value="Finance">💵 Finance</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] text-indigo-300/50 font-bold uppercase tracking-wider">
                                        Priority
                                    </label>
                                    <select
                                        value={selectedPriority}
                                        onChange={(e) => setSelectedPriority(e.target.value)}
                                        className="px-3 py-2 bg-[#080a14]/60 border border-indigo-500/20 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
                                    >
                                        <option value="Low">🟢 Low</option>
                                        <option value="Medium">🟡 Medium</option>
                                        <option value="High">🔴 High</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl text-xs hover:scale-[1.01] active:scale-[0.99] transition duration-200 shadow-lg shadow-indigo-500/10"
                            >
                                Add Note
                            </button>
                        </form>
                    </div>

                    {/* Search & Filters Card */}
                    <div className="bg-[#101424]/30 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] rounded-3xl p-6 backdrop-blur-xl">
                        <h2 className="text-sm font-bold text-indigo-200 mb-4 flex items-center gap-2">
                            <Search className="w-4 h-4 text-indigo-400" />
                            <span>Quick Filters</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-indigo-400/40" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search notes details..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-[#080a14]/60 border border-indigo-500/20 rounded-xl outline-none text-xs text-slate-200 focus:border-indigo-400/50"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[9px] text-indigo-300/50 font-bold uppercase tracking-wider">
                                    Status
                                </label>
                                <div className="flex gap-1 bg-[#080a14]/60 p-1 rounded-xl border border-indigo-500/20">
                                    {["all", "pending", "completed"].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setStatusFilter(status)}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition capitalize ${
                                                statusFilter === status
                                                    ? "bg-[#101424]/80 text-indigo-300 border border-indigo-500/25"
                                                    : "text-slate-400 hover:text-slate-100"
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[9px] text-indigo-300/50 font-bold uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-[#080a14]/60 border border-indigo-500/20 rounded-xl outline-none text-xs text-slate-200 cursor-pointer"
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
                    <div className="bg-[#101424]/10 border border-white/5 shadow-[0_8px_32px_0_rgba(0,0,0,0.15)] rounded-3xl p-6 min-h-[460px] backdrop-blur-xl flex flex-col">
                        <div className="flex items-center justify-between mb-6 border-b border-indigo-500/10 pb-4">
                            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                                <ListTodo className="w-5 h-5 text-indigo-400" />
                                <span>Workspace Notes</span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#101424] border border-indigo-500/10 text-indigo-300">
                                    {filteredTasks.length}
                                </span>
                            </h2>
                        </div>

                        {/* Empty Board state */}
                        {filteredTasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center my-auto py-16 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-[#101424]/50 border border-white/5 flex items-center justify-center mb-4 text-xl">
                                    📭
                                </div>
                                <p className="text-slate-400 font-bold text-sm">No notes found</p>
                                <p className="text-xs text-indigo-300/40 mt-1">
                                    No outstanding notes match your active filters. Try adding one!
                                </p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3.5">
                                {filteredTasks.map((task) => (
                                    <li
                                        key={task.id}
                                        className={`group flex items-start justify-between p-5 rounded-2xl border transition-all duration-200 ${
                                            task.completed
                                                ? "bg-[#101424]/10 border-transparent text-slate-500 opacity-50"
                                                : "bg-[#101424]/30 border-white/5 hover:border-indigo-500/20 text-slate-100 hover:bg-[#101424]/40"
                                        }`}
                                    >
                                        {editingTaskId === task.id ? (
                                            /* 📝 EDIT MODE CARD */
                                            <div className="flex-1 flex flex-col gap-3">
                                                <input
                                                    type="text"
                                                    value={editTaskText}
                                                    onChange={(e) => setEditTaskText(e.target.value)}
                                                    className="w-full px-3 py-2 bg-[#080a14]/80 border border-indigo-500/30 rounded-xl text-xs text-slate-100 outline-none focus:border-indigo-400/50"
                                                    placeholder="Edit Title..."
                                                />
                                                <textarea
                                                    value={editTaskContent}
                                                    onChange={(e) => setEditTaskContent(e.target.value)}
                                                    rows={2}
                                                    className="w-full px-3 py-2 bg-[#080a14]/80 border border-indigo-500/30 rounded-xl text-xs text-slate-100 outline-none focus:border-indigo-400/50 resize-none"
                                                    placeholder="Edit Details..."
                                                />
                                                <div className="flex gap-2 justify-end mt-1">
                                                    <button
                                                        onClick={() => setEditingTaskId(null)}
                                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg flex items-center gap-1 transition"
                                                    >
                                                        <X className="w-3 h-3" />
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleeditcontent(task.id, editTaskText, editTaskContent)}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-750 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition shadow-md shadow-indigo-500/10"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* 👁️ VIEW MODE CARD */
                                            <>
                                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                                    {/* Completed Checkbox */}
                                                    <button
                                                        onClick={() => handleToggleComplete(task.id)}
                                                        className={`w-5 h-5 rounded-md mt-0.5 border flex items-center justify-center transition-all ${
                                                            task.completed
                                                                ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-transparent text-white"
                                                                : "border-indigo-500/30 hover:border-indigo-400 bg-[#080a14]/60"
                                                        }`}
                                                    >
                                                        {task.completed && (
                                                            <Check className="w-3 h-3 stroke-[3]" />
                                                        )}
                                                    </button>

                                                    {/* Note content */}
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-sm font-semibold truncate ${task.completed ? "line-through text-slate-500 font-normal" : "text-slate-200 font-medium"}`}
                                                        >
                                                            {task.text}
                                                        </p>
                                                        {task.content && (
                                                            <p className={`text-xs text-indigo-100/50 mt-1.5 leading-relaxed ${task.completed ? "line-through text-slate-650" : ""}`}>
                                                                {task.content}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                                                            <span className={`text-[9px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${getCategoryBadgeClass(task.category)}`}>
                                                                {getCategoryIcon(task.category)} {task.category}
                                                            </span>
                                                            <span
                                                                className={`text-[9px] px-2 py-0.5 rounded-md border font-extrabold uppercase ${getPriorityColor(task.priority)}`}
                                                            >
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action buttons (Shown on hover) */}
                                                <div className="opacity-0 group-hover:opacity-100 flex gap-2 ml-4 self-center">
                                                    <button
                                                        onClick={() => {
                                                            setEditingTaskId(task.id);
                                                            setEditTaskText(task.text);
                                                            setEditTaskContent(task.content || "");
                                                        }}
                                                        className="p-2 text-indigo-400/40 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl transition duration-150"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteTask(task.id)}
                                                        className="p-2 text-indigo-400/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition duration-150"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Action History Feed */}
                    <section className="bg-[#101424]/30 border border-white/5 rounded-3xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4 border-b border-indigo-500/10 pb-3">
                            <h2 className="text-xs font-bold text-indigo-200 flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Recent Operations</span>
                            </h2>
                            {activities.length > 0 && (
                                <button
                                    onClick={clearAllActivities}
                                    className="text-xs text-indigo-300/40 hover:text-rose-450 transition font-semibold"
                                >
                                    Clear Logs
                                </button>
                            )}
                        </div>

                        {activities.length === 0 ? (
                            <p className="text-xs text-indigo-355/30 italic py-1">No action records.</p>
                        ) : (
                            <ul className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar">
                                {activities.map((act) => (
                                    <li
                                        key={act.id}
                                        className="flex justify-between items-center text-[11px] text-indigo-200/50 py-1 border-b border-indigo-500/5 last:border-0"
                                    >
                                        <span>{act.message}</span>
                                        <span className="text-[9px] text-indigo-300/30 font-mono">
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
