document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  document.querySelectorAll('.lightbox-trigger').forEach((img) => {
    img.addEventListener('click', () => {
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
      lightboxImg.src = img.src;
    });
  });

  if (lightbox) {
    lightbox.addEventListener('click', () => {
      lightbox.classList.add('hidden');
      lightbox.classList.remove('flex');
    });
  }
});
