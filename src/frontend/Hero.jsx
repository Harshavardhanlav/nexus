import "./Hero.css";

import orb from "../assets/hero.png";
import Spline from "@splinetool/react-spline";
import { Particles } from "./Particles";

import {
   ArrowRight,
   LogIn
} from "lucide-react";

export function Hero() {

   return (

      <section
         id="home"
         className="hero-section"
      >

         {/* BACKGROUND */}

         <div className="hero-background">

            <div className="hero-glow-top"></div>

            <div className="hero-glow-bottom"></div>

         </div>

         <Particles />

         <div className="hero-container">

            {/* LEFT SIDE */}

            <div className="hero-left">

               <div className="hero-badge">

                  <span className="hero-badge-dot"></span>

                  Next-generation school OS

               </div>
               {/* <div className="hero-drone">

               <Spline scene="https://prod.spline.design/RxToEA7qWBdEBwLV/scene.splinecode" />

               </div> */}
               <h1 className="hero-title">
                  NEXUS
               </h1>

               <p className="hero-tagline">
                  Streamlining School Operations.
               </p>

               <p className="hero-description">
                  A unified platform for teacher attendance,
                  task management, notices, events and
                  end-to-end school workflow — engineered
                  for clarity, speed, and scale.
               </p>

               <div className="hero-buttons">

                  <a
                     href="#auth"
                     className="hero-login-btn"
                  >

                     <LogIn className="hero-btn-icon" />

                     Register

                  </a>

                  <a
                     href="#features"
                     className="hero-feature-btn"
                  >

                     Explore Features

                     <ArrowRight className="hero-btn-icon arrow-move" />

                  </a>

               </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="hero-right">

               <div className="hero-orb-glow"></div>

               <div className="hero-circle-one"></div>

               <div className="hero-circle-two"></div>

               <img
                  src={orb}
                  alt="NEXUS holographic core"
                  className="hero-orb-image"
               />

            </div>

         </div>

         {/* SCROLL */}

         <div className="scroll-indicator">

            Scroll

            <span className="scroll-line"></span>

         </div>

      </section>

   );

}