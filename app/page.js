'use client';
import MainFC from "./components/MainFC";
import SlideBar from "./components/SideBar";
import { StarsBackground } from "./components/StarBG";
import MainBG from "./components/MainBG";
import SkillsSection from "./components/SkillsSection";
import CourseCarousel from "./components/CourseCarousel";
import ProjectSection from "./components/ProjectSection";
import Navbar from "./components/NavBar";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <div>
      <MainBG className="min-h-screen">
        <div className="relative z-10 flex items-center justify-center min-h-screen text-white">
          <MainFC />
        </div>
      </MainBG>
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
