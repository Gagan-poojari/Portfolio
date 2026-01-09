import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ProjectSection = () => {

  const ProjectsData = {
    PleebTechStack: [
      { name: 'Python', icon: 'https://cdn.simpleicons.org/python' },
      { name: 'Streamlit', icon: 'https://cdn.simpleicons.org/streamlit' },
      { name: 'Whisper', icon: '/icons/skills-icons/whisper-icon.webp' }, // custom path
      { name: 'FFmpeg', icon: '/icons/skills-icons/ffmpeg-icon.png' },
      { name: 'MoviePy', icon: '/icons/skills-icons/moviepy-icon.png' },
      { name: 'OpenAI', icon: 'https://cdn.simpleicons.org/openai' },
      { name: 'Regex', icon: '/icons/skills-icons/regex-icon.png' },
      { name: 'Pandas', icon: 'https://cdn.simpleicons.org/pandas' },
      { name: 'Numpy', icon: 'https://cdn.simpleicons.org/numpy' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github/white' },
      // { name: 'Docker', icon: 'https://cdn.simpleicons.org/docker' },
      // { name: 'Linux', icon: 'https://cdn.simpleicons.org/linux' },
    ],
    SufhTechStack: [
      { name: 'ReactJS', icon: 'https://cdn.simpleicons.org/react' },
      // { name: 'NodeJS', icon: 'https://cdn.simpleicons.org/nodejs' },
      // { name: 'ExpressJS', icon: 'https://cdn.simpleicons.org/express' },
      { name: 'NextJS', icon: 'https://cdn.simpleicons.org/nextdotjs' },
      { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
      { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'SwiperJS', icon: 'https://cdn.simpleicons.org/swiper' },
      { name: 'Frame Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'Google Maps', icon: 'https://cdn.simpleicons.org/googlemaps' },
      { name: 'Git', icon: 'https://cdn.simpleicons.org/git' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github' },
      { name: 'EmailJS', icon: 'https://cdn.simpleicons.org/emailjs' },
    ],
    FiceTechStack: [
      { name: 'ReactJS', icon: 'https://cdn.simpleicons.org/react' },
      { name: 'NextJS', icon: 'https://cdn.simpleicons.org/nextdotjs' },
      { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
      { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'SwiperJS', icon: 'https://cdn.simpleicons.org/swiper' },
      { name: 'Frame Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'Git', icon: 'https://cdn.simpleicons.org/git' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github' },
      { name: 'EmailJS', icon: 'https://cdn.simpleicons.org/emailjs' },
    ],
    NammaBenakaTechStack: [
      { name: 'ReactJS', icon: 'https://cdn.simpleicons.org/react' },
      { name: 'NextJS', icon: 'https://cdn.simpleicons.org/nextdotjs' },
      { name: 'NodeJS', icon: 'https://cdn.simpleicons.org/nodejs' },
      { name: 'ExpressJS', icon: 'https://cdn.simpleicons.org/express' },
      { name: 'MongoDB', icon: 'https://cdn.simpleicons.org/mongodb' },
      { name: 'Mongoose', icon: 'https://cdn.simpleicons.org/mongoose' },
      { name: 'JWT', icon: 'https://cdn.simpleicons.org/jsonwebtokens' },
      { name: 'Axios', icon: 'https://cdn.simpleicons.org/axios' },
      { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
      { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'Git', icon: 'https://cdn.simpleicons.org/git' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github' },
    ],

    PortfolioTechStack: [
      { name: 'ReactJS', icon: 'https://cdn.simpleicons.org/react' },
      { name: 'NextJS', icon: 'https://cdn.simpleicons.org/nextdotjs' },
      { name: 'Tailwind CSS', icon: 'https://cdn.simpleicons.org/tailwindcss' },
      { name: 'Framer Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'SwiperJS', icon: 'https://cdn.simpleicons.org/swiper' },
      { name: 'Frame Motion', icon: 'https://cdn.simpleicons.org/framer' },
      { name: 'ParallaxJS', icon: 'https://cdn.simpleicons.org/parallax' },
      { name: 'Git', icon: 'https://cdn.simpleicons.org/git' },
      { name: 'GitHub', icon: 'https://cdn.simpleicons.org/github' },
      { name: 'EmailJS', icon: 'https://cdn.simpleicons.org/emailjs' },
    ]
  }

  const PleebData = {
    title: 'Pleeb - MemeTheMess',
    description:
      'Built Pleeb, a personal project and a Streamlit-powered video content tool that helps contents creators by transcribing, censoring, and meme audio cussing using Whisper and custom overlays.',
    features: [
      'Developed with Python and Streamlit for fast, interactive app UI.',
      'Integrated OpenAI Whisper for accurate speech transcription.',
      'Used MoviePy and FFmpeg for precise audio/video manipulation.',
      'Used regex for keyword censors.',
      'Enabled auto and manual keyword censoring using regular expressions.',
      'Overlaid meme sounds, bleeps, or silences for censored words.',
      'Supports uploading and processing of MP4 files with real-time feedback.',
      'Modular code with CLI and Streamlit interface support.',
      'Clean UI with keyword table editor and download/export support.',
    ],
  };

  const SufhData = {
    title: 'Sri Udupi Food Hub',
    description:
      "Built Sri Udupi Food Hub, a solo-freelance restaurant website project that is meticulously designed in accordance to the beautiful culture and flavours of Udupi cuisine.",
    features: [
      'Developed with React, Node.js, and Express.js to create a dynamic and responsive user interface.',
      'Utilized Tailwind CSS for efficient styling and responsive design.',
      'Implemented Next.js for efficient server-side rendering and routing.',
      'Used Optical Character Recognition (OCR) to extract menu text from menu card images.',
      'Used Pexels API to fetch high-quality images for the website.',
      'Integrated maps with react-leaflet to display location information and haversine to fetch distance.',
      'Utilized Framer Motion for smooth animations and transitions.',
      'Utilized Git for version control and collaboration.',
      'Integrated EmailJS for contact form functionality.',
    ],
  };

  const FiceData = {
    title: 'Fortune Institute of Computer Education',
    description:
      "Built Fortune Institute of Computer Education, a joint-freelance project alongside a friend to connect students and teachers through a secure and user-friendly platform.",
    features: [
      'Developed with React, Node.js, and Express.js to create a dynamic and responsive user interface.',
      'Utilized Tailwind CSS for efficient styling and responsive design.',
      'Implemented Next.js for efficient server-side rendering and routing.',
      'Utilized Framer Motion for smooth animations and transitions.',
      'Utilized Git for version control and collaboration.',
    ],
  };

  const NammaBenakaData = {
    title: 'NammaBenaka - Smarter Loan Management Platform',
    description:
      'Built NammaBenaka, a full-stack fintech platform focused on simplifying loan access for individuals and businesses through a fast, transparent, and user-centric digital experience.',
    features: [
      'Designed and developed a full-stack loan management platform using React, Next.js, Node.js, and Express.',
      'Implemented secure authentication and role-based authorization using JWT.',
      'Integrated MongoDB with Mongoose for structured, scalable financial data handling.',
      'Built clean and intuitive dashboards for users and administrators.',
      'Focused on trust-first UI/UX for financial credibility and ease of use.',
      'Created a responsive, mobile-first interface using Tailwind CSS.',
      'Used Axios for efficient and secure client–server communication.',
      'Applied Framer Motion for subtle, professional UI animations.',
    ],
  };


  const PortfolioData = {
    title: 'Portfolio - A website about me',
    description:
      "Built a personal portfolio project to showcase my skills, projects, couses completes and experiences with the motive to connect with the world and build a successful career.",
    features: [
      'Built a personal portfolio website using React, Next.js, and Tailwind CSS.',
      'Implemented Next.js for efficient server-side rendering and routing.',
      'Utilized Framer Motion for smooth animations and transitions.',
      'Utilized various frontend frameworks and libraries and tools.',
      'Utilized Git for version control and collaboration.',
      'Integrated EmailJS for contact form functionality.',
    ],
  };


  return (
    <section id="projects" className="relative w-full py-10 bg-[#000000] ">
      <h2
        style={{
          textShadow:
            '0px 4px 8px rgba(255,255,255,.05),0px 8px 30px rgba(255,255,255,.25)',
        }}
        className="relative z-2 mb-10 text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl text-balance text-center"
      >
        <p className="mb-3 text-xs font-normal tracking-widest text-[#fff] dark:text-white/70 uppercase md:text-sm">
          BUILT WITH A PURPOSE
        </p>
        <span className='text-[#fff]'>
          <span>MY &nbsp;</span>
          <span className="text-colorfull animate-gradient-x font-nyght tracking-wide ">
            PROJECTS
          </span>
        </span>
      </h2>

      <div className="relative mx-auto flex w-full">
        <div className="mx-auto grid grid-cols-1 gap-x-6 p-5 lg:p-0 gap-y-6 md:grid-cols-2 lg:flex lg:max-w-[85%] lg:flex-col lg:gap-y-24">

          <div className='flex text-[#fff] items-center gap-10'>
            <ProjectCard
              href="https://pleeb-meme-the-mess.streamlit.app/"
              title="A platforn to make the lives of content creators and video editors easy, upload video and see the magic happen."
              imgSrc="/projects/pleeb.png"
              shadowColor="#DB2777"
              gradientBg="linear-gradient(188.62deg, #6B0D33 49.9%, #DB2777 81.7%, #F472B6 93.88%, #F9D793 113.5%)"
              textColor="text-pink-300"
            />
            <ProjectCardDesc
              href="https://pleeb-meme-the-mess.streamlit.app/"
              title={PleebData.title}
              description={PleebData.description}
              features={PleebData.features}
              techStack={ProjectsData.PleebTechStack}
            />
          </div>

          <div className='flex text-[#fff] items-center gap-10'>
            <ProjectCard
              href="https://github.com/Gagan-poojari/Sri-Udupi-Food-Hub/tree/main"
              title="A restaurant webiste meticulously designed in accordance to the beautiful culture and flavours of Udupi cuisine."
              imgSrc="/projects/sufh.png"
              shadowColor="#14B8A6"
              gradientBg="linear-gradient(188.62deg, #134E4A 49.9%, #14B8A6 81.7%, #5EEAD4 93.88%, #F9D793 113.5%)"
              textColor="text-teal-300"
            />
            <ProjectCardDesc
              href="https://github.com/Gagan-poojari/Sri-Udupi-Food-Hub/tree/main"
              title={SufhData.title}
              description={SufhData.description}
              features={SufhData.features}
              techStack={ProjectsData.SufhTechStack}
            />
          </div>

          <div className='flex text-[#fff] items-center gap-10'>
            <ProjectCard
              href="https://www.fortuneudupi.in/"
              title="A platform connecting students and instructors for enhanced learning experiences."
              imgSrc="/projects/fice.png"
              shadowColor="#2932CB"
              gradientBg="linear-gradient(188.62deg, #070E57 49.9%, #2932CB 81.7%, #7980FF 93.88%, #F9D793 113.5%)"
              textColor="text-blue-300"
            />
            <ProjectCardDesc
              href="https://www.fortuneudupi.in/"
              title={FiceData.title}
              description={FiceData.description}
              features={FiceData.features}
              techStack={ProjectsData.FiceTechStack}
            />
          </div>

          <div className="flex text-[#fff] items-center gap-10">
            <ProjectCard
              href="https://www.nammabenaka.in/"
              title="A full-stack loan management platform with secure authentication and modern UI."
              imgSrc="/projects/nammabenaka.png"
              shadowColor="#F97316"
              gradientBg="linear-gradient(188.62deg, #431407 49.9%, #F97316 81.7%, #FDBA74 93.88%, #F9D793 113.5%)"
              textColor="text-orange-300"
            />
            <ProjectCardDesc
              href="https://github.com/Gagan-poojari/mybenaka"
              title={NammaBenakaData.title}
              description={NammaBenakaData.description}
              features={NammaBenakaData.features}
              techStack={ProjectsData.NammaBenakaTechStack}
            />
          </div>


          <div className='flex text-[#fff] items-center gap-10'>
            <ProjectCard
              href="/projects/portfolio"
              title="Design Unleashed: A Captivating Portfolio Showcasing Innovative Web Development and UI/UX"
              imgSrc="/projects/portfolio.png"
              shadowColor="#DB2777"
              gradientBg="linear-gradient(188.62deg, #6B0D33 49.9%, #DB2777 81.7%, #F472B6 93.88%, #F9D793 113.5%)"
              textColor="text-pink-300"
            />
            <ProjectCardDesc
              href="/projects/portfolio"
              title={PortfolioData.title}
              description={PortfolioData.description}
              features={PortfolioData.features}
              techStack={ProjectsData.PortfolioTechStack}
            />
          </div>
        </div>
      </div>

      {/* <Link
        className="group flex w-fit items-center justify-center gap-2 text-[#747474] transition-colors hover:text-black dark:text-white-1 mx-auto md:mt-20"
        href="/projects"
      >
        See more projects
        <div className="size-[25px] overflow-hidden rounded-full border border-neutral-300 bg-white-1/50 transition-all duration-500 group-hover:bg-neutral-200 dark:border-white/10 dark:bg-white/5 dark:group-hover:bg-white/10">
          <div className="flex w-12 -translate-x-1/2 transition-transform duration-500 ease-in-out group-hover:translate-x-0">
            <span className="flex size-6">
              <ArrowIcon />
            </span>
            <span className="flex size-6">
              <ArrowIcon />
            </span>
          </div>
        </div>
      </Link> */}

    </section>
  );
};


const ProjectCardDesc = ({ href, title, description, features = [], techStack = [] }) => {
  return (
    <div className="hidden lg:sticky lg:block w-[60%] lg:max-h-[500px] lg:overflow-y-scroll custom-scrollbar1">
      <div className="sticky top-40">
        <div className="flex">
          <div className="flex flex-col items-start">
            <Link href={href} target="_blank" className=" flex items-center gap-5">
              <div aria-hidden="true" className="font-bold text-lg text-blue-700" > <FaExternalLinkAlt /> </div>
              <h3 className="text-foreground text-2xl font-bold ">{title}</h3>

            </Link>
            <p className="text-muted-foreground my-2 text-base font-light">{description}</p>

            <ul className="text-accent-foreground/85 mt-4 flex flex-col gap-y-2 text-base">
              {features.map((text, i) => (
                <li key={i} className="flex items-center text-sm">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mt-1 mr-2 size-5 shrink-0 fill-blue-600 text-blue-600 dark:text-blue-400 bg-blue-600/20 lg:bg-white-1 dark:lg:bg-black"
                  >
                    <path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z" />
                  </svg>
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3 text-sm">
              {techStack.map(({ name, icon }, i) => (
                <div key={i} style={{ opacity: 1, transform: 'none' }}>
                  <span
                    data-slot="badge"
                    className="inline-flex items-center justify-center rounded-lg border px-3 py-1 text-sm w-fit whitespace-nowrap shrink-0 gap-2 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow] overflow-hidden text-black dark:text-white border-white-3 dark:bg-neutral-900 dark:border-white/[0.14] bg-white-2"
                  >
                    <img height="16" width="16" src={icon} alt={name} />
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ href, title, imgSrc, gradientBg, shadowColor, textColor }) => (
  <div className="project-card flex w-full flex-row ">
    <div className="flex flex-col ">
      <a
        href={href}
        target="_blank"
        draggable={false}
        className="relative cursor-pointer overflow-hidden rounded-2xl border border-white-3 dark:border-white/15 bg-[#f2f2f20c] p-1.5 shadow-2xl lg:h-[560px] lg:rounded-3xl lg:p-2"
      >
        <div
          className="group relative flex size-full flex-col items-center justify-between overflow-hidden rounded-xl lg:rounded-2xl dark:bg-linear-to-b from-black/40 to-transparent transition-all duration-300"
        >
          <div style={{ background: gradientBg }} className="absolute inset-0 -z-1" />
          <div className="hidden w-full flex-row items-center justify-between px-12 py-8 lg:flex" style={{ color: textColor }}>
            <h3 className="max-w-[90%] text-2xl">{title}</h3>
            <ArrowIcon />
          </div>
          <Image
            alt={title}
            loading="lazy"
            width={1203}
            height={753}
            decoding="async"
            className="lg:group-hover:translsate-y-10 w-full max-w-[85%] translate-y-5 -rotate-3 rounded-t-lg border-[1.5px] border-white/20 transition-all duration-300 will-change-transform lg:block lg:rotate-0 lg:group-hover:scale-[1.08] lg:group-hover:-rotate-3"
            style={{ boxShadow: `0 0 30px ${shadowColor}` }}
            src={imgSrc}
          />
        </div>
      </a>
    </div>
  </div>
);

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-arrow-right m-auto size-[14px]"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default ProjectSection;
