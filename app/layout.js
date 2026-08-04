import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import MicrosoftClarity from './components/MicrosoftClarity';

// ── Google Fonts via next/font (self-hosted, preloaded, cross-browser safe) ──
const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: true,
});
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gagan-poojari.me'),
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
    url: "https://gagan-poojari.me",
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}

        {/* ── Vercel Analytics (page views, referrers, countries) ── */}
        <Analytics />

        {/* ── Microsoft Clarity (heatmaps + session recordings) ── */}
        <MicrosoftClarity />
      </body>

      {/* ── Google Analytics 4 (full traffic & event tracking) ── */}
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
