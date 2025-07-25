'use client'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-coverflow'
import Link from 'next/link'

const Part2 = () => {
    const coursesImg = [
        {
            id: 1,
            src: '/assets/coursera_ml_course.svg',
            alt: 'Supervised ML by Stanford',
            link: 'https://www.coursera.org/account/accomplishments/specialization/CC56MG0KYTMX',
            description: 'A flagship ML specialization by Stanford University and Andrew Ng, covering supervised learning algorithms like linear/logistic regression, decision trees, and neural networks. Includes hands-on projects using Python and real-world datasets to build scalable machine learning systems.'
        },
        {
            id: 2,
            src: '/assets/coursera_course1.svg',
            alt: 'Machine Learning Basics',
            link: 'https://www.coursera.org/account/accomplishments/specialization/CC56MG0KYTMX',
            description: 'A foundational dive into machine learning — explore data cleaning, model selection, overfitting, underfitting, and performance evaluation. Prepares you to understand and implement basic ML models using intuitive visualizations and practical assignments.'
        },
        {
            id: 3,
            src: '/assets/coursera_course2.svg',
            alt: 'AI for Everyone',
            link: 'https://www.coursera.org/account/accomplishments/verify/XQDG7QNOVJGF',
            description: 'A non-technical course led by Andrew Ng, designed to introduce AI concepts to product managers, executives, and enthusiasts. Discusses AI workflows, societal impact, ethical concerns, and how to navigate AI-powered product development across industries.'
        },
        {
            id: 4,
            src: '/assets/coursera_course3.svg',
            alt: 'Deep Learning Intro',
            link: 'https://www.coursera.org/account/accomplishments/verify/NPRA1XKJR153',
            description: 'An entry point into the world of deep learning. Learn about neural networks, backpropagation, activation functions, and modern architectures. Includes coding exercises to build simple feedforward and convolutional networks using Python frameworks.'
        }
    ]


    return (
        <div className="sm:min-h-screen flex flex-col items-center justify-center gap-10">
            <h1 className='text-4xl text-[#000000]'>Courses & Certifications</h1>
            <div className='p-9 bg-[#000000ea] asushad rounded-md'>
                
            <Swiper
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 30,
                    stretch: 0,
                    depth: 100,
                    modifier: 1.5,
                    slideShadows: true,
                }}
                autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                modules={[EffectCoverflow, Autoplay]}
                className="w-full max-w-4xl px-4 "
            >
                {/* {coursesImg.map(({ id, src, alt }) => (
                    <SwiperSlide key={id} className="max-w-[400px]">
                        <div className="group relative overflow-hidden rounded-lg shadow-xl transition-all duration-300 ">
                            <Image
                                src={src}
                                alt={alt}
                                width={280}
                                height={180}
                                className="rounded-md object-cover w-full"
                            />
                        </div>
                    </SwiperSlide>
                ))} */}
                {coursesImg.map(({ id, src, alt, description, link }) => (
                    <SwiperSlide key={id} className="max-w-[400px]">
                        <Link href={link} target="_blank" rel="noopener noreferrer">
                            <div className="smooth group relative overflow-hidden rounded-xl shadow-xl transition-all duration-300 cursor-pointer">
                                <Image
                                    src={src}
                                    alt={alt}
                                    width={400}
                                    height={250}
                                    className=" object-cover group-hover:brightness-50 transition duration-300"
                                />
                                
                                <div className="absolute inset-0 flex items-center justify-center p-4 bg-[#ffffff] group-hover:backdrop-blur-md opacity-0 group-hover:opacity-80 transition-all duration-300">
                                    <p className="text-sm text-center text-[#000000] tracking-wide leading-relaxed">
                                        {description}
                                    </p>
                                </div>
                                
                                </div>
                        </Link>
                    </SwiperSlide>
                    
                ))}

            </Swiper>
                </div>
        </div>
    )
}

export default Part2
