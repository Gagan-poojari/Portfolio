'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';

const navLinks = [
  { name: 'Skills', href: '#skills' },
  { name: 'Courses', href: '#courses' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!isOpen && window.scrollY > 20) {
        setShouldCollapse(true);
      } else if (window.scrollY <= 20) {
        setShouldCollapse(false);
      }

      if (isOpen && window.scrollY > 20) {
        setIsOpen(false);
        setShouldCollapse(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  const wrapperVariants = {
    expanded: {
      width: '100%',
      height: 'auto',
      borderRadius: '1.5rem',
      padding: '1.25rem',
      top: 0,
      left: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    collapsed: {
      width: '3rem',
      height: '3rem',
      // borderRadius: '9999px',
      padding: '0rem',
      top: '1rem',
      left: '1rem',
      // transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      variants={wrapperVariants}
      initial="expanded"
      animate={shouldCollapse && !isOpen ? 'collapsed' : 'expanded'}
      className="fixed z-50 max-w-full"
      style={{ position: 'fixed' }}
    >
      <motion.div
        layout
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className={`flex items-center justify-between text-white backdrop-blur-md border border-white/10 rounded-full ${
          shouldCollapse && !isOpen
            ? 'aspect-square p-0 justify-center items-center border border-[#fff]/60'
            : 'px-6 py-3'
        }`}
      >
        {!shouldCollapse || isOpen ? (
          <>
            <Link href="/">
              <img src={"/sign.svg"} alt="Gagan Poojari" className='w-[69px] lg:w-[88px] h-10 object-cover' />
            </Link>
            <div className="gap-10 lg:flex md:flex hidden items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative text-md font-medium text-muted-foreground transition hover:text-white"
                >
                  <span className="relative group">
                    {link.name}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-[#fff] transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </div>
            <button
              className={`lg: text-xl text-white ${isOpen ? "" : "hidden"}`}
              onClick={() => setIsOpen(false)}
            >
              <FaTimes />
            </button>
          </>
        ) : (
          <button
            className="text-xl text-white flex justify-center items-center w-full h-full rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <FaBars />
          </button>
        )}
      </motion.div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden backdrop-blur-md lg:hidden border border-white/10 rounded-xl mt-2"
          >
            <div className="flex flex-col items-center px-6 py-4 space-y-4 text-white">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-muted-foreground hover:text-white transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NavBar;
