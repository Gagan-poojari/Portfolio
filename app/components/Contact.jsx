'use client';
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Contact = () => {
    const formRef = useRef();
    const [status, setStatus] = useState('');

    const socials = [
        {
            name: 'GitHub2',
            url: 'https://github.com/Gagan-poojari',
            icon: <FaGithub />,
        },
        // {
        //     name: 'GitHub2',
        //     url: 'https://github.com/Gagan-poojari',
        //     icon: <FaGithub />,
        // },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/in/gagan-poojari-840744319/',
            icon: <FaLinkedin />,
        },
        // {
        //     name: 'Instagram',
        //     url: 'https://www.instagram.com/gagan__poojari',
        //     icon: <FaInstagram />,
        // },
    ];
    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('sending');

        emailjs
            .sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                formRef.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            )
            .then(
                () => {
                    setStatus('success');
                    toast.success('Message sent successfully!');
                    formRef.current.reset();
                },
                () => {
                    setStatus('error');
                    toast.error('Something went wrong. Please try again.');
                }
            );
    };

    return (
        <section id="contact" className="relative px-6 py-20 text-white lg:max-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="mx-auto text-center p-5 lg:p-0"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                    LET ' S &nbsp; CONNECT
                </h2>
                <p className="text-gray-400 mb-12">
                    FIND ME INTERESTING? DROP A MESSAGE!
                </p>

                <form ref={formRef} onSubmit={sendEmail} className="flex flex-col lg:w-[500px] gap-6 border-2 border-[#ffffff1a] p-6 rounded-xl backdrop-blur-sm">
                    <input
                        type="text"
                        name="from_name"
                        placeholder="Your Name"
                        required
                        className="bg-transparent border border-white/10 px-4 py-3 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <input
                        type="email"
                        name="from_email"
                        placeholder="Your Email"
                        required
                        className="bg-transparent border border-white/10 px-4 py-3 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <textarea
                        name="message"
                        rows="5"
                        placeholder="Your Message"
                        required
                        className="bg-transparent border border-white/10 px-4 py-3 rounded-md placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                    />
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-md font-semibold"
                    >
                        {status === 'sending'
                            ? 'Sending...'
                            : status === 'success'
                                ? 'Message sent successfully'
                                : status === 'error'
                                    ? 'Failed to send the message'
                                    : 'Send Message'}
                    </motion.button>
                </form>
            </motion.div>


            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex gap-5 lg:hidden justify-center"
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
                        className="text-[#555] text-xl p-3 bg-[#000000] rounded-full border border-[#ffffff69] transition-all duration-300 hover:text-[#ffffff]"
                    >
                        {social.icon}
                    </motion.a>
                ))}
            </motion.div>

        </section>
    );
};

export default Contact;
