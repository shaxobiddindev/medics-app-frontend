let currentSlide = 0;
const slides = document.getElementById("slides");
const totalSlides = document.querySelectorAll(".carousel-slide").length;

function showSlide(index) {
  if (index >= totalSlides) currentSlide = 0;
  if (index < 0) currentSlide = totalSlides - 1;
  slides.style.transform = `translateX(-${currentSlide * 33.33}%)`;
}

function moveSlide(step) {
  currentSlide += step;
  showSlide(currentSlide);
}

// Avtomatik almashish (har 3 soniyada)
setInterval(() => {
  currentSlide++;
  showSlide(currentSlide);
}, 3000);
