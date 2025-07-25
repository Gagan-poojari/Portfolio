'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'

const NavBar = () => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { id: 1, name: 'GITHUB', path: '/' },
    { id: 2, name: 'INSTAGRAM', path: '/syllabus' },
    { id: 3, name: 'LINKEDIN', path: '/pyqpapers' },
    { id: 4, name: 'BLOG', path: '/coe' },
  ]

  return (
    <nav className='w-full z-50 transition-all duration-300 navshad fixed top-0'>
      <div className={`flex gap-10 p-4  items-center justify-center text-xl text-[#000000] ${isSticky ? 'bg-[#ffffffa5] backdrop-blur-md' : ''}`}>
        {links.map((item) => (
          <Link href={item.path} key={item.id}>
            <div className='flex flex-col'>
              <span className='befaft smooth relative hover:text-[#000000] font-semibold text-[18px]'>
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default NavBar
