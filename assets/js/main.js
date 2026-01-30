document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    const updateThemeLabel = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    updateThemeLabel();

    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeLabel();
    });
  }

  // Collapsible tag categories
  const tagGroupLabels = document.querySelectorAll('.tag-group-label');
  tagGroupLabels.forEach(label => {
    label.addEventListener('click', () => {
      const tags = label.nextElementSibling;
      const isExpanded = label.getAttribute('aria-expanded') === 'true';
      label.setAttribute('aria-expanded', !isExpanded);
      tags.classList.toggle('collapsed');
    });
  });

  // Initialize masonry layout
  const macyInstance = Macy({
    container: '.photo-grid',
    trueOrder: true,
    margin: 16,
    columns: 3,
    breakAt: {
      900: 2,
      600: 1
    }
  });

  // Debounced recalculate to batch multiple image loads
  let recalcTimer = null;
  function debouncedRecalculate() {
    if (recalcTimer) return;
    recalcTimer = setTimeout(() => {
      macyInstance.recalculate(true);
      recalcTimer = null;
    }, 100);
  }

  // Recalculate layout after images load (important for lazy loading)
  const images = document.querySelectorAll('.photo-card img');
  images.forEach(img => {
    if (img.complete) {
      debouncedRecalculate();
    } else {
      img.addEventListener('load', debouncedRecalculate);
    }
  });

  // Tag filtering
  const tagButtons = document.querySelectorAll('.tag-filter');
  const photoCards = document.querySelectorAll('.photo-card');
  let activeTag = null;

  // Staggered fade-in animation - clear animation after to allow gravity transforms
  photoCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.08}s`;
    card.addEventListener('animationend', () => {
      card.style.animation = 'none';
      card.style.opacity = '1';
    }, { once: true });
  });

  // Cursor gravity - photos tilt toward mouse like curious creatures
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function applyGravity() {
    photoCards.forEach(card => {
      if (card.style.display === 'none') return;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const deltaX = mouseX - cardCenterX;
      const deltaY = mouseY - cardCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Only affect cards within 400px of cursor
      if (distance < 400 && distance > 0) {
        const strength = Math.max(0, (400 - distance) / 400);
        const maxTilt = 4;

        const tiltX = (deltaY / distance) * maxTilt * strength;
        const tiltY = -(deltaX / distance) * maxTilt * strength;
        const scale = 1 + (strength * 0.02);

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
      } else {
        card.style.transform = '';
      }
    });
    requestAnimationFrame(applyGravity);
  }

  // Only run on devices with fine pointer (not touch)
  if (window.matchMedia('(pointer: fine)').matches) {
    requestAnimationFrame(applyGravity);
  }

  tagButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tag = button.dataset.tag;

      if (activeTag === tag) {
        // Clear filter
        activeTag = null;
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
        photoCards.forEach(card => card.style.display = '');
      } else {
        // Apply filter
        activeTag = tag;
        tagButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        photoCards.forEach(card => {
          const cardTags = card.dataset.tags.split(',');
          if (cardTags.includes(tag)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }

      // Recalculate masonry layout after filtering
      macyInstance.recalculate(true, true);
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption .caption');
  const lightboxMeta = lightbox.querySelector('.lightbox-caption .meta');
  const lightboxAnnounce = document.getElementById('lightbox-announce');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.nav.prev');
  const nextBtn = lightbox.querySelector('.nav.next');
  const focusableElements = [closeBtn, prevBtn, nextBtn];

  let currentIndex = 0;
  let triggerElement = null;

  function getVisiblePhotos() {
    return Array.from(photoCards).filter(card => card.style.display !== 'none');
  }

  function showPhoto(index) {
    const visiblePhotos = getVisiblePhotos();
    if (visiblePhotos.length === 0) return;

    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const card = visiblePhotos[currentIndex];

    lightboxImg.src = card.dataset.src;
    lightboxImg.alt = card.dataset.caption;
    lightboxCaption.textContent = card.dataset.caption;

    const date = card.dataset.date;
    const location = card.dataset.location;
    let meta = '';
    if (date) meta += date;
    if (date && location) meta += ' · ';
    if (location) meta += location;
    lightboxMeta.textContent = meta;

    // Announce photo position to screen readers
    const announcement = `Photo ${currentIndex + 1} of ${visiblePhotos.length}: ${card.dataset.caption}`;
    lightboxAnnounce.textContent = announcement;
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Enable focusable elements
    focusableElements.forEach(el => el.setAttribute('tabindex', '0'));

    // Focus the close button
    setTimeout(() => closeBtn.focus(), 100);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Disable focusable elements
    focusableElements.forEach(el => el.setAttribute('tabindex', '-1'));

    // Restore focus to the triggering element
    if (triggerElement) {
      triggerElement.focus();
      triggerElement = null;
    }
  }

  // Handle photo card activation (click and keyboard)
  photoCards.forEach((card) => {
    const activateCard = () => {
      triggerElement = card;
      const visiblePhotos = getVisiblePhotos();
      const visibleIndex = visiblePhotos.indexOf(card);
      openLightbox(visibleIndex);
    };

    card.addEventListener('click', activateCard);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateCard();
      }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showPhoto(currentIndex - 1));
  nextBtn.addEventListener('click', () => showPhoto(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation and focus trap
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key === 'ArrowLeft') {
      showPhoto(currentIndex - 1);
      return;
    }
    if (e.key === 'ArrowRight') {
      showPhoto(currentIndex + 1);
      return;
    }

    // Focus trap
    if (e.key === 'Tab') {
      const focusedIndex = focusableElements.indexOf(document.activeElement);

      if (e.shiftKey) {
        // Shift+Tab: go backwards
        if (focusedIndex <= 0) {
          e.preventDefault();
          focusableElements[focusableElements.length - 1].focus();
        }
      } else {
        // Tab: go forwards
        if (focusedIndex === focusableElements.length - 1) {
          e.preventDefault();
          focusableElements[0].focus();
        }
      }
    }
  });
});
