// assets/js/components/orderDetailsModal.js
// Responsabilidade: controlar o modal de detalhes do evento,
// carregar/salvar dados no localStorage e devolver os dados
// para quem chamou (menuCart).

const STORAGE_KEY = "tiaJaneOrderDetails";

function safeLoad() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function safeSave(details) {
  try {
    const payload = JSON.stringify(details || {});
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Se der erro (modo privado, etc), só ignora. UX continua normal.
  }
}

export function initOrderDetailsModal() {
  const modal = document.getElementById("orderDetailsModal");
  if (!modal) {
    // fallback inofensivo
    return {
      open(onConfirm) {
        if (typeof onConfirm === "function") {
          onConfirm({});
        }
      },
    };
  }

  const form = modal.querySelector("#orderDetailsForm");
  const content = modal.querySelector(".order-details-modal__content");
  const closeElements = modal.querySelectorAll("[data-order-details-close]");

  let confirmCallback = null;

  function fillForm(details) {
    const data = details || {};
    const dateInput = form.elements.orderDetailsDate;
    const guestsInput = form.elements.orderDetailsGuests;
    const locationInput = form.elements.orderDetailsLocation;
    const preferencesInput = form.elements.orderDetailsPreferences;

    if (dateInput) dateInput.value = data.eventDate || "";
    if (guestsInput) guestsInput.value = data.guests || "";
    if (locationInput) locationInput.value = data.location || "";
    if (preferencesInput) preferencesInput.value = data.preferences || "";
  }

  function readForm() {
    const dateInput = form.elements.orderDetailsDate;
    const guestsInput = form.elements.orderDetailsGuests;
    const locationInput = form.elements.orderDetailsLocation;
    const preferencesInput = form.elements.orderDetailsPreferences;

    return {
      eventDate: dateInput ? dateInput.value.trim() : "",
      guests: guestsInput ? guestsInput.value.trim() : "",
      location: locationInput ? locationInput.value.trim() : "",
      preferences: preferencesInput ? preferencesInput.value.trim() : "",
    };
  }

  function show() {
    modal.classList.remove("order-details-modal--hidden");
    modal.classList.add("order-details-modal--visible");

    // animação suave do conteúdo
    if (content) {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
    }
  }

  function hide() {
    modal.classList.add("order-details-modal--hidden");
    modal.classList.remove("order-details-modal--visible");

    if (content) {
      content.style.opacity = "";
      content.style.transform = "";
    }

    confirmCallback = null;
  }

  function open(onConfirm) {
    confirmCallback = typeof onConfirm === "function" ? onConfirm : null;

    const saved = safeLoad();
    fillForm(saved);

    show();

    // tenta focar o primeiro campo
    const firstInput =
      form.elements.orderDetailsDate ||
      form.elements.orderDetailsGuests ||
      form.elements.orderDetailsLocation;
    if (firstInput && typeof firstInput.focus === "function") {
      setTimeout(() => firstInput.focus(), 80);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const details = readForm();
    safeSave(details);

    const cb = confirmCallback;
    hide();

    if (cb) {
      cb(details);
    }
  }

  if (form) {
    form.addEventListener("submit", handleSubmit);
  }

  closeElements.forEach((el) => {
    el.addEventListener("click", hide);
  });

  // se clicar "por fora" do conteúdo (fallback)
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      hide();
    }
  });

  return {
    open,
  };
}
