(function() {
  // Tag filtering
  const tagButtons = document.querySelectorAll('.tag-filter');
  const photoCards = document.querySelectorAll('.photo-card');
  let activeTag = null;

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
})();
