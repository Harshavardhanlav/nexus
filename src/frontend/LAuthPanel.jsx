import { useState } from "react";
import Spline from "@splinetool/react-spline";
import "./AuthPanel.css";
import { BASE_URL } from "../services/api";

export function LAuthPanel({ onLoginSuccess }) {

   const [mode, setMode] = useState("Admin Login");
   const [adminID, setAdminID] = useState("");
   const [password, setPassword] = useState("");
   const [error, setError] = useState("");

   const handleAdminLogin = async () => {
      setError("");
      try {
         const response = await fetch(
            `${BASE_URL}/admin/admin-login`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({
                  username: adminID,
                  password: password
               })
            }
         );

         const data = await response.json();

         if (data.success || data.message === "login Successful") {
            // Save admin session to localStorage
            localStorage.setItem("adminLoggedIn", "true");
            localStorage.setItem("userRole", "admin");
            localStorage.setItem("adminID", adminID);
            // Call the callback to refresh app state
            if (onLoginSuccess) onLoginSuccess();
         } else {
            setError(data.message || "Login failed");
         }
      } catch (err) {
         setError("Connection error: " + err.message);
      }
   };

   const handleTeacherLogin = async () => {
      setError("");
      try {
         const response = await fetch(
            `${BASE_URL}/teachers/teacher-login`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({
                  teacherID: adminID,
                  password: password
               })
            }
         );

         const data = await response.json();

         if (data.success && data.teacher) {
            // Save teacher session to localStorage
            localStorage.setItem("userRole", "teacher");
            localStorage.setItem("teacherID", data.teacher.teacherID);
            localStorage.setItem("teacherName", data.teacher.fullName);
            localStorage.setItem("teacherData", JSON.stringify(data.teacher));
            // Call the callback to refresh app state
            if (onLoginSuccess) onLoginSuccess();
         } else {
            setError(data.message || "Login failed");
         }
      } catch (err) {
         setError("Connection error: " + err.message);
      }
   };

   return (

      <section id="auth" className="auth-section">

         <div className="auth-bg">
            <div className="auth-glow"></div>
         </div>

         <div className="auth-wrapper">

            {/* LOGIN CARD */}

            <div className="auth-card">

               {/* TOGGLE BUTTONS */}

               <div className="auth-toggle">

                  {["Admin Login", "Teacher Login"].map((m) => (

                     <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`toggle-btn ${mode === m ? "active" : ""}`}
                     >
                        {m}
                     </button>

                  ))}

               </div>

               {/* CONTENT */}

               <div className="auth-content">

                  <h3 className="auth-title">
                     Welcome Back
                  </h3>

                  <p className="auth-subtitle">
                     {mode === "Admin Login"
                        ? "Sign in to manage your NEXUS workspace."
                        : "Sign in to access your teacher dashboard."}
                  </p>

                  <div className="auth-inputs">

                     <input
                        type="text"
                        placeholder={
                           mode === "Admin Login"
                              ? "Admin ID"
                              : "Teacher ID"
                        }
                        className="auth-input"
                        value={adminID}
                        onChange={(e) => setAdminID(e.target.value)}
                     />

                     <input
                        type="password"
                        placeholder="Password"
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />

                  </div>

                  {error && <p style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}>{error}</p>}

                  <button 
                     className="auth-submit-btn" 
                     onClick={mode === "Admin Login" ? handleAdminLogin : handleTeacherLogin}
                  >
                     Login
                  </button>

                  <p className="forgot-password">
                     Forgot Password?
                  </p>

               </div>

            </div>

            {/* 3D MODEL */}

            <div className="auth-spline">

               <Spline scene="https://prod.spline.design/CBT5tjZYHMnYSBLl/scene.splinecode" />

            </div>

         </div>

      </section>

   );

}