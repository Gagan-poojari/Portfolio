'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import Image from 'next/image'

const HeroSection = () => {
  const [textIndex, setTextIndex] = useState(0)
  const phrases = ['MERN Developer', 'ML Engineer', 'Open Source Contributor']
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = phrases[textIndex % phrases.length]
    const timeout = setTimeout(() => {
      setDisplayed((prev) =>
        isDeleting ? currentPhrase.substring(0, prev.length - 1) : currentPhrase.substring(0, prev.length + 1)
      )
      if (!isDeleting && displayed === currentPhrase) {
        setIsDeleting(true)
        setTimeout(() => {}, 1000)
      } else if (isDeleting && displayed === '') {
        setIsDeleting(false)
        setTextIndex((prev) => prev + 1)
      }
    }, isDeleting ? 50 : 100)

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, textIndex])

  const icons = [
    '/icons/mern-icons/reactjs-icon.png',
    '/icons/mern-icons/nextjs-icon.png',
    '/icons/dsml-icons/docker-icon.webp',
    '/icons/mern-icons/mongodb-icon.webp',
    '/icons/dsml-icons/scikit-learn-icon.png',
    '/icons/dsml-icons/kubernetes-icon.png',
  ]

  return (
    <div className="lg:min-h-screen w-full bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-4 py-20">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#297bc9]/10 via-transparent to-[#c7061c]/10" />

      <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} glareEnable={true} glareMaxOpacity={0.2}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center text-center relative z-10"
        >
          <div className="relative w-40 h-40 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6">
            <Image src="/me.jpg" alt="me" fill className="object-cover grayscale hover:grayscale-0 transition" />
          </div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#297bc9] to-[#c7061c] bg-clip-text text-transparent"
          >
            Gagan Poojari
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-xl sm:text-2xl text-white/80 h-10"
          >
            {displayed}
            <span className="animate-pulse">|</span>
          </motion.p>

          <div className="mt-10 flex flex-wrap justify-center gap-4 px-4">
            {icons.map((icon, idx) => (
              <motion.div
                key={idx}
                className="w-12 h-12 sm:w-14 sm:h-14 p-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-md shadow-md hover:shadow-[#297bc9] transition"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Image src={icon} alt="icon" width={40} height={40} className="object-contain" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Tilt>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 text-sm text-white/40 animate-bounce"
      >
        Scroll ↓
      </motion.div>
    </div>
  )
}

export default HeroSection
