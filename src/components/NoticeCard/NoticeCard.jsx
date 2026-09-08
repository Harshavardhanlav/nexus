

export function NoticeCard({ notice, onEdit, onDelete, hideActions = false }) {
  // Normalize the priority text safely to lowercase matching your CSS hooks
  const priorityClass = notice.priority ? notice.priority.toLowerCase() : "medium";

  // Dynamic status indicators matching standard system layouts
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🚨";
      case "low":
        return "📌";
      default:
        return "⚠️";
    }
  };

  return (
    <div className={`notice-card ${priorityClass}`}>
      <div className="notice-icon">{getPriorityIcon(priorityClass)}</div>

      <div className="notice-content">
        <h4>{notice.title}</h4>
        {notice.message && <p>{notice.message}</p>}
        <span className="notice-date">
          {notice.date
            ? new Date(notice.date).toLocaleDateString()
            : new Date().toLocaleDateString()}
        </span>
      </div>

      <div
        className="notice-card__actions"
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <span className={`priority-badge priority-${priorityClass}`}>
          {notice.priority || "Medium"}
        </span>

        {!hideActions && (onEdit || onDelete) && (
          <div className="flex">
            {onEdit && (
              <button type="button" onClick={onEdit}>
                Edit
              </button>
            )}
            {onDelete && (
              <button type="button" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}