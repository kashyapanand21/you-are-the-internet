/* ============================================
   YOU ARE THE INTERNET — script.js
   ============================================ */

// ── BOOT: set default era before observer fires ──
document.body.dataset.era = 'arpanet';

/* ============================================
   1. IntersectionObserver — ERA SWITCHING
      This is the engine of the entire project.
      When a section hits 30% visibility, it
      writes data-era to body and updates timeline.
   ============================================ */
const sections = document.querySelectorAll('.era-section');
const timelineMarkers = document.querySelectorAll('.timeline-marker');

let currentEra = 'arpanet';

const eraObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const era = entry.target.dataset.era;
      if (era && era !== currentEra) {
        switchEra(era, currentEra);
        currentEra = era;
      }
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => eraObserver.observe(section));

function switchEra(newEra, oldEra) {
  // Update body attribute — CSS cascade does the rest
  document.body.dataset.era = newEra;

  // Update timeline bar active dot
  timelineMarkers.forEach(marker => {
    marker.classList.toggle('active', marker.dataset.eraMarker === newEra);
  });

  // Trigger glitch only on arpanet → dotcom transition
  if (oldEra === 'arpanet' && newEra === 'dotcom') {
    triggerGlitch();
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
    typedOutput.textContent += storyText[charIndex];
    charIndex++;
    // Random delay between 30ms and 90ms — feels like a real terminal
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

    // Phase 1: 0–5 clicks — normal
    if (likes <= 5) {
      likeCount.textContent = likes;
      likeBtn.classList.add('liked');
      likeBtn.classList.remove('phase2', 'phase3');
      playLikeSound(400);
    }
    // Phase 2: 6–15 clicks — counter jumps, urgency builds
    else if (likes <= 15) {
      likes += 1; // double increment
      likeCount.textContent = likes;
      likeBtn.classList.add('phase2');
      likeBtn.classList.remove('phase3');
      playLikeSound(500);
    }
    // Phase 3: 15+ clicks — numbers blur, layout shakes
    else {
      likes += Math.floor(Math.random() * 10 + 5);
      likeCount.textContent = likes;
      likeBtn.classList.add('phase3');
      likeCount.style.filter = 'blur(1.5px)';
      // Silent — no sound in phase 3 (the silence IS the critique)
    }
  });
}

/* ============================================
   7. MOBILE — Width toggle
   ============================================ */
const viewToggle = document.getElementById('view-toggle');
const mobileFrame = document.getElementById('mobile-frame');
let isDesktopView = false;

if (viewToggle && mobileFrame) {
  viewToggle.addEventListener('click', () => {
    isDesktopView = !isDesktopView;
    mobileFrame.classList.toggle('desktop-view', isDesktopView);
    viewToggle.textContent = isDesktopView
      ? 'Switch to Mobile View'
      : 'Switch to Desktop View';
  });
}

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
   11. CONSOLE EASTER EGG
       Judges who open DevTools will see this.
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