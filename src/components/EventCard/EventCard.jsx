import "./EventCard.css";

export function EventCard({ event, onClick }) {
  const eventDate = new Date(event.eventDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button type="button" className="event-card card" onClick={() => onClick(event)}>
      <div>
        <h3>{event.title || "Calendar Event"}</h3>
        <p>{event.description || "No description available."}</p>
      </div>
      <div className="event-card__meta">
        <span>{eventDate}</span>
        <span className="event-card__tag">{event.dayType || "Working"}</span>
      </div>
    </button>
  );
}
