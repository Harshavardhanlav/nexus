import "./StatsCard.css";

export function StatsCard({ label, value, description }) {
  return (
    <div className="stats-card card">
      <p className="stats-card__label">{label}</p>
      <h2>{value}</h2>
      {description && <p className="stats-card__description">{description}</p>}
    </div>
  );
}
