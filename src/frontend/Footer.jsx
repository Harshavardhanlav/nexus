import "./Footer.css";

export function Footer() {

   return (

      <footer className="footer">

         <div className="footer-container">

            {/* LEFT */}

            <div className="footer-left">

               <span className="footer-logo">
                  NEXUS
               </span>

               <span className="footer-copy">
                  © {new Date().getFullYear()}
               </span>

            </div>

            {/* CENTER */}

            <p className="footer-tagline">
               Streamlining School Operations
            </p>

            {/* RIGHT */}

            <div className="footer-links">

               <a href="#features">
                  Features
               </a>

               <a href="#about">
                  About
               </a>

               <a href="#team">
                  Team
               </a>

            </div>

         </div>

      </footer>

   );

}