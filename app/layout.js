import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Gagan Poojari",
  description:
    "Portfolio of Gagan Poojari - Full-Stack Web Developer, MLOps Engineer, and Open Source Contributor. Showcasing expertise in Next.js, React, Tailwind CSS, MongoDB, Docker, Kubernetes, and scalable AI-driven solutions.",
  icons: {
    icon: "/favicon.svg",
  },
  keywords: [
    "Gagan Poojari",
    "Full Stack Developer",
    "MLOps Engineer",
    "Next.js Developer",
    "React Developer",
    "Tailwind CSS",
    "MongoDB",
    "Machine Learning",
    "Open Source Contributor",
    "Docker",
    "Kubernetes",
    "Web Development Portfolio"
  ],
  authors: [{ name: "Gagan Poojari" }],
  openGraph: {
    title: "Gagan Poojari | Full-Stack Developer & MLOps Engineer",
    description:
      "Explore the portfolio of Gagan Poojari - crafting modern web applications, AI solutions, and scalable cloud-native systems.",
    url: "https://gaganpoojari-portfolio.vercel.app/",
    siteName: "Gagan Poojari",
    images: [
      {
        url: "/projects/portfolio.png",
        width: 1200,
        height: 630,
        alt: "Gagan Poojari Portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
