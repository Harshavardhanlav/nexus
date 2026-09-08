import "./About.css";

export function About() {
   const stats = [

      {
         k: "120+",
         v: "Schools"
      },
      {
         k: "9.8k",
         v: "Staff"
      },
      {
         k: "99.9%",
         v: "Uptime"
      }

   ];

   return (

      <section
         id="about"
         className="about-section"
      >

         <div className="about-background">

            <div className="about-glow"></div>

         </div>

         <div className="about-container">

  

            <div className="about-left">

               <span className="about-small-title">
                  About
               </span>

               <h2 className="about-heading">
                  Built for the people who run schools.
               </h2>

            </div>

            {/* RIGHT */}

            <div className="about-right">

               <p>
                  NEXUS is a school staff management and workflow
                  system designed to replace the patchwork of
                  spreadsheets, paper registers, and group chats
                  that today's schools rely on.
               </p>

               <p>
                  From attendance and tasks to notices and events —
                  every operational surface is unified into one calm,
                  futuristic interface that principals, coordinators,
                  and teachers actually enjoy using.
               </p>

               {/* STATS */}

               <div className="about-stats">

                  {stats.map((s) => (

                     <div
                        key={s.v}
                        className="about-stat-card"
                     >

                        <div className="about-stat-number">
                           {s.k}
                        </div>

                        <div className="about-stat-text">
                           {s.v}
                        </div>

                     </div>

                  ))}

               </div>

            </div>

         </div>

      </section>

   );

}