import "./EmptyState.css";

export default function EmptyState({ title, message }) {
  return (
    <div className="empty-state card">
      <div className="empty-state__icon">•</div>
      <div>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
