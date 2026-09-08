import "./QuickActions.css";
import { useNavigate } from "react-router-dom";

export function QuickActions() {

  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Teacher",
      icon: "👨‍🏫",
      path: "/teachers"
    },
    {
      title: "Create Notice",
      icon: "📢",
      path: "/notices"
    },
    {
      title: "Create Task",
      icon: "✅",
      path: "/tasks"
    },
    {
      title: "Attendance",
      icon: "📋",
      path: "/attendance"
    }
  ];

  return (
    <div className="quick-actions card">

      <div className="quick-actions__header">
        <h3>Quick Actions</h3>
      </div>

      <div className="quick-actions__grid">

        {actions.map((action) => (
          <button
            key={action.title}
            className="quick-action-card"
            onClick={() => navigate(action.path)}
          >
            <span className="quick-action-icon">
              {action.icon}
            </span>

            <span className="quick-action-title">
              {action.title}
            </span>
          </button>
        ))}

      </div>

    </div>
  );
}