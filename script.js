/* ============================================================
   MALABH – THE SHORT FILM  |  script.js
   ============================================================ */

'use strict';

/* ── SCROLL: NAV STYLE ──────────────────────────────────────── */
const nav = document.getElementById('nav');
function handleNavScroll() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ── MOBILE NAV TOGGLE ──────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── REVEAL ON SCROLL (IntersectionObserver) ────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 400);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ── TEASER PLAY BUTTON ────────────────────────────────────────── */
const trailerOverlay = document.getElementById('trailerOverlay');
const trailerPlay = document.getElementById('trailerPlay');
const teaserVideo = document.getElementById('teaserVideo');

function playTeaser() {
  if (trailerOverlay) trailerOverlay.classList.add('hidden');
  if (teaserVideo) {
    teaserVideo.setAttribute('controls', 'true');
    teaserVideo.play();
  }
}

if (trailerOverlay) {
  trailerOverlay.addEventListener('click', playTeaser);
  trailerPlay.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') playTeaser();
  });
}

/* ── OFFICIAL TRAILER PLAY BUTTON ─────────────────────────────── */
const trailerOverlay2 = document.getElementById('trailerOverlay2');
const trailerPlay2 = document.getElementById('trailerPlay2');
const officialTrailerVideo = document.getElementById('officialTrailerVideo');

function playOfficialTrailer() {
  if (trailerOverlay2) trailerOverlay2.classList.add('hidden');
  if (officialTrailerVideo) {
    officialTrailerVideo.setAttribute('controls', 'true');
    officialTrailerVideo.play();
  }
}

if (trailerOverlay2) {
  trailerOverlay2.addEventListener('click', playOfficialTrailer);
  trailerPlay2.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') playOfficialTrailer();
  });
}

/* ── BOOKING FORM SUBMISSION ────────────────────────────────── */
const bookingForm = document.getElementById('bookingForm');
const toast = document.getElementById('toast');

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const toastMsg = document.getElementById('toastMessage');

    // Prevent duplicate registrations from the same browser
    if (localStorage.getItem('malabh_registered') === 'true') {
      if (toastMsg) {
        toastMsg.innerText = "You have already registered for a Golden Pass!";
      }
      showToast();
      return;
    }

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!name || !phone) {
      shakForm(this);
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Processing...</span>';

    // 1. Show the Ticket Preview Modal
    showTicketModal();

    // 2. Send data to Google Sheets via FormData (works with no-cors)
    const scriptURL = 'https://script.google.com/macros/s/AKfycbz2zfYXzuqVF-txAF2byqDBKjA37slnmOQCJnnFfhlkbmphx-Q9WbRC2wQydnXwsBvc/exec';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('email', email);

    fetch(scriptURL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
      .then(() => {
        // Mark as registered in local storage
        localStorage.setItem('malabh_registered', 'true');
        
        if (toastMsg) {
          toastMsg.innerText = "Booking received! Your pass is downloading. Please check your email.";
        }
        showToast();
        bookingForm.reset();
      })
      .catch(error => {
        console.error('Error!', error.message);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      });
  });
}

/* ── TICKET MODAL LOGIC ────────────────────────────────────── */
const ticketModal = document.getElementById('ticketModal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const downloadTicketBtn = document.getElementById('downloadTicketBtn');

function showTicketModal() {
  if (ticketModal) ticketModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scroll
}

function closeTicketModal() {
  if (ticketModal) ticketModal.classList.remove('active');
  document.body.style.overflow = ''; // Restore scroll
}

if (modalClose) modalClose.addEventListener('click', closeTicketModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeTicketModal);

if (downloadTicketBtn) {
  downloadTicketBtn.addEventListener('click', function () {
    const originalText = this.innerHTML;
    this.innerHTML = '<span>Processing...</span>';

    const fileName = 'golden-pass.jpeg';
    const downloadName = 'Malabh-Golden-Pass.jpeg';

    // Best Method: Fetch as blob to force download
    fetch(fileName)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.innerHTML = '<span>Downloaded!</span>';
        setTimeout(() => { this.innerHTML = originalText; }, 2000);
      })
      .catch(error => {
        console.warn('Blob download failed, trying fallback method:', error);

        // Fallback Method: Standard anchor download
        try {
          const link = document.createElement('a');
          link.href = fileName;
          link.download = downloadName;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          this.innerHTML = '<span>Check Downloads</span>';
          setTimeout(() => { this.innerHTML = originalText; }, 2000);
        } catch (fallbackError) {
          console.error('Fallback download also failed:', fallbackError);
          this.innerHTML = '<span>Failed. Long-press image to save</span>';
          setTimeout(() => { this.innerHTML = originalText; }, 3000);
        }
      });
  });
}

function shakForm(form) {
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => { form.style.animation = ''; }, 400);
}

// Inject shake keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-8px); }
    40%      { transform: translateX(8px); }
    60%      { transform: translateX(-5px); }
    80%      { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

/* ── GALLERY LIGHTBOX (simple) ──────────────────────────────── */
// When you add real images, uncomment this for a simple lightbox:
/*
const galleryItems = document.querySelectorAll('.gallery-item img');
galleryItems.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.95);
      display:flex;align-items:center;justify-content:center;cursor:zoom-out;
    `;
    const bigImg = document.createElement('img');
    bigImg.src = img.src;
    bigImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;';
    overlay.appendChild(bigImg);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});
*/

/* ── SMOOTH ACTIVE NAV HIGHLIGHT ────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === `#${entry.target.id}`) {
            if (!a.classList.contains('nav-cta')) a.style.color = 'var(--gold)';
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach(s => sectionObserver.observe(s));

/* ── PARALLAX HERO ──────────────────────────────────────────── */
const heroGradient = document.querySelector('.hero-gradient');
if (heroGradient) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroGradient.style.transform = `translateY(${y * 0.15}px)`;
  }, { passive: true });
}

/* ── CURSOR GLOW (desktop only) ─────────────────────────────── */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position:fixed;pointer-events:none;z-index:9997;
    width:300px;height:300px;border-radius:50%;
    background:radial-gradient(circle,rgba(201,168,76,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:transform 0.1s linear;
    mix-blend-mode:screen;
  `;
  document.body.appendChild(cursor);

  let mx = -500, my = -500;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
}

/* ── PAGE LOAD ANIMATION ────────────────────────────────────── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});


