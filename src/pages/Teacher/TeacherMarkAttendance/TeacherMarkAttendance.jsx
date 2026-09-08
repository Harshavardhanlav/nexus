import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { getTeacherAttendanceStatus, markAttendance } from "../../../services/api";
import { getCurrentLocation, isWithinSchoolRadius } from "../../../utils/geolocation";
import { SCHOOL_CONFIG } from "../../../config/schoolConfig";
import "./TeacherMarkAttendance.css";

export default function TeacherMarkAttendance() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [locationData, setLocationData] = useState(null);
  const [distanceData, setDistanceData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusInfo, setStatusInfo] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("NOT_MARKED");
  const [markedTime, setMarkedTime] = useState(null);

  const teacher = JSON.parse(localStorage.getItem("teacherData")) || {};

  useEffect(() => {
    let isMounted = true;
    async function loadAttendanceStatus() {
      setStatusLoading(true);
      setError("");
      try {
        const data = await getTeacherAttendanceStatus(teacher.teacherID);
        if (!isMounted) return;
        setStatusInfo(data);
        setAttendanceStatus(data.status);
        setAttendanceMarked(data.status === "PRESENT" || data.status === "ABSENT");
        setMarkedTime(
          data.attendance?.attendanceDate
            ? new Date(data.attendance.attendanceDate).toLocaleTimeString()
            : null
        );
      } catch (statusError) {
        if (isMounted) setError(statusError.message || "Unable to load attendance status");
      } finally {
        if (isMounted) setStatusLoading(false);
      }
    }

    loadAttendanceStatus();
    return () => {
      isMounted = false;
    };
  }, [teacher.teacherID]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleGetLocation = async () => {
    if (!statusInfo?.canMarkAttendance) return;
    setLocationLoading(true);
    setError("");
    try {
      const location = await getCurrentLocation();
      setLocationData(location);

      // Check if within school radius
      const distance = isWithinSchoolRadius(
        location.latitude,
        location.longitude,
        SCHOOL_CONFIG.latitude,
        SCHOOL_CONFIG.longitude,
        SCHOOL_CONFIG.radiusMeters
      );

      setDistanceData(distance);
    } catch (err) {
      setError(
        err.message || "Unable to get location. Please enable location services."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!statusInfo?.canMarkAttendance) return;
    setError("");
    setSuccess("");

    if (!locationData) {
      setError("Please get your location first");
      return;
    }

    if (!distanceData?.isWithin) {
      setError("You are outside the school premises. Attendance cannot be marked.");
      return;
    }

    setLoading(true);

    try {
      const data = await markAttendance({
        teacherId: teacher.teacherID,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
      });

      setSuccess("✅ Attendance marked successfully!");
      setLocationData(null);
      setDistanceData(null);
      setAttendanceMarked(true);
      setAttendanceStatus("PRESENT");
      setStatusInfo((previous) => ({
        ...previous,
        ...data,
        status: "PRESENT",
        canMarkAttendance: false,
        attendance: data.attendance,
      }));
      setMarkedTime(
        data.attendance?.attendanceDate
          ? new Date(data.attendance.attendanceDate).toLocaleTimeString()
          : new Date().toLocaleTimeString()
      );

      setTimeout(() => {
        navigate("/teacher/my-attendance");
      }, 2000);
    } catch (err) {
      setError(err.message || "Unable to mark attendance");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="mark-attendance-page">
      <div className="mark-attendance__container">
        {/* Header Card */}
        <div className="mark-attendance__hero card">
          <div className="mark-attendance__hero-content">
            <h1>📍 Mark Your Attendance</h1>
            <p>
              Mark your daily attendance by confirming your location within the school premises.
            </p>
          </div>
        </div>

        {/* Teacher Info Card */}
        <div className="mark-attendance__info card">
          <div className="mark-attendance__info-item">
            <span className="mark-attendance__label">Teacher Name</span>
            <span className="mark-attendance__value">{teacher.fullName || "N/A"}</span>
          </div>
          <div className="mark-attendance__info-item">
            <span className="mark-attendance__label">Teacher ID</span>
            <span className="mark-attendance__value">{teacher.teacherID || "N/A"}</span>
          </div>
          <div className="mark-attendance__info-item">
            <span className="mark-attendance__label">Current Date</span>
            <span className="mark-attendance__value">{formatDate(currentTime)}</span>
          </div>
          <div className="mark-attendance__info-item">
            <span className="mark-attendance__label">Current Time</span>
            <span className="mark-attendance__value mark-attendance__time">
              {formatTime(currentTime)}
            </span>
          </div>
        </div>

        {statusLoading || !statusInfo ? (
          <div className="mark-attendance__status-card card">
            <span className="mark-attendance__status-icon">{error ? "⚠️" : "⏳"}</span>
            <h2>{error ? "Unable to load attendance status" : "Loading attendance status..."}</h2>
            {error && <p>{error}</p>}
          </div>
        ) : statusInfo.status === "HOLIDAY" || statusInfo.status === "NOT_STARTED" ? (
          <div className="mark-attendance__status-card card">
            <span className="mark-attendance__status-icon">
              {statusInfo.status === "HOLIDAY" ? "🏖" : "⏳"}
            </span>
            <h2>
              {statusInfo.status === "HOLIDAY"
                ? "Holiday"
                : "Attendance Not Started"}
            </h2>
            <p>
              {statusInfo.status === "HOLIDAY"
                ? `${statusInfo.holidayName || "Holiday"} - No Attendance Required`
                : `Attendance opens at ${statusInfo.startTime}.`}
            </p>
          </div>
        ) : attendanceMarked ? (
          <div className="mark-attendance__success-complete card">
            <div className="mark-attendance__success-content">
              <span className="mark-attendance__success-icon-large">
                {attendanceStatus === "PRESENT" ? "✅" : "❌"}
              </span>
              <h2>Attendance Already Marked</h2>
              <p>
                Your attendance for today is already recorded as{' '}
                <strong>{attendanceStatus === "PRESENT" ? "Present" : "Absent"}</strong>.
              </p>
              <div className="mark-attendance__marked-info">
                <span className="mark-attendance__label">Marked at:</span>
                <span className="mark-attendance__value">{markedTime || "N/A"}</span>
              </div>
              <button
                className="mark-attendance__btn mark-attendance__btn--primary"
                onClick={() => navigate("/teacher/my-attendance")}
              >
                View Your Attendance History
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Location Status Card */}
            <div className="mark-attendance__location-card card">
              <h3>📌 Location Status</h3>

              {locationData ? (
                <div className="mark-attendance__location-data">
                  <div className="mark-attendance__location-item">
                    <span className="mark-attendance__label">Latitude</span>
                    <span className="mark-attendance__value">
                      {locationData.latitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="mark-attendance__location-item">
                    <span className="mark-attendance__label">Longitude</span>
                    <span className="mark-attendance__value">
                      {locationData.longitude.toFixed(6)}
                    </span>
                  </div>

                  {distanceData && (
                    <>
                      <div className="mark-attendance__location-item">
                        <span className="mark-attendance__label">Distance from School</span>
                        <span
                          className={`mark-attendance__value ${
                            distanceData.isWithin
                              ? "mark-attendance__distance--inside"
                              : "mark-attendance__distance--outside"
                          }`}
                        >
                          {distanceData.distance} meters
                        </span>
                      </div>

                      <div className="mark-attendance__status-indicator">
                        <div
                          className={`mark-attendance__status-badge ${
                            distanceData.isWithin ? "status--inside" : "status--outside"
                          }`}
                        >
                          {distanceData.isWithin ? "✅ Inside Radius" : "❌ Outside Radius"}
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    className="mark-attendance__btn mark-attendance__btn--secondary"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? "Getting Location..." : "🔄 Refresh Location"}
                  </button>
                </div>
              ) : (
                <div className="mark-attendance__no-location">
                  <p>Click the button below to get your current location</p>
                  <button
                    className="mark-attendance__btn mark-attendance__btn--primary"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                  >
                    {locationLoading ? <LoadingSpinner /> : "📍 Get My Location"}
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mark-attendance__error card">
                <span className="mark-attendance__error-icon">⚠️</span>
                <p>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mark-attendance__success card">
                <span className="mark-attendance__success-icon">{success}</span>
              </div>
            )}

            {/* Action Buttons */}
            {locationData && (
              <div className="mark-attendance__actions">
                <button
                  className={`mark-attendance__btn mark-attendance__btn--submit ${
                    !distanceData?.isWithin ? "disabled" : ""
                  }`}
                  onClick={handleMarkAttendance}
                  disabled={loading || !distanceData?.isWithin}
                >
                  {loading ? "Marking Attendance..." : "✅ Mark Attendance"}
                </button>
                <button
                  className="mark-attendance__btn mark-attendance__btn--cancel"
                  onClick={() => {
                    setLocationData(null);
                    setDistanceData(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
