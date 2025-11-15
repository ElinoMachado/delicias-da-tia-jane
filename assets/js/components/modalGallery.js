// assets/js/components/modalGallery.js
// Responsabilidade: modal de detalhes do prato e interação com os cards.

export function initDishModal(dishes) {
  const grid = document.getElementById("dishesGrid");
  const modal = document.getElementById("dishModal");
  const modalImage = document.getElementById("modalDishImage");
  const modalTitle = document.getElementById("modalDishTitle");
  const modalDescription = document.getElementById("modalDishDescription");
  const modalPrice = document.getElementById("modalDishPrice");

  if (!grid || !modal) return;

  function openModal(dishId) {
    const dish = dishes.find((d) => d.id === dishId);
    if (!dish) return;

    modalImage.style.backgroundImage = `url("${dish.image}")`;
    modalTitle.textContent = dish.name;
    modalDescription.textContent = dish.description;
    modalPrice.textContent = dish.price;

    modal.classList.remove("modal--hidden");
    modal.classList.add("modal--visible");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("modal--visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // delay para esconder completamente após animação
    setTimeout(() => {
      if (!modal.classList.contains("modal--visible")) {
        modal.classList.add("modal--hidden");
      }
    }, 200);
  }

  // Delegação de evento: clique no card
  grid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-dish-id]");
    if (!card) return;

    const dishId = card.getAttribute("data-dish-id");
    openModal(dishId);
  });

  // Fechar clicando em elementos com data-modal-close
  modal.addEventListener("click", (event) => {
    const closeTrigger = event.target.closest("[data-modal-close]");
    if (closeTrigger) {
      closeModal();
    }
  });

  // Escapar com tecla ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("modal--visible")) {
      closeModal();
    }
  });
}
