'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function GlitchImage() {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const glitchCycle = async () => {
      for (let i = 0; i < 3; i++) {
        setGlitch(true)
        await new Promise((r) => setTimeout(r, 300)) // glitch duration
        setGlitch(false)
        await new Promise((r) => setTimeout(r, 2000)) // wait before next glitch
      }
    }
    glitchCycle()
  }, [])

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1 }}
      className={`glitch-wrapper ${glitch ? 'glitch' : ''}`}
    >
      <Image
        src="/me-nobg.png"
        alt="*****"
        width={400}
        height={400}
        className="glitch-img lg:w-[330px] w-[220px]"
        priority
      />
    </motion.div>
  )
}
