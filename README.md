# You Are the Internet

A scrollable journey through the history of the web — from ARPANET in 1969 
to Web3 today. Built for Frontend Odyssey: The Interactive Web Experience 
Challenge.

## Concept

Most sites tell the story of the internet. This one becomes it.

Every section rewrites the entire visual identity of the page — fonts, 
colors, background, cursor, and sound — using a single data-era attribute 
on the body tag driven by IntersectionObserver. Scrolling is time travel.

## The 5 Eras

- **1969 — ARPANET**: Black screen, green monospace text typing itself out, 
  custom terminal cursor tracked by JS. The internet began with a typo.
- **1994 — Dot-com**: Electric blue, Comic Sans, marquee banners, a visitor 
  counter at 4,294,967,295, and cascading fake popups. Every bad design 
  choice is deliberate.
- **2006 — Social Media**: A mock social feed with an accelerating like 
  button. Three phases — satisfying, urgent, then overwhelming. A silent 
  critique of dopamine loop design.
- **2015 — Mobile Internet**: A two-column layout with a real phone frame. 
  Toggle between portrait and landscape to feel what it meant when five 
  billion people joined the web from a pocket-sized screen.
- **2023 — Web3**: Glassmorphism cards, drifting particles, animated 
  gradient. The personal closing chapter.

## Technical Highlights

- **Era switching engine**: IntersectionObserver writes data-era to body. 
  CSS variables cascade instantly across the entire page. One attribute 
  controls five complete visual themes.
- **Glitch transition**: CSS keyframe animation hard-capped at exactly 600ms 
  via setTimeout. Fires once on ARPANET → Dot-com crossing.
- **Web Audio API sound design**: All sounds procedurally generated. No 
  audio files. Zero network requests for audio. Triggered only by user 
  gestures, never on scroll or load.
- **Accelerating likes**: Three distinct phases built on a single click 
  counter. The interaction critiques social media design without saying a 
  word.
- **Phone frame toggle**: Portrait to landscape transition using CSS 
  height and width animated with cubic-bezier timing. The restriction 
  is the story.

## The Personal Story

Two weeks before this hackathon I built TrustSplit — a bill-splitting 
application on the blockchain. Not because it was easy. Because the old 
web asked you to trust a company. The new web asks you to trust math.

I built this site to understand how we got here. Every era on this page 
was someone's vision of the future. The Web3 section is mine.

## Built With

- HTML5, CSS3, Vanilla JavaScript
- GSAP + ScrollTrigger for scroll-based reveals
- Web Audio API for procedural sound design
- IntersectionObserver API for era detection
- Node.js + Express as local development server
- Deployed on GitHub Pages

## Live URL

https://kashyapanand21.github.io/you-are-the-internet/

## Author

Anand Kashyap 
Frontend Odyssey Hackathon 2025