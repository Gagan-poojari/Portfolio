'use client'
import MainFC from "./components/MainFC";
import SlideBar from "./components/SideBar";
// import HeroSection from "./components/HeroSection";
import { StarsBackground } from "./components/StarBG";
import SkillsSection from "./components/SkillsSection";
import CourseCarousel from "./components/CourseCarousel";
import ProjectSection from "./components/ProjectSection";
import Navbar from "./components/NavBar";
import Contact from "./components/Contact";
import Loader from "./components/Loader";
import { useState } from "react";

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  return (
    <div>
      {/* <Loader onComplete={() => setLoaded(true)} /> */}
      {/* <HeroSection /> */}
      <StarsBackground starColor="#ffffff" speed={60} factor={0.08}>
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <MainFC />
        </div>
      </StarsBackground>
      <Navbar />
      <SlideBar />
      <div className="h-[2px] bg-[#000000bc]"></div>
      <SkillsSection />
      <CourseCarousel />
      <div className="h-[2px] bg-[#000000bc]"></div>
      <ProjectSection />
      <div className="h-[2px] bg-[#000000bc]"></div>

      <StarsBackground starColor="#ffffff" speed={60} factor={0.08}>
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <Contact />
        </div>
      </StarsBackground>
    </div>
  ); 
}
