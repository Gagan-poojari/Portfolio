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
    url: 'https://www.linkedin.com/in/gagan-poojari',
    icon: <FaLinkedin />,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/your-handle',
    icon: <FaTwitter />,
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/your-handle',
    icon: <FaInstagram />,
  },
];

// const SlideBar = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.6, ease: 'easeOut' }}
//       className="fixed top-1/3 right-0 z-50 hidden lg:flex flex-col gap-6 p-4 rounded-l-2xl bg-black/20 backdrop-blur-sm border border-white/50 customshadow"
//     >
//       {socials.map((social, index) => (
//         <motion.a
//           key={index}
//           href={social.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           title={social.name}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             delay: index * 0.1 + 0.3,
//             duration: 0.1,
//             ease: 'easeOut',
//           }}
//           whileHover={{
//             scale: 1.3,
//             rotate: [0, 5, -5, 0],
//             boxShadow: '0 0 15px rgba(0,0,0,0.25)',
//           }}
//           whileTap={{ scale: 0.95 }}
//           className="text-black text-2xl p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
//         >
//           {social.icon}
//         </motion.a>
//       ))}
//     </motion.div>
//   );
// };

// const SlideBar = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -30 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.6, ease: 'easeOut' }}
//       className="fixed top-1/3 right-0 z-50 hidden lg:flex flex-col gap-6 p-4 rounded-l-3xl bg-[#f0f0f3] border border-[#e0e0e0] shadow-neomorph-light"
//     >
//       {socials.map((social, index) => (
//         <motion.a
//           key={index}
//           href={social.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           title={social.name}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{
//             delay: index * 0.1 + 0.3,
//             duration: 0.1,
//             ease: 'easeOut',
//           }}
//           whileHover={{
//             scale: 1.15,
//             rotate: [0, 3, -3, 0],
//             boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff',
//           }}
//           whileTap={{ scale: 0.95 }}
//           className="text-[#555] text-2xl p-3 bg-[#f0f0f3] rounded-full shadow-neomorph-inset transition-all duration-300"
//         >
//           {social.icon}
//         </motion.a>
//       ))}
//     </motion.div>
//   );
// };

const SlideBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-1/3 right-0 z-50 hidden lg:flex flex-col gap-6 p-4 rounded-l-xl inset-shadow bg-[#f0f0f3] border border-[#e0e0e0] shadow-neomorph-light"
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
