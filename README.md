# Gagan Poojari — Portfolio

Personal portfolio site for **Gagan Poojari**, a full-stack web developer, MLOps engineer, and open-source contributor. The site showcases projects, skills, certifications, and a contact form in a cinematic dark UI with scroll-driven animations and a WebGL star-field background.

**Live site:** [gaganpoojari-portfolio.vercel.app](https://gaganpoojari-portfolio.vercel.app/)

## What's on the site

| Section | Description |
| --- | --- |
| **Hero** | Intro with glitch-style text effects, parallax profile image, and MERN / data-science tech icons |
| **Skills** | Filterable skill grid across ML & AI, DevOps & MLOps, Backend, Frontend, and Tools |
| **Courses** | Interactive carousel of verified Coursera certifications (Stanford, DeepLearning.AI) |
| **Projects** | Horizontal scroll showcase of 8 projects with live demos, GitHub links, stack tags, and detail panels |
| **Contact** | Email form powered by EmailJS, plus GitHub and LinkedIn links |

Navigation includes a sticky navbar with section anchors, a command-palette-style quick menu, a fixed social sidebar, and a downloadable resume (`/resume.pdf`).

## Featured projects

- **RUVA** — Full-stack e-commerce for traditional Indian ethnic wear
- **Pleeb** — AI video auto-censorship with Whisper and FFmpeg
- **MLOps Pipeline** — End-to-end sentiment analysis with DVC, MLflow, and Prometheus
- **Namma Benaka** — Loan management fintech platform
- **HOLMAC Interiors** — Interior design marketing site
- **FICE** — Institute enrollment website
- **Sri Udupi Food Hub** — Restaurant site with flipbook digital menu
- **Portfolio** — This site

## Tech stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) with React 19
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/), Swiper, react-parallax-tilt
- **3D / Canvas:** WebGL star background, React Three Fiber
- **Contact:** [EmailJS](https://www.emailjs.com/)
- **Deploy:** [Vercel](https://vercel.com/)

## Getting started

### Prerequisites

- Node.js 18+
- npm (or yarn / pnpm / bun)

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # run ESLint
```

## Environment variables

The contact form requires EmailJS credentials. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

Without these variables, the rest of the site works normally; only the contact form submission will fail.

## Project structure

```
app/
├── page.js              # Main page — assembles all sections
├── layout.js            # Root layout, metadata, fonts
├── globals.css          # Global styles and CSS variables
└── components/
    ├── MainFC.jsx       # Hero / intro section
    ├── NavBar.jsx       # Navigation and command palette
    ├── SideBar.jsx      # Fixed social links
    ├── StarBG.jsx       # WebGL animated star background
    ├── SkillsSection.jsx
    ├── CourseCarousel.jsx
    ├── ProjectSection.jsx
    └── Contact.jsx
public/
├── resume.pdf
├── projects/            # Project screenshots
└── assets/              # Certification badges
```

## Author

**Gagan Poojari**

- GitHub: [@Gagan-poojari](https://github.com/Gagan-poojari)
- LinkedIn: [gagan-poojari](https://www.linkedin.com/in/gagan-poojari-840744319/)

## License

This project is private. All rights reserved.
