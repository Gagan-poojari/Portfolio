'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const socials = [
  {
    name: 'GitHub',
    url: 'https://github.com/Gagan-poojari',
    icon: <FaGithub />,
  },
  {
    name: 'LinkedIn',   
    url: 'https://www.linkedin.com/in/gagan-poojari-840744319/',
    icon: <FaLinkedin />,
  },
  // {
  //   name: 'Twitter',
  //   url: 'https://twitter.com/your-handle',
  //   icon: <FaTwitter />,
  // },
  // {
  //   name: 'Instagram',
  //   url: 'https://instagram.com/your-handle',
  //   icon: <FaInstagram />,
  // },
];

const SlideBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed bottom-0 right-0 z-50 hidden lg:flex flex-col gap-6 p-4 rounded-t-xl inset-shadow bg-[#f0f0f3] border border-[#e0e0e0] shadow-neomorph-light"
    >
      {socials.map((social, index) => (
        <motion.a
          key={index}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          title={social.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1 + 0.3,
            duration: 0.1,
            ease: 'easeOut',
          }}
          className="text-[#555] text-2xl p-3 bg-[#f0f0f3] rounded-full shadow-neomorph-icon transition-all duration-300 hover:text-[#000000]"
        >
          {social.icon}
        </motion.a>
      ))}
    </motion.div>
  );
};

export default SlideBar;
