// Shared interactions for SingleParentSG home page
// Nav toggle is handled by header.js

// Simple fade-in on scroll for elements with .fade-in
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

