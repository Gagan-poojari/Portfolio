// import Image from 'next/image'
// import React from 'react'

// const Part1 = () => {
    
//     const mern_icons = [
//         { id: 1, src: '/icons/mern-icons/nextjs-icon.png', alt: 'Next.js' },
//         { id: 2, src: '/icons/mern-icons/reactjs-icon.png', alt: 'React.js' },
//         { id: 3, src: '/icons/mern-icons/expressjs-icon.png', alt: 'Express.js' },    
//         { id: 4, src: '/icons/mern-icons/git-icon.png', alt: 'Git' },
//         { id: 5, src: '/icons/mern-icons/mongodb-icon.webp', alt: 'MongoDB' },
//     ]

//     const dsml_icons = [
//         { id: 1, src: '/icons/dsml-icons/docker-icon.webp', alt: 'Docker' },
//         { id: 2, src: '/icons/dsml-icons/kubernetes-icon.png', alt: 'Kubernetes' },
//         // { id: 3, src: '/icons/dsml-icons/pandas-icon.png', alt: 'Pandas' },
//         // { id: 4, src: '/icons/dsml-icons/numpy-icon.png', alt: 'NumPy' },
//         { id: 5, src: '/icons/dsml-icons/scikit-learn-icon.png', alt: 'scikit-learn' },
//         // { id: 6, src: '/icons/dsml-icons/tensorflow-icon.png', alt: 'TensorFlow' },
//         // { id: 7, src: '/icons/dsml-icons/pytorch-icon.png', alt: 'PyTorch' },
//         // { id: 8, src: '/icons/dsml-icons/keras-icon.png', alt: 'Keras' },
//         { id: 9, src: '/icons/dsml-icons/prometheus-icon.png', alt: 'Prometheus' },
//         { id: 10, src: '/icons/dsml-icons/grafana-icon.webp', alt: 'Grafana' },
//         { id: 11, src: '/icons/dsml-icons/git-icon.webp', alt: 'Git' },
//     ]

//     return (
//         <div className='h-screen flex justify-center items-center'>

//             <div className='w-1/3 h-1/2'>

//                 <div className=' flex justify-end items-start'>
//                     <div className='flex flex-col transformers text-end text-[#297bc9]'>
//                         <div className='text-6xl '>MERN stack</div>
//                         <div className='text-4xl '>Developer</div>
//                     </div>
//                 </div>

//                 <div className='flex justify-end items-start mt-7'>
//                     {mern_icons.map((item, index) => (
//                         <Image 
//                         key={index}
//                         src={item.src}
//                         alt={item.alt}
//                         width={1000}
//                         height={1000}
//                         className='w-14 origin-center p-2 m-1 border-2 border-[#297bc9] border-double '
//                     />
//                     ))}
//                 </div>
//             </div>

//             <div className='h-screen flex justify-center items-center' >
//                 <Image
//                     src="/splitpersfc.jpg"
//                     alt="part1"
//                     width={1000}
//                     height={1000}
//                     className='w-[333px] origin-center'
//                 />
//             </div>
            

//             <div className='flex flex-col w-1/3 h-1/2'>

//                 <div className='mt-auto flex items-end flex-wrap'>
//                     {dsml_icons.map((item, index) => (
//                         <Image
//                             key={index}
//                             src={item.src}
//                             alt={item.alt}
//                             width={1000}
//                             height={1000}
//                             className='w-14 origin-center p-2 m-1 border-2 border-[#c7061c]'
//                         />
//                     ))}
//                 </div>

//                 <div className='flex items-end'>
//                     <div className='flex flex-col transformers text-start text-[#c7061c]'>
//                         <div className='text-6xl '>Data Science &</div>
//                         <div className='text-6xl '>Machine Learning</div>
//                         <div className='text-4xl '>Engineer</div>
//                     </div>
//                 </div>

//             </div>

//         </div>
//     )
// }

// export default Part1

'use client'
import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import GlitchImage from './GlitchImage'

const Part1 = () => {
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
    { id: 5, src: '/icons/dsml-icons/scikit-learn-icon.png', alt: 'scikit-learn' },
    { id: 9, src: '/icons/dsml-icons/prometheus-icon.png', alt: 'Prometheus' },
    { id: 10, src: '/icons/dsml-icons/grafana-icon.webp', alt: 'Grafana' },
    { id: 11, src: '/icons/dsml-icons/git-icon.png', alt: 'Git' },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="min-h-screen  flex flex-col lg:flex-row justify-center items-center gap-10 px-4 py-12">

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
          <div className="text-4xl sm:text-5xl font-bold">MERN stack</div>
          <div className="text-3xl sm:text-4xl font-semibold">Developer</div>
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
              className="p-1"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={80}
                height={80}
                className="w-12 sm:w-14 p-2 m-1 border-2 border-[#297bc9] border-double rounded-xl shadow-md bg-white/10 backdrop-blur-sm hover:shadow-blue-400 transition-all"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <div className="relative w-60 sm:w-72 md:w-80">
        <GlitchImage />
      </div>

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
              className="p-1"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={80}
                height={80}
                className="w-12 sm:w-14 p-2 m-1 border-2 border-[#c7061c] rounded-xl shadow-md bg-white/10 backdrop-blur-sm hover:shadow-red-400 transition-all"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-left text-[#c7061c] mt-6 transformers"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-4xl sm:text-5xl font-bold">Data Science &</div>
          <div className="text-4xl sm:text-5xl font-bold">Machine Learning</div>
          <div className="text-3xl sm:text-4xl font-semibold">Engineer</div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Part1
