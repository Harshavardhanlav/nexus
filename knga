import "./App.css";

import { Navbar } from "./frontend/RNavbar";
import { LNavbar } from "./frontend/LNavbar";

import { Hero } from "./frontend/Hero";
import { AuthPanel } from "./frontend/AuthPanel";
import { Features } from "./frontend/Features";
import { About } from "./frontend/About";
import { Team } from "./frontend/Team";
import { Footer } from "./frontend/Footer";
import {LAuthPanel} from "./frontend/LAuthPanel"
import{LHero} from "./frontend/LHero"

import { useEffect, useState } from "react";

function App() {

   const [register, setRegister] = useState(true);

   const checkAdmin = async () => {

      const response = await fetch(
         "http://localhost:5000/admin/check-admin"
      );

      const data = await response.json();

      console.log(data);

      if(data.message === "Admin already exists"){

         setRegister(false);

      }
   };

   useEffect(() => {

      checkAdmin();

   }, []);

   return (

      <div className="app">

         {register ? <Navbar /> : <LNavbar />}

         {register ? <Hero /> : <LHero/>}

         {register ? <AuthPanel /> : <LAuthPanel />}

         <Features />

         <About />

         <Team />

         <Footer />

      </div>

   );
}

export default App;