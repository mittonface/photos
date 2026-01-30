document.addEventListener('DOMContentLoaded', function() {
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
        photoCards.forEach(card => card.style.display = '');
      } else {
        // Apply filter
        activeTag = tag;
        tagButtons.forEach(b => b.classList.remove('active'));
        button.classList.add('active');

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
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.nav.prev');
  const nextBtn = lightbox.querySelector('.nav.next');

  let currentIndex = 0;

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
  }

  function openLightbox(index) {
    showPhoto(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  photoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const visiblePhotos = getVisiblePhotos();
      const visibleIndex = visiblePhotos.indexOf(card);
      openLightbox(visibleIndex);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => showPhoto(currentIndex - 1));
  nextBtn.addEventListener('click', () => showPhoto(currentIndex + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') showPhoto(currentIndex + 1);
  });
});
