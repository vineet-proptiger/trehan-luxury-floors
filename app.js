/* ===============================================================
   STAYLAB BY KAAVYARATNA — JAVASCRIPT UI ENGINE
=============================================================== */

// ── 1. Hero Concept 3: Horizontal Scroll/Swipe & Auto-Slide Engine ──
(function initHeroHorizontalSlider() {
  const stage = document.getElementById('penthouse-stage');
  const track = document.getElementById('hero-slider-track');
  const dot0 = document.getElementById('hero-dot-0');
  const dot1 = document.getElementById('hero-dot-1');
  if (!stage || !track) return;

  let currentIdx = 0;
  let autoTimer = null;
  let isHovered = false;

  const updateSlideUI = (idx) => {
    currentIdx = idx;
    track.style.transform = idx === 0 ? 'translateX(0%)' : 'translateX(-50%)';

    if (dot0 && dot1) {
      if (idx === 0) {
        dot0.className = 'w-7 h-1.5 rounded-full transition-all duration-300 bg-[#DFBA73] shadow-md';
        dot1.className = 'w-2 h-1.5 rounded-full transition-all duration-300 bg-white/40 shadow-md';
      } else {
        dot0.className = 'w-2 h-1.5 rounded-full transition-all duration-300 bg-white/40 shadow-md';
        dot1.className = 'w-7 h-1.5 rounded-full transition-all duration-300 bg-[#DFBA73] shadow-md';
      }
    }
  };

  window.slideHeroDirection = function (dir) {
    if (dir === 1) {
      updateSlideUI((currentIdx + 1) % 2);
    } else if (dir === -1) {
      updateSlideUI((currentIdx - 1 + 2) % 2);
    } else {
      updateSlideUI(dir);
    }
    resetLoop();
  };

  const startLoop = () => {
    stopLoop();
    autoTimer = setInterval(() => {
      if (!isHovered) {
        updateSlideUI((currentIdx + 1) % 2);
      }
    }, 5000);
  };

  const stopLoop = () => {
    if (autoTimer) clearInterval(autoTimer);
  };

  const resetLoop = () => {
    startLoop();
  };

  stage.addEventListener('mouseenter', () => { isHovered = true; });
  stage.addEventListener('mouseleave', () => {
    isHovered = false;
    isDragging = false;
  });

  // Cursor Move Feedback: Indicate Left / Right navigation
  stage.addEventListener('mousemove', (e) => {
    const rect = stage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    stage.style.cursor = 'pointer';
  });

  // Direct Click Navigation: Left half clicks go to slide 0, Right half clicks go to slide 1
  stage.addEventListener('click', (e) => {
    if (Math.abs(lastDragDelta) > 15) return; // Ignore clicks if it was a drag
    const rect = stage.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.45) {
      window.slideHeroDirection(-1); // Left half -> Prev (0)
    } else {
      window.slideHeroDirection(1);  // Right half -> Next (1)
    }
  });

  // Touch Swipe Gesture Support (Mobile / Tablet)
  let touchStartX = 0;
  let touchStartY = 0;

  stage.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  stage.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        window.slideHeroDirection(1); // Swiped Left -> Next
      } else {
        window.slideHeroDirection(-1); // Swiped Right -> Prev
      }
    }
  }, { passive: true });

  // Mouse Drag / Cursor Gesture Support (Desktop)
  let mouseStartX = 0;
  let isDragging = false;
  let lastDragDelta = 0;

  stage.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isDragging = true;
    lastDragDelta = 0;
  });

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diffX = e.clientX - mouseStartX;
    lastDragDelta = diffX;
    if (Math.abs(diffX) > 35) {
      if (diffX < 0) {
        window.slideHeroDirection(1); // Dragged Left -> Next
      } else {
        window.slideHeroDirection(-1); // Dragged Right -> Prev
      }
    }
  });

  // Horizontal Trackpad / Mouse Wheel Scroll
  let wheelDebounce = null;
  stage.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) > 25) {
      if (wheelDebounce) return;
      wheelDebounce = setTimeout(() => { wheelDebounce = null; }, 400);
      if (e.deltaX > 0) {
        window.slideHeroDirection(1); // Scrolled Left-to-Right
      } else {
        window.slideHeroDirection(-1);
      }
    }
  }, { passive: true });

  updateSlideUI(0);
  startLoop();
})();

// ── 2. Master Plan & Floor Plan Tab Switcher ─────────────────
window.switchPlanTab = function (tab) {
  const masterContent = document.getElementById('tab-content-master');
  const floorContent = document.getElementById('tab-content-floor');
  const masterBtn = document.getElementById('tab-btn-master');
  const floorBtn = document.getElementById('tab-btn-floor');

  if (!masterContent || !floorContent) return;

  if (tab === 'master') {
    masterContent.style.display = 'block';
    floorContent.style.display = 'none';

    if (masterBtn) {
      masterBtn.classList.add('bg-black', 'text-white', 'font-extrabold', 'shadow-md');
      masterBtn.classList.remove('text-[#495057]');
    }
    if (floorBtn) {
      floorBtn.classList.remove('bg-black', 'text-white', 'font-extrabold', 'shadow-md');
      floorBtn.classList.add('text-[#495057]');
    }
  } else {
    masterContent.style.display = 'none';
    floorContent.style.display = 'grid';

    if (floorBtn) {
      floorBtn.classList.add('bg-black', 'text-white', 'font-extrabold', 'shadow-md');
      floorBtn.classList.remove('text-[#495057]');
    }
    if (masterBtn) {
      masterBtn.classList.remove('bg-black', 'text-white', 'font-extrabold', 'shadow-md');
      masterBtn.classList.add('text-[#495057]');
    }
  }
};

// ── 3. Gallery Lightbox Engine ───────────────────────────────
const galleryItems = [
  { src: 'images/gallery/g1.webp', title: 'Serviced Residences & Co-Living View', category: 'Project Architecture' },
  { src: 'images/gallery/g2.webp', title: 'Grand Arrival & Reception Lounge', category: 'Grand Arrival' },
  { src: 'images/gallery/g3.webp', title: 'Furnished Studio Residences', category: 'Furnished Studios' },
  { src: 'images/gallery/g4.webp', title: 'Co-Living & Community Spaces', category: 'Community Living' },
  { src: 'images/gallery/g5.webp', title: 'Terrace Cafe & Sky Lounge', category: 'Lifestyle Amenities' },
];

let curGalleryIdx = 0;

window.openGalleryLightbox = function (idx) {
  curGalleryIdx = idx;
  const lb = document.getElementById('gallery-lightbox');
  const img = document.getElementById('gallery-lightbox-img');
  const title = document.getElementById('gallery-lightbox-title');
  const category = document.getElementById('gallery-lightbox-category');
  const counter = document.getElementById('gallery-lightbox-counter');

  if (!lb || !img) return;

  const item = galleryItems[curGalleryIdx];
  img.src = item.src;
  img.alt = item.title;
  if (title) title.innerText = item.title;
  if (category) category.innerText = item.category;
  if (counter) counter.innerText = `${curGalleryIdx + 1} / ${galleryItems.length}`;

  lb.classList.remove('hidden');
  lb.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

window.closeGalleryLightbox = function () {
  const lb = document.getElementById('gallery-lightbox');
  if (lb) {
    lb.classList.add('hidden');
    lb.classList.remove('flex');
    document.body.style.overflow = '';
  }
};

window.nextGalleryLightbox = function (e) {
  if (e) e.stopPropagation();
  curGalleryIdx = (curGalleryIdx + 1) % galleryItems.length;
  window.openGalleryLightbox(curGalleryIdx);
};

window.prevGalleryLightbox = function (e) {
  if (e) e.stopPropagation();
  curGalleryIdx = (curGalleryIdx - 1 + galleryItems.length) % galleryItems.length;
  window.openGalleryLightbox(curGalleryIdx);
};

// ── 4. Enquire Modal Engine ──────────────────────────────────
window.openLeadModal = function (titleText) {
  const modal = document.getElementById('leadModal');
  if (!modal) return;

  if (titleText) {
    const heading = modal.querySelector('.modal-dynamic-heading');
    if (heading) heading.innerText = titleText;
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

window.closeLeadModal = function () {
  const modal = document.getElementById('leadModal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
};

// ── 5. Mobile Navigation Menu ────────────────────────────────
window.toggleMobileNav = function () {
  const dropdown = document.getElementById('mobileNavDropdown');
  const icon = document.getElementById('mobNavIcon');
  if (!dropdown) return;
  const isHidden = dropdown.classList.contains('hidden');
  if (isHidden) {
    dropdown.classList.remove('hidden');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  } else {
    dropdown.classList.add('hidden');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }
};

window.closeMobileNav = function () {
  const dropdown = document.getElementById('mobileNavDropdown');
  const icon = document.getElementById('mobNavIcon');
  if (dropdown) dropdown.classList.add('hidden');
  if (icon) {
    icon.classList.remove('fa-xmark');
    icon.classList.add('fa-bars');
  }
};

// ── 6. Overview Text Expand/Collapse ─────────────────────────
window.toggleOverviewText = function () {
  const extra = document.getElementById('overview-extra-text');
  const btn = document.getElementById('overview-toggle-btn');
  const chevron = document.getElementById('overview-chevron');
  if (!extra || !btn) return;

  const isHidden = extra.classList.contains('hidden');
  if (isHidden) {
    extra.classList.remove('hidden');
    const label = btn.querySelector('span');
    if (label) label.innerText = 'Collapse Details';
    if (chevron) chevron.classList.add('rotate-180');
  } else {
    extra.classList.add('hidden');
    const label = btn.querySelector('span');
    if (label) label.innerText = 'Read Full Narrative';
    if (chevron) chevron.classList.remove('rotate-180');
  }
};

// ── 7. Global Keyboard & Click Handlers ──────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.closeLeadModal();
    window.closeGalleryLightbox();
    window.closeMobileNav();
  }
  if (e.key === 'ArrowRight') {
    const lb = document.getElementById('gallery-lightbox');
    if (lb && !lb.classList.contains('hidden')) window.nextGalleryLightbox();
  }
  if (e.key === 'ArrowLeft') {
    const lb = document.getElementById('gallery-lightbox');
    if (lb && !lb.classList.contains('hidden')) window.prevGalleryLightbox();
  }
});

// ── 8. DOM Ready Initializations ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS Animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 650,
      easing: 'ease-out-cubic',
    });
  }

  // Auto-trigger modal after 20 seconds (if not already submitted)
  setTimeout(() => {
    try {
      const alreadySub = localStorage.getItem('_lsub_done');
      if (!alreadySub) {
        window.openLeadModal();
      }
    } catch (e) {
      window.openLeadModal();
    }
  }, 20000);

  // Navbar scroll shadow
  const navbar = document.getElementById('mainNavbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('shadow-md');
      } else {
        navbar.classList.remove('shadow-md');
      }
    });
  }
});
