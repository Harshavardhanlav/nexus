import "./Navbar.css";

import {
   useEffect,
   useState
} from "react";

const links = [
   "Home",
   "Features",
   "About",
   "Team"
];

export function Navbar() {

   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {

      const onScroll = () => {
         setScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", onScroll);

      return () =>
         window.removeEventListener("scroll", onScroll);

   }, []);

   return (

      <header className="navbar-header">

         <nav
            className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}
         >

            {/* LOGO */}

            <a
               href="#home"
               className="navbar-logo"
            >
               NEXUS
            </a>

            {/* LINKS */}

            <ul className="navbar-links">

               {links.map((l) => (

                  <li key={l}>

                     <a href={`#${l.toLowerCase()}`}>
                        {l}
                     </a>

                  </li>

               ))}

            </ul>

            {/* BUTTONS */}

            <div className="navbar-buttons">


               <a
                  href="#auth"
                  className="navbar-register"
               >
                  Register
               </a>

            </div>

         </nav>

      </header>

   );

}