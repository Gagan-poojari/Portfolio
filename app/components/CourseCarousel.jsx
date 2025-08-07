'use client'
import Image from 'next/image'
import Link from 'next/link'

const courses = [
  {
    id: 1,
    src: '/assets/coursera_ml_course.svg',
    alt: 'Supervised ML by Stanford',
    link: 'https://www.coursera.org/account/accomplishments/specialization/CC56MG0KYTMX',
    by: 'Stanford University'
  },
  {
    id: 2,
    src: '/assets/coursera_course1.svg',
    alt: 'Machine Learning Basics',
    link: 'https://www.coursera.org/account/accomplishments/specialization/CC56MG0KYTMX',
    by: 'DeepLearning.AI'
  },
  {
    id: 3,
    src: '/assets/coursera_course2.svg',
    alt: 'AI for Everyone',
    link: 'https://www.coursera.org/account/accomplishments/verify/XQDG7QNOVJGF',
    by: 'DeepLearning.AI'
  },
  {
    id: 4,
    src: '/assets/coursera_course3.svg',
    alt: 'Deep Learning Intro',
    link: 'https://www.coursera.org/account/accomplishments/verify/NPRA1XKJR153',
    by: 'DeepLearning.AI'
  }
]

const CourseCarousel = () => {
  return (
    <section className="w-full bg-[#000000] py-10 px-4 overflow-hidden">

      <p className="mb-3 text-xs font-normal tracking-widest text-center text-black/80 dark:text-white/70 uppercase md:text-sm">
        Courses & Certifications (click to verify)
      </p>

      <div className="relative w-full overflow-hidden">
        <div className="animate-slide flex w-max gap-6">
          {[...courses, ...courses].map(({ id, src, alt, by, link }, index) => (
            <Link
              href={link}
              key={`${id}-${index}`}
              target="_blank"
              className="min-w-[360px] md:min-w-[420px] rounded-xl p-5 flex flex-col items-center gap-4 bg-white/5 backdrop-blur-sm 
        transition-all duration-300 group shadow-[inset_0_0_40px_#ffffff15] hover:shadow-[inset_0_0_80px_#ffffff30] border-2 border-[#ffffff15] hover:border-[#ffffff30]"
            >
              <Image
                src={src}
                alt={alt}
                width={200}
                height={180}
                className="rounded-md w-[300px] lg:w-[320px]"
              />
              <div className="text-center text-white">
                <h4 className="text-lg font-semibold">{alt}</h4>
                <p className="text-sm text-white/70">{by}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  )
}

export default CourseCarousel
