// assets/js/components/scrollAnimation.js
// Responsabilidade: gerenciar animações de entrada ao rolar a página.

export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".js-animate");

  if (!("IntersectionObserver" in window) || animatedElements.length === 0) {
    animatedElements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}
