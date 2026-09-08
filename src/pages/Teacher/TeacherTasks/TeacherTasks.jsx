import { useEffect, useState, useMemo } from "react";
import { getTasks, updateTask } from "../../../services/api";
import EmptyState from "../../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import "./TeacherTasks.css";

export default function TeacherTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const teacher = JSON.parse(localStorage.getItem("teacherData")) || {};

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  // Filter tasks assigned to the current teacher
  const assignedTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.assignedTo === teacher.fullName ||
        task.assignedTeacherId === teacher.teacherID
    );
  }, [tasks, teacher]);

  // Filter tasks based on status and search
  const filteredTasks = useMemo(() => {
    let filtered = assignedTasks;

    if (statusFilter === "Completed") {
      filtered = filtered.filter((task) => task.status === "Completed");
    } else if (statusFilter === "Pending") {
      filtered = filtered.filter((task) => task.status !== "Completed");
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [assignedTasks, statusFilter, searchTerm]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: assignedTasks.length,
      completed: assignedTasks.filter((task) => task.status === "Completed").length,
      pending: assignedTasks.filter((task) => task.status !== "Completed").length,
    };
  }, [assignedTasks]);

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    
    try {
      // Update in database
      await updateTask(task._id, {
        ...task,
        status: newStatus
      });
      
      // Refresh tasks from database
      await fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
      setError("Failed to update task status");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isPastDeadline = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  return (
    <section className="teacher-tasks-page">
      <div className="teacher-tasks__container">
        {/* Header */}
        <div className="teacher-tasks__header card">
          <div className="teacher-tasks__header-content">
            <h1>✅ My Tasks</h1>
            <p>View and manage your assigned tasks</p>
          </div>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="teacher-tasks__stats">
            <div className="stat-card stat-card--total">
              <div className="stat-card__icon">📋</div>
              <div className="stat-card__content">
                <span className="stat-card__label">Total Tasks</span>
                <span className="stat-card__value">{stats.total}</span>
              </div>
            </div>
            <div className="stat-card stat-card--pending">
              <div className="stat-card__icon">⏳</div>
              <div className="stat-card__content">
                <span className="stat-card__label">Pending</span>
                <span className="stat-card__value">{stats.pending}</span>
              </div>
            </div>
            <div className="stat-card stat-card--completed">
              <div className="stat-card__icon">✅</div>
              <div className="stat-card__content">
                <span className="stat-card__label">Completed</span>
                <span className="stat-card__value">{stats.completed}</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="teacher-tasks__filters card">
          <div className="filter-section">
            <div className="filter-group">
              <label className="filter-label">Filter</label>
              <div className="filter-buttons">
                {["All", "Pending", "Completed"].map((status) => (
                  <button
                    key={status}
                    className={`filter-btn ${statusFilter === status ? "active" : ""}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="search-group">
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="teacher-tasks__status card">
            <LoadingSpinner />
            <span>Loading tasks...</span>
          </div>
        ) : error ? (
          <div className="teacher-tasks__error card">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title={
              stats.total === 0
                ? "No Tasks Assigned"
                : `No ${statusFilter} Tasks`
            }
            message={
              stats.total === 0
                ? "You don't have any assigned tasks yet."
                : `You don't have any ${statusFilter.toLowerCase()} tasks.`
            }
          />
        ) : (
          <div className="teacher-tasks__list">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === "Completed";
              const isPast = isPastDeadline(task.deadline);

              return (
                <div
                  key={task._id}
                  className={`task-card card ${isCompleted ? "completed" : ""} ${
                    isPast && !isCompleted ? "overdue" : ""
                  }`}
                >
                  <div className="task-card__header">
                    <div className="task-card__title-section">
                      <button
                        className={`task-checkbox ${isCompleted ? "checked" : ""}`}
                        onClick={() => handleToggleComplete(task)}
                        aria-label={`Mark ${task.title} as ${
                          isCompleted ? "incomplete" : "complete"
                        }`}
                      >
                        {isCompleted ? "✓" : ""}
                      </button>
                      <div className="task-card__title-group">
                        <h3 className={`task-card__title ${isCompleted ? "completed" : ""}`}>
                          {task.title}
                        </h3>
                        <p className="task-card__description">{task.description}</p>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="task-card__badge-completed">✅ Completed</div>
                    )}
                    {isPast && !isCompleted && (
                      <div className="task-card__badge-overdue">⚠️ Overdue</div>
                    )}
                  </div>

                  <div className="task-card__footer">
                    <div className="task-card__deadline">
                      <span className="deadline-icon">📅</span>
                      <span className={`deadline-text ${isPast ? "past" : ""}`}>
                        {formatDate(task.deadline)}
                      </span>
                    </div>

                    <div className="task-card__status">
                      <span
                        className={`status-badge ${
                          isCompleted ? "status--completed" : "status--pending"
                        }`}
                      >
                        {isCompleted ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refresh Button */}
        {!loading && (
          <div className="teacher-tasks__actions">
            <button className="refresh-btn" onClick={fetchTasks}>
              🔄 Refresh Tasks
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
