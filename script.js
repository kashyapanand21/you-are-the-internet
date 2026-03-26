/* ============================================
   YOU ARE THE INTERNET — script.js
   ============================================ */

// ── BOOT: set default era before observer fires ──
document.body.dataset.era = 'arpanet';

/* ============================================
   CUSTOM CURSOR — ARPANET ERA ONLY
   ============================================ */
const customCursor = document.getElementById('custom-cursor');

document.addEventListener('mousemove', (e) => {
  if (customCursor) {
    customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    customCursor.style.visibility = 'visible';
  }
});

// Hide when mouse leaves browser window
document.addEventListener('mouseleave', () => {
  if (customCursor) {
    customCursor.style.visibility = 'hidden';
  }
});

// Show again when mouse re-enters
document.addEventListener('mouseenter', () => {
  if (customCursor) {
    customCursor.style.visibility = 'visible';
  }
});

/* ============================================
   1. IntersectionObserver — ERA SWITCHING
      This is the engine of the entire project.
      When a section hits 30% visibility, it
      writes data-era to body and updates timeline.
   ============================================ */
const sections = document.querySelectorAll('.era-section');
const timelineMarkers = document.querySelectorAll('.timeline-marker');

let currentEra = 'arpanet';
let userHasInteracted = false;

// Set flag on first user gesture anywhere on the page
document.addEventListener('click', () => {
  userHasInteracted = true;
  if (audioCtx) audioCtx.resume();
}, { once: false });

document.addEventListener('keydown', () => {
  userHasInteracted = true;
  if (audioCtx) audioCtx.resume();
}, { once: false });

const sectionRatios = new Map();

const eraObserver = new IntersectionObserver((entries) => {
  // Update the visibility ratio for each section that changed
  entries.forEach(entry => {
    sectionRatios.set(entry.target, entry.intersectionRatio);
  });

  // Find whichever section is currently most visible
  let maxRatio = 0;
  let dominantSection = null;

  sectionRatios.forEach((ratio, section) => {
    if (ratio > maxRatio) {
      maxRatio = ratio;
      dominantSection = section;
    }
  });

  if (dominantSection && maxRatio > 0.1) {
    const era = dominantSection.dataset.era;
    if (era && era !== currentEra) {
      switchEra(era, currentEra);
      currentEra = era;
    }
  }
}, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });

sections.forEach(section => eraObserver.observe(section));

let glitchFired = false;

function switchEra(newEra, oldEra) {
  document.body.dataset.era = newEra;

  timelineMarkers.forEach(marker => {
    marker.classList.toggle('active', marker.dataset.eraMarker === newEra);
  });

  if (oldEra === 'arpanet' && newEra === 'dotcom' && !glitchFired) {
    glitchFired = true;
    triggerGlitch();
  }

  if (oldEra === 'dotcom' && newEra !== 'dotcom') {
    document.querySelectorAll('.fake-popup').forEach(p => p.remove());
    popupCount = 0;
  }
}

/* ============================================
   2. GLITCH TRANSITION
      Hard capped at 600ms. Non-negotiable.
   ============================================ */
function triggerGlitch() {
  document.body.classList.add('glitch-active');
  setTimeout(() => {
    document.body.classList.remove('glitch-active');
  }, 600);
}

/* ============================================
   3. ARPANET — Typing animation
   ============================================ */
const typedOutput = document.getElementById('typed-output');
const storyText = `ARPANET NODE 1 — UCLA
> CONNECTING TO NODE 2 — SRI...
> CONNECTED.

On October 29, 1969, the first message
ever sent over a network was "LO".

The system crashed before it could
finish typing "LOGIN".

The internet began with a typo.
`;

let charIndex = 0;
let typingStarted = false;

function typeNextChar() {
  if (charIndex < storyText.length) {
    const char = storyText[charIndex];
    typedOutput.textContent += char;
    charIndex++;

    // Only play sound for visible characters, not spaces or newlines
    if (char !== ' ' && char !== '\n' && userHasInteracted) {
      playTypingSound();
    }

    setTimeout(typeNextChar, Math.random() * 60 + 30);
  }
}

// Start typing when ARPANET section is visible
const arpanetObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !typingStarted) {
      typingStarted = true;
      setTimeout(typeNextChar, 800);
    }
  });
}, { threshold: 0.3 });

arpanetObserver.observe(document.getElementById('arpanet'));

// Allow ENTER key to scroll to next section
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && currentEra === 'arpanet') {
    document.getElementById('dotcom').scrollIntoView({ behavior: 'smooth' });
  }
});

/* ============================================
   4. TIMELINE BAR — progress bar
   ============================================ */
// Already handled inside switchEra() above.
// Timeline markers update every time an era switches.

/* ============================================
   5. DOT-COM — Fake popups
   ============================================ */
const clickHereBtn = document.getElementById('click-here-btn');
const popupContainer = document.getElementById('popup-container');
let popupCount = 0;

const popupMessages = [
  "You are the 1,000,000th visitor! CLICK OK to claim your prize!",
  "Your computer has 47 viruses! Click OK immediately!",
  "CONGRATULATIONS! You have won a FREE iPod!!",
  "Please install our toolbar for a BETTER experience!",
  "ERROR: Too many errors. Click OK to fix errors.",
];

function spawnPopup(triggerEl) {
  if (popupCount > 12) return; // safety cap
  popupCount++;

  const popup = document.createElement('div');
  popup.className = 'fake-popup';

  const maxX = window.innerWidth - 260;
  const maxY = window.innerHeight - 160;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  popup.style.left = x + 'px';
  popup.style.top  = y + 'px';

  const msg = popupMessages[Math.floor(Math.random() * popupMessages.length)];

  popup.innerHTML = `
    <div class="popup-title">
      <span>⚠ Alert</span>
      <span style="cursor:pointer" onclick="this.closest('.fake-popup').remove(); popupCount--;">✕</span>
    </div>
    <div class="popup-body">${msg}</div>
    <div class="popup-actions">
      <button class="popup-spawn-btn">OK</button>
      <button class="popup-spawn-btn">Cancel</button>
    </div>
  `;

  // Both OK and Cancel spawn more popups
  popup.querySelectorAll('.popup-spawn-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playClickSound();
      spawnPopup(btn);
      spawnPopup(btn);
    });
  });

  document.body.appendChild(popup);
  playClickSound();
}

if (clickHereBtn) {
  clickHereBtn.addEventListener('click', () => {
    spawnPopup(clickHereBtn);
  });
}

// Clean up popups when leaving dotcom era
// (handled in switchEra — not needed yet, add in polish pass)

/* ============================================
   6. SOCIAL — Accelerating Likes (3 phases)
   ============================================ */
const likeBtn = document.getElementById('like-btn');
const likeCount = document.getElementById('like-count');
let likes = 0;

if (likeBtn) {
  likeBtn.addEventListener('click', () => {
    likes++;

    // Phase 1: 1–5 clicks — normal, satisfying
    if (likes <= 5) {
      likeCount.textContent = likes;
      likeBtn.classList.add('liked');
      likeBtn.classList.remove('phase2', 'phase3');
      likeCount.style.filter = 'none';
      playLikeSound(400);
    }
    // Phase 2: 6–15 clicks — double increment, urgency builds
    else if (likes <= 30) {
      likes += 1;
      likeCount.textContent = likes;
      likeBtn.classList.add('phase2');
      likeBtn.classList.remove('phase3');
      likeCount.style.filter = 'none';
      playLikeSound(500 + (likes * 3));
    }
    // Phase 3: 30+ clicks — chaos, silence, blur, shake
    else {
      likes += Math.floor(Math.random() * 15 + 5);
      likeCount.textContent = likes;
      likeBtn.classList.add('phase3');
      likeBtn.classList.remove('phase2');
      likeCount.style.filter = 'blur(2px)';
      likeCount.style.transition = 'filter 0.1s';
      // No sound — silence is the critique
    }
  });
}

/* ============================================
   7. MOBILE — Width toggle
   ============================================ */

/* ============================================
   8. WEB3 — Particles
   ============================================ */
const particlesContainer = document.getElementById('particles-container');

function createParticles() {
  if (!particlesContainer) return;
  for (let i = 0; i < 25; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.top  = Math.random() * 100 + 'vh';
    particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
    particle.style.animationDelay    = (Math.random() * 6) + 's';
    particle.style.width  = (Math.random() * 3 + 1) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
  }
}

createParticles();

/* ============================================
   9. WEB3 — Wallet connect mock
   ============================================ */
const walletBtn = document.querySelector('.wallet-btn');
if (walletBtn) {
  walletBtn.addEventListener('click', () => {
    walletBtn.textContent = 'Connecting...';
    setTimeout(() => {
      walletBtn.textContent = '✓ Connected: 0x71C...3f4a';
      walletBtn.style.background = '#22c55e';
    }, 1200);
  });
}

/* ============================================
   10. SOUND SYSTEM — Web Audio API
       All sounds procedurally generated.
       RULE: only call from click/keypress handlers.
       Never call from scroll or load events.
   ============================================ */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playClickSound() {
  try {
    const ctx = getAudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Audio failed silently — page still works
  }
}

function playLikeSound(freq = 400) {
  try {
    const ctx = getAudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.05);
    osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {
    // Audio failed silently — page still works
  }
}

function playTypingSound() {
  try {
    const ctx = getAudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'square';
    osc.frequency.setValueAtTime(
      Math.random() * 200 + 600,
      ctx.currentTime
    );

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {
    // Audio failed silently — page still works
  }
}

/* ============================================
   12. DOT-COM — Visitor counter animation
       Counts up erratically when section is visible
   ============================================ */
const visitorCount = document.getElementById('visitor-count');
let counterRunning = false;
let currentCount = 4294967295;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counterRunning) {
      counterRunning = true;
      runCounter();
    }
    if (!entry.isIntersecting) {
      counterRunning = false;
    }
  });
}, { threshold: 0.3 });

const dotcomSection = document.getElementById('dotcom');
if (dotcomSection) counterObserver.observe(dotcomSection);

function runCounter() {
  if (!counterRunning) return;
  // Random jump between 1 and 47
  currentCount += Math.floor(Math.random() * 47 + 1);
  if (visitorCount) {
    visitorCount.textContent = currentCount.toLocaleString();
  }
  // Random delay between 200ms and 900ms — erratic feel
  setTimeout(runCounter, Math.random() * 700 + 200);
}

/* ============================================
   13. GSAP SCROLL REVEALS
       Text and elements animate in as each
       section enters the viewport.
       Wrapped in typeof check for safety.
   ============================================ */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {

  gsap.registerPlugin(ScrollTrigger);

  // ARPANET — enter prompt fades up
  gsap.from('.enter-prompt', {
    scrollTrigger: {
      trigger: '#arpanet',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 2
  });

  // DOTCOM — heading slams in
  gsap.from('#dotcom h2', {
    scrollTrigger: {
      trigger: '#dotcom',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    scale: 1.4,
    duration: 0.4,
    ease: 'power3.out'
  });

  // DOTCOM — marquee slides in from left
  gsap.from('#dotcom marquee', {
    scrollTrigger: {
      trigger: '#dotcom',
      start: 'top 50%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -60,
    duration: 0.5,
    delay: 0.2,
    ease: 'power2.out'
  });

  // DOTCOM — button bounces in
  gsap.from('.dotcom-btn', {
    scrollTrigger: {
      trigger: '#dotcom',
      start: 'top 40%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.5,
    delay: 0.4,
    ease: 'back.out(1.7)'
  });

  // SOCIAL — card slides up
  gsap.from('.social-card', {
    scrollTrigger: {
      trigger: '#social',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    duration: 0.7,
    ease: 'power2.out'
  });

 // MOBILE — viewport slides in from bottom
  gsap.from('.mobile-viewport', {
    scrollTrigger: {
      trigger: '#mobile',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: 'power2.out'
  });

  // MOBILE — toggle button fades in
  gsap.from('#view-toggle', {
    scrollTrigger: {
      trigger: '#mobile',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    duration: 0.5,
    delay: 0.4
  });

  // WEB3 — glass card heading
  gsap.from('.glass-card h2', {
    scrollTrigger: {
      trigger: '#web3',
      start: 'top 55%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -30,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out'
  });

  // WEB3 — wallet button
  gsap.from('.wallet-btn', {
    scrollTrigger: {
      trigger: '#web3',
      start: 'top 40%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    delay: 0.6,
    ease: 'back.out(1.4)'
  });

} else {
  console.warn('GSAP not loaded — scroll reveals skipped');
}

/* ============================================
   11. CONSOLE EASTER EGG
   ============================================ */
console.log(
  '%c YOU ARE THE INTERNET ',
  'background: #000; color: #00ff41; font-family: monospace; font-size: 16px; padding: 8px 16px;'
);
console.log(
  '%c Built by Anand | Frontend Odyssey Hackathon ',
  'background: #0a0a0f; color: #6366f1; font-family: monospace; font-size: 12px; padding: 4px 16px;'
);
console.log(
  '%c TrustSplit — bill splitting on the blockchain. Trust math, not companies. ',
  'background: #0a0a0f; color: #e2e8f0; font-family: monospace; font-size: 11px; padding: 4px 16px;'
);

// ── Mobile View Toggle ────────────────────────
const viewToggleBtn = document.getElementById('view-toggle');
const mobileViewport = document.querySelector('.mobile-viewport');

if (viewToggleBtn && mobileViewport) {
  viewToggleBtn.addEventListener('click', () => {
    const isNowDesktop = mobileViewport.classList.toggle('desktop-view');
    viewToggleBtn.textContent = isNowDesktop
      ? 'Switch to Mobile View'
      : 'Switch to Desktop View';
  });
}
// ── End Mobile View Toggle ────────────────────