'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer';

import Tilt from 'react-parallax-tilt'
import GlitchImage from './GlitchImage'

const MainFC = () => {
  const mern_icons = [
    { id: 1, src: '/icons/mern-icons/nextjs-icon.png', alt: 'Next.js' },
    { id: 2, src: '/icons/mern-icons/reactjs-icon.png', alt: 'React.js' },
    { id: 3, src: '/icons/mern-icons/expressjs-icon.png', alt: 'Express.js' },
    { id: 4, src: '/icons/mern-icons/git-icon.png', alt: 'Git' },
    { id: 5, src: '/icons/mern-icons/mongodb-icon.webp', alt: 'MongoDB' },
  ]

  const dsml_icons = [
    { id: 1, src: '/icons/dsml-icons/docker-icon.webp', alt: 'Docker' },
    { id: 2, src: '/icons/dsml-icons/kubernetes-icon.png', alt: 'Kubernetes' },
    // { id: 5, src: '/icons/dsml-icons/scikit-learn-icon.png', alt: 'scikit-learn' },
    { id: 9, src: '/icons/dsml-icons/prometheus-icon.png', alt: 'Prometheus' },
    { id: 10, src: '/icons/dsml-icons/grafana-icon.webp', alt: 'Grafana' },
    { id: 11, src: '/icons/dsml-icons/git-icon.png', alt: 'Git' },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }


const sentence = {
  hidden: { opacity: 1 },
  visible: {
    transition: {
      delay: 0,
      staggerChildren: 0.05,
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

  const [heading, setHeading] = useState('HEY THERE, WELCOME TO MY PORTFOLIO...');
  const [hasSwitched, setHasSwitched] = useState(false);

  useEffect(() => {
    if (!hasSwitched) {
      const timeout = setTimeout(() => {
        setHeading("I ' M GAGAN POOJARI");
        setHasSwitched(true);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [hasSwitched]);


  return (
    <div className='min-h-screen flex flex-col justify-center items-center lg:gap-20 p-10'>
      <motion.div
      initial="hidden"
      animate="visible"
      variants={sentence}
      className="flex flex-col items-center justify-center text-center px-6"
    >
      <h1 style={{
          textShadow:
            '0px 4px 8px rgba(255,255,255,.05),0px 8px 30px rgba(255,255,255,.25)',
        }} className="text-4xl m-10 lg:m-0 md:text-6xl lg:text-5xl font-extrabold text-[#ffffff]">
        <Balancer>
          {heading.split('').map((char, index) => (
            <motion.span key={index} variants={letter}>
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </Balancer>
      </h1>
    </motion.div>
        
      <div className="relative z-10 flex flex-col lg:flex-row justify-center items-center gap-10 px-4 overflow-hidden">

        {/* Left gradient wave */}
        {/* <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-b from-[#297bc9]/20 to-transparent z-0 pointer-events-none" /> */}
        {/* Right gradient wave */}
        {/* <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-b from-[#c7061c]/20 to-transparent z-0 pointer-events-none" /> */}
        {/* Optional subtle noise texture */}
        {/* <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 z-0 mix-blend-soft-light pointer-events-none" /> */}
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} glareEnable={false} glareMaxOpacity={0.2} className="z-10 w-full smooth">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-10 relative z-10 ">

            {/* MERN Stack Section */}
            <motion.div
              className="w-full lg:w-1/3 flex flex-col items-end"
              initial="hidden"
              animate="show"
              variants={fadeIn}
            >
              <motion.div
                className="text-right text-[#297bc9] transformers"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-4xl font-bold">MERN stack</div>
                <div className="text-3xl font-semibold">Developer</div>
              </motion.div>

              <motion.div
                className="flex flex-wrap justify-end mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {mern_icons.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="group p-1 relative"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      title={item.alt}
                      width={80}
                      height={80}
                      className="w-12 sm:w-14 p-2 m-1 border-2 border-[#297bc9] border-double rounded-xl shadow-md backdrop-blur-sm transition-all hover:shadow-blue-400"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all rounded-xl blur-sm pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Glitch Image Centerpiece */}
            <div className="relative-10">
              <GlitchImage />
            </div>

            {/* DSML Section */}
            <motion.div
              className="w-full lg:w-1/3 flex flex-col items-start"
              initial="hidden"
              animate="show"
              variants={fadeIn}
            >
              <motion.div
                className="flex flex-wrap justify-start mt-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {dsml_icons.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="group p-1 relative"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      title={item.alt}
                      width={80}
                      height={80}
                      className="w-12 sm:w-14 p-2 m-1 border-2 border-[#c7061c] rounded-xl shadow-md backdrop-blur-sm transition-all hover:shadow-red-400"
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-all rounded-xl blur-sm pointer-events-none" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-left text-[#c7061c] mt-6 transformers"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-4xl font-bold">Data Science &</div>
                <div className="text-4xl font-bold">Machine Learning</div>
                <div className="text-3xl font-semibold">Engineer</div>
              </motion.div>
            </motion.div>
          </div>
        </Tilt>
      </div>
    </div>
  )
}

export default MainFC
