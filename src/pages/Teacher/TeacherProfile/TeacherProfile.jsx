import { useState } from "react";
import { BASE_URL } from "../../../services/api";
import "./TeacherProfile.css";

export default function TeacherProfile() {
  const teacher = JSON.parse(localStorage.getItem("teacherData")) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: teacher.fullName || "",
    subjects: teacher.subjects || "",
    mobile: teacher.mobile || "",
    designation: teacher.designation || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setMessage("");
    try {
      const response = await fetch(
        `${BASE_URL}/teachers/update/${teacher._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedTeacher = { ...teacher, ...formData };
        localStorage.setItem("teacherData", JSON.stringify(updatedTeacher));
        setMessage("✅ Profile updated successfully");
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update profile: " + data.message);
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  return (
    <section className="teacher-profile-page">
      <div className="teacher-profile__container">
        <div className="teacher-profile__header card">
          <div className="teacher-profile__header-content">
            <h1>👤 My Profile</h1>
            <p>View and edit your profile information</p>
          </div>
        </div>

        <div className="teacher-profile__card card">
          <div className="profile-header">
            <div className="profile-avatar">
              {teacher.profilePic ? (
                <img src={teacher.profilePic} alt={teacher.fullName} />
              ) : (
                <span>{teacher.fullName?.charAt(0) || "T"}</span>
              )}
            </div>
            <div className="profile-name-info">
              <h2>{teacher.fullName}</h2>
              <p className="profile-id">ID: {teacher.teacherID}</p>
            </div>
          </div>

          {message && (
            <div className={`profile-message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          {!isEditing ? (
            <div className="profile-info">
              <div className="profile-field">
                <span className="field-label">Full Name</span>
                <span className="field-value">{formData.fullName}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Teacher ID</span>
                <span className="field-value">{teacher.teacherID}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Subject</span>
                <span className="field-value">{formData.subjects}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Mobile Number</span>
                <span className="field-value">{formData.mobile}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Designation</span>
                <span className="field-value">{formData.designation}</span>
              </div>
            </div>
          ) : (
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="profile-actions">
            {!isEditing ? (
              <button
                className="profile-btn profile-btn--primary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="profile-btn profile-btn--primary"
                  onClick={handleSaveProfile}
                >
                  💾 Save Changes
                </button>
                <button
                  className="profile-btn profile-btn--cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
