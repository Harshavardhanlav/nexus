import "./Particles.css";

export function Particles() {

   const particles = Array.from({ length: 80 });

   return (

      <div className="particles-container">

         {particles.map((_, i) => {

            const size = Math.random() * 3 + 1;

            const left = Math.random() * 100;

            const top = Math.random() * 100;

            const delay = Math.random() * 8;

            const duration = 10 + Math.random() * 14;

            return (

               <span
                  key={i}
                  className="particle"
                  style={{
                     width: `${size}px`,
                     height: `${size}px`,
                     left: `${left}%`,
                     top: `${top}%`,
                     animationDelay: `${delay}s`,
                     animationDuration: `${duration}s`
                  }}
               ></span>

            );

         })}

      </div>

   );

}