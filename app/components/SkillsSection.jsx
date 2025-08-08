'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const skills = [
  // ml
  { name: 'Python', icon: 'python' },
  { name: 'Docker', icon: 'docker' },
  { name: 'Docker Hub', icon: 'docker' },
  { name: 'Kubernetes', icon: 'kubernetes/white' },
  { name: 'AWS', icon: 'amazonwebservices', alticon: '/icons/skills-icons/aws-icon.png' },
  { name: 'Linux', icon: 'linux' },
  { name: 'Prometheus', icon: 'prometheus' },
  { name: 'Grafana', icon: 'grafana' },
  { name: 'DVC', icon: 'dvc' },
  { name: 'MLflow', icon: 'mlflow' },
  // backend
  { name: 'NodeJS', icon: 'nodedotjs/darkgreen' },
  { name: 'ExpressJS', icon: 'express/white' },
  { name: 'JWT', icon: 'jsonwebtoken', alticon: '/icons/skills-icons/jwt-icon.png' },
  { name: 'Mongoose', icon: 'mongoose' },
  { name: 'PostgreSQL', icon: 'postgresql/sky' },
  { name: 'MongoDB', icon: 'mongodb/darkgreen' },
  // frontend
  { name: 'ReactJS', icon: 'react' },
  { name: 'NextJS', icon: 'nextdotjs/white' },
  { name: 'JavaScript', icon: 'javascript' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'Framer Motion', icon: 'framer' },
  { name: 'SwiperJS', icon: 'swiper' },
  { name: 'Streamlit', icon: 'streamlit' }, // can be shown in both MLOps and UI
  // tools and dev
  { name: 'NPM', icon: 'npm' },
  { name: 'Git', icon: 'git' },
  { name: 'GitHub', icon: 'github/white' },
  { name: 'Vercel', icon: 'vercel/white' },

];

export default function SkillsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section
      id="skills"
      ref={ref}
      className="relative pt-10  mx-auto flex h-full flex-col lg:min-h-screen justify-evenly py-0 md:px-10 bg-[#000000]"
    >

      <h2
        style={{
          textShadow:
            '0px 4px 8px rgba(255,255,255,.05),0px 8px 30px rgba(255,255,255,.25)',
        }}
        className="relative text-3xl font-medium tracking-tight sm:text-5xl md:text-6xl mt-10 text-balance text-center z-30 -translate-y-6 md:-translate-y-10 text-[#fff]"
      >
        <span className="text-gradient bg-clip-text animate-gradient-x font-nyght tracking-wide">
          UNDER THE HOOD
        </span>
      </h2>
      <div className="relative mx-auto size-fit overflow-hidden h-[200px]">
        <div className="w-full h-full overflow-hidden mask-half-top">
          <motion.div
            style={{ rotate }}
            className="relative mx-auto size-[300px] md:size-[380px] opacity-65"
          >
            <img
              src="/steel-flower.webp"
              alt="skills cover rotating image"
              draggable={false}
              className="w-full select-none"
            />
          </motion.div>
        </div>
      </div>

      <h2
        style={{
          textShadow:
            '0px 4px 8px rgba(255,255,255,.05),0px 8px 30px rgba(255,255,255,.25)',
        }}
        className="relative text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl text-balance text-center z-30 -translate-y-6 md:-translate-y-10"
      >
        <p className="mb-3 text-xs font-normal tracking-widest text-black/80 dark:text-white/70 uppercase md:text-sm">
          My Skills
        </p>

      </h2>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        }}
        className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2 lg:gap-3 z-30 p-5 lg:p-0"
      >
        {/* {skills.map(({ skill, icon }) => (
          <motion.span
            key={skill}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            data-slot="badge"
            className="inline-flex items-center justify-center rounded-lg border px-3 py-1 text-sm whitespace-nowrap gap-2 text-black dark:text-white border-white-3 dark:bg-neutral-900 dark:border-white/[0.14] bg-white-2 transition-all duration-300 ease-in-out md:px-4 md:py-1.5 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          >

            <img
              src={`https://cdn.simpleicons.org/${icon}`}
              alt={skill}
              className="w-4"
              width={18}
              height={18}
            />

            <span>{name}</span>
          </motion.span>
        ))} */}

        {skills.map(({ name, icon, alticon }, index) => (
          <motion.span
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            data-slot="badge"
            className="inline-flex items-center justify-center rounded-lg border px-3 py-1 text-sm whitespace-nowrap gap-2 text-black dark:text-white border-white-3 dark:bg-neutral-900 dark:border-white/[0.14] bg-white-2 transition-all duration-300 ease-in-out md:px-4 md:py-1.5 hover:shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:dark:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
          >
            <img
              src={alticon || `https://cdn.simpleicons.org/${icon}`}
              alt={`${name} icon`}
              draggable={false}
              className="w-4"
              width={18}
              height={18}
            />
            <span>{name}</span>
          </motion.span>
        ))}
      </motion.div>

    </section>
  );
}
