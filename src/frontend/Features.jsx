import "./Features.css";

import {
   CalendarCheck,
   CalendarRange,
   ListTodo,
   Megaphone,
   BarChart3,
   Users
} from "lucide-react";

const features = [

   {
      icon: CalendarCheck,
      title: "Attendance Tracking",
      desc: "Real-time, frictionless teacher attendance with biometric and geo-aware check-in."
   },

   {
      icon: CalendarRange,
      title: "Smart Calendar",
      desc: "A unified school calendar that adapts to schedules, events, and shift swaps."
   },

   {
      icon: ListTodo,
      title: "Task Management",
      desc: "Assign, track, and resolve staff tasks across departments without the noise."
   },

   {
      icon: Megaphone,
      title: "Notices System",
      desc: "Push targeted notices to staff in seconds. Read receipts and priorities included."
   },

   {
      icon: BarChart3,
      title: "Attendance Reports",
      desc: "Beautiful, exportable analytics for principals and HR — at a glance."
   },

   {
      icon: Users,
      title: "Teacher Management",
      desc: "Profiles, roles, subjects, performance — every staff record in one place."
   }

];

export function Features() {

   return (

      <section id="features" className="features-section">

         <div className="features-container">

            {/* TOP CONTENT */}

            <div className="features-top">

               <span className="features-small-title">
                  Features
               </span>

               <h2 className="features-heading">
                  Everything your school runs on.
               </h2>

               <p className="features-description">
                  Six interconnected modules, one calm interface.
               </p>

            </div>

            {/* FEATURE GRID */}

            <div className="features-grid">

               {features.map((f) => (

                  <div
                     key={f.title}
                     className="feature-card"
                  >

                     <div className="feature-icon-box">

                        <f.icon className="feature-icon" />

                     </div>

                     <h3 className="feature-title">
                        {f.title}
                     </h3>

                     <p className="feature-text">
                        {f.desc}
                     </p>

                  </div>

               ))}

            </div>

         </div>

      </section>

   );

}