import { useNavigate } from "react-router-dom";
import "./TeacherSettings.css";

export default function TeacherSettings() {
  const navigate = useNavigate();
  const teacher = JSON.parse(localStorage.getItem("teacherData")) || {};

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("teacherID");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherData");
    localStorage.removeItem("teacherCompletedTasks");
    navigate("/");
  };

  return (
    <section className="teacher-settings-page">
      <div className="teacher-settings__container">
        <div className="teacher-settings__header card">
          <div className="teacher-settings__header-content">
            <h1>⚙️ Settings</h1>
            <p>Manage your account details and session</p>
          </div>
        </div>

        <div className="settings-section card">
          <h3 className="section-title">👤 Account</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Name</p>
              <p className="setting-value">{teacher.fullName}</p>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Teacher ID</p>
              <p className="setting-value">{teacher.teacherID}</p>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Subject</p>
              <p className="setting-value">{teacher.subjects}</p>
            </div>
          </div>
        </div>

        <div className="settings-section card danger-zone">
          <h3 className="section-title">⚠️ Danger Zone</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Logout</p>
              <p className="setting-desc">Sign out of your account</p>
            </div>
            <div className="setting-control">
              <button
                className="settings-btn settings-btn--danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
