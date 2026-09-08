import "./TeacherCard.css";

export function TeacherCard({ teacher, onEdit, onDelete }) {
  return (
    <article className="teacher-card card">
      <div className="teacher-card__profile">
        <div className="teacher-card__avatar">
          {teacher.profilePic ? (
            <img src={teacher.profilePic} alt={teacher.fullName} />
          ) : (
            <span>{teacher.fullName?.[0] || "T"}</span>
          )}
        </div>
        <div>
          <p className="teacher-card__name">{teacher.fullName}</p>
          <p className="teacher-card__role">{teacher.designation}</p>
        </div>
      </div>
      <div className="teacher-card__details">
        <p>
          <strong>ID:</strong> {teacher.teacherID}
        </p>
        <p>
          <strong>Subject:</strong> {teacher.subjects}
        </p>
        <p>
          <strong>Mobile:</strong> {teacher.mobile}
        </p>
      </div>
      <div className="teacher-card__actions">
        <button type="button" className="secondary" onClick={() => onEdit(teacher)}>
          Edit
        </button>
        <button type="button" className="secondary" onClick={() => onDelete(teacher)}>
          Delete
        </button>
      </div>
    </article>
  );
}
