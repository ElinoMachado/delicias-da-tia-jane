// assets/js/components/heroParallax.js
// Responsabilidade: aplicar um parallax suave no card do hero ao mover o mouse.

export function initHeroParallax() {
  const wrapper = document.querySelector(".hero__image-wrapper");
  if (!wrapper) return;

  const card = wrapper.querySelector(".hero-card");
  if (!card) return;

  const maxTranslate = 12; // px
  const maxRotate = 4; // graus

  function handleMove(event) {
    const rect = wrapper.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    const translateX = -relativeX * maxTranslate;
    const translateY = -relativeY * maxTranslate;
    const rotateX = relativeY * maxRotate;
    const rotateY = -relativeX * maxRotate;

    card.style.transform = `
      translate3d(${translateX}px, ${translateY}px, 0)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `;
  }

  function reset() {
    card.style.transform = "";
  }

  wrapper.addEventListener("mousemove", handleMove);
  wrapper.addEventListener("mouseleave", reset);
}
