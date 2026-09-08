import "./Team.css";

import t1 from "../assets/team-1.jpg";
import t2 from "../assets/team-2.jpg";
import t3 from "../assets/team-3.jpg";
import t4 from "../assets/team-4.jpg";

const team = [

   {
      img: t1,
      name: "Mownica Reddy",
      role: "Head of the Product",
      desc: "Passionate about building modern systems that simplify school management."
   },

   {
      img: t3,
      name: "Manasa",
      role: "Frontend Developer",
      desc: "Builds responsive interfaces and interactive user experiences for NEXUS."
   },

   {
      img: t2,
      name: "Rohith",
      role: "UI/UX Designer",
      desc: "Designs modern layouts and smooth user interactions across the platform."
   },

   {
      img: t4,
      name: "Harsha Vardhan",
      role: "Backend Developer",
      desc: "Handles APIs, database management, and core system functionality."
   }

];

export function Team() {

   return (

      <section
         id="team"
         className="team-section"
      >

         <div className="team-container">

            {/* TOP */}

            <div className="team-top">

               <span className="team-small-title">
                  Team
               </span>

               <h2 className="team-heading">
                  The people behind NEXUS.
               </h2>

            </div>

            {/* TEAM GRID */}

            <div className="team-grid">

               {team.map((m) => (
                  <div
                     key={m.name}
                     className="team-card"
                  >
                     <div className="team-image-wrapper">
                        <img
                           src={m.img}
                           alt={m.name}
                           loading="lazy"
                           className="team-image"
                        />
                        <div className="team-image-overlay"></div>

                     </div>

                     {/* CONTENT */}

                     <h3 className="team-name">
                        {m.name}
                     </h3>

                     <p className="team-role">
                        {m.role}
                     </p>

                     <p className="team-desc">
                        {m.desc}
                     </p>

                  </div>

               ))}

            </div>

         </div>

      </section>

   );

}