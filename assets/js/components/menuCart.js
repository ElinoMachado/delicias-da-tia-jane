// assets/js/components/menuCart.js
// Responsabilidade: gerenciar o carrinho flutuante (buffets + pratos),
// somar valores e integrar com modal de detalhes + WhatsApp.

import { initOrderDetailsModal } from "./orderDetailsModal.js";

export function initMenuCart(menuItems) {
  const orderPanel = document.getElementById("orderPanel");
  const itemsContainer = document.getElementById("orderPanelItems");
  const totalElement = document.getElementById("orderPanelTotal");
  const sendButton = document.getElementById("orderPanelSend");

  if (!orderPanel || !itemsContainer || !totalElement || !sendButton) {
    return {
      handleSelect: () => {},
      addDish: () => {},
      addConfiguredBuffet: () => {},
    };
  }

  const orderDetailsModal = initOrderDetailsModal();

  const defaultPhone = "553491328323";
  const panelPhone = orderPanel.dataset.whatsapp;
  const phone =
    panelPhone && panelPhone.trim().length > 0
      ? panelPhone.trim()
      : defaultPhone;

  const state = new Map(); // Map<id, { item, quantity }>

  function formatCurrency(value) {
    const safe = typeof value === "number" ? value : 0;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(safe);
  }

  function parsePriceString(priceStr) {
    if (typeof priceStr !== "string") return null;
    const normalized = priceStr
      .replace(/[^\d,,-.]/g, "")
      .replace(/\./g, "")
      .replace(",", ".");
    const numeric = Number(normalized);
    return Number.isFinite(numeric) ? numeric : null;
  }

  function findMenuItem(id) {
    return menuItems.find((item) => item.id === id);
  }

  // buffet simples (atalho — ainda disponível se você usar)
  function addItem(id) {
    const item = findMenuItem(id);
    if (!item) return;

    const key = `buffet-${item.id}`;
    const existing = state.get(key);

    const reference =
      typeof item.referencePrice === "number"
        ? item.referencePrice
        : parsePriceString(item.displayPrice) || 0;

    const cartItem = existing?.item || {
      id: key,
      name: item.name,
      buffetType: item.buffetType || "Buffet",
      referencePrice: reference,
      displayPrice: formatCurrency(reference),
      meta: {
        baseId: item.id,
        type: "buffet-simples",
      },
    };

    const quantity = (existing?.quantity || 0) + 1;
    state.set(key, { item: cartItem, quantity });

    render();
  }

  // buffet configurado via modal
  function addConfiguredBuffet(buffetItem, config) {
    if (!buffetItem || !buffetItem.id) return;

    const uniqueId = `buffet-${buffetItem.id}-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    const guests = config?.guests || null;
    const estimated =
      typeof config?.estimatedPrice === "number"
        ? config.estimatedPrice
        : typeof buffetItem.referencePrice === "number"
        ? buffetItem.referencePrice
        : parsePriceString(buffetItem.displayPrice) || 0;

    const modeLabel =
      config?.mode === "tia-jane" ? "A moda da Tia Jane" : "Personalizado";

    const nameWithGuests =
      guests && guests > 0
        ? `${buffetItem.name} · ${guests} pessoas`
        : buffetItem.name;

    const cartItem = {
      id: uniqueId,
      name: nameWithGuests,
      buffetType: buffetItem.buffetType || "Buffet",
      referencePrice: estimated,
      displayPrice: formatCurrency(estimated),
      meta: {
        baseId: buffetItem.id,
        type: "buffet-configurado",
        guests,
        mode: config?.mode || "custom",
        modeLabel,
        selections: Array.isArray(config?.selections) ? config.selections : [],
      },
    };

    state.set(uniqueId, { item: cartItem, quantity: 1 });
    render();
  }

  // prato em destaque
  function addDish(dish) {
    if (!dish || !dish.id) return;

    const key = `dish-${dish.id}`;
    const existing = state.get(key);

    const reference =
      typeof dish.referencePrice === "number"
        ? dish.referencePrice
        : parsePriceString(dish.price) || null;

    const cartItem = existing?.item || {
      id: key,
      name: dish.name,
      buffetType: dish.buffetType || "Prato em destaque",
      referencePrice: reference,
      displayPrice:
        dish.displayPrice ||
        dish.price ||
        (reference ? formatCurrency(reference) : "Sob consulta"),
      meta: {
        baseId: dish.id,
        type: "prato-destaque",
      },
    };

    const quantity = (existing?.quantity || 0) + 1;
    state.set(key, { item: cartItem, quantity });

    render();
  }

  function incrementQuantity(id) {
    const entry = state.get(id);
    if (!entry) return;
    entry.quantity += 1;
    state.set(id, entry);
    render();
  }

  function decrementItem(id) {
    const entry = state.get(id);
    if (!entry) return;
    entry.quantity -= 1;
    if (entry.quantity <= 0) {
      state.delete(id);
    } else {
      state.set(id, entry);
    }
    render();
  }

  function removeItem(id) {
    if (!state.has(id)) return;
    state.delete(id);
    render();
  }

  function render() {
    itemsContainer.innerHTML = "";

    if (state.size === 0) {
      orderPanel.classList.add("order-panel--hidden");
      totalElement.textContent = formatCurrency(0);
      return;
    }

    orderPanel.classList.remove("order-panel--hidden");

    let total = 0;

    state.forEach(({ item, quantity }) => {
      const line = document.createElement("div");
      line.className = "order-panel__item";
      line.setAttribute("data-order-id", item.id);

      const hasReference = typeof item.referencePrice === "number";

      if (hasReference) {
        total += item.referencePrice * quantity;
      }

      const lineTotal = hasReference
        ? formatCurrency(item.referencePrice * quantity)
        : item.displayPrice;

      // Detalhes bonitos para buffet configurado
      let detailsMarkup = "";
      if (item.meta?.type === "buffet-configurado") {
        const modeLabel = item.meta.modeLabel || "Personalizado";
        const guestsText =
          typeof item.meta.guests === "number" && item.meta.guests > 0
            ? `${item.meta.guests} pessoas`
            : "a combinar";

        const selectionGroups = Array.isArray(item.meta.selections)
          ? item.meta.selections
          : [];

        const groupsList = selectionGroups
          .map((group) => {
            const values = Array.isArray(group.values)
              ? group.values.join(", ")
              : group.values;
            return `
              <li class="order-panel__item-details-item">
                <strong>${group.label}:</strong> ${values}
              </li>
            `;
          })
          .join("");

        detailsMarkup = `
          <button
            class="order-panel__item-toggle"
            type="button"
            data-action="toggle-details"
          >
            Detalhes do buffet
            <span class="order-panel__item-toggle-icon">▾</span>
          </button>
          <div class="order-panel__item-details" hidden>
            <div class="order-panel__item-details-line">
              <span class="order-panel__item-details-label">Modo:</span>
              <span>${modeLabel}</span>
            </div>
            <div class="order-panel__item-details-line">
              <span class="order-panel__item-details-label">Convidados:</span>
              <span>${guestsText}</span>
            </div>
            ${
              groupsList
                ? `<ul class="order-panel__item-details-list">${groupsList}</ul>`
                : ""
            }
          </div>
        `;
      }

      line.innerHTML = `
        <div class="order-panel__item-main">
          <button
            class="order-panel__item-control"
            type="button"
            data-action="decrease"
            aria-label="Diminuir quantidade de ${item.name}"
          >
            −
          </button>
          <span class="order-panel__item-qty">${quantity}x</span>
          <span class="order-panel__item-title">${item.name}</span>
          <button
            class="order-panel__item-control"
            type="button"
            data-action="increase"
            aria-label="Aumentar quantidade de ${item.name}"
          >
            +
          </button>
        </div>
        <div class="order-panel__item-meta">
          <span class="order-panel__item-tag">${item.buffetType}</span>
          <span class="order-panel__item-price">${lineTotal}</span>
        </div>
        ${detailsMarkup}
        <button
          class="order-panel__item-remove"
          type="button"
          data-action="remove"
        >
          remover
        </button>
      `;

      itemsContainer.appendChild(line);
    });

    totalElement.textContent = formatCurrency(total);
  }

  function buildWhatsAppMessage(details) {
    if (state.size === 0) return "";

    let total = 0;
    const lines = [];

    state.forEach(({ item, quantity }) => {
      const hasReference = typeof item.referencePrice === "number";

      if (hasReference) {
        total += item.referencePrice * quantity;
      }

      const lineTotal = hasReference
        ? formatCurrency(item.referencePrice * quantity * 1)
        : item.displayPrice;

      let extraInfo = "";

      if (item.meta?.type === "buffet-configurado") {
        const mode = item.meta.modeLabel || "";
        const guests =
          typeof item.meta.guests === "number" && item.meta.guests > 0
            ? `${item.meta.guests} pessoas`
            : null;

        const groupsArr = Array.isArray(item.meta.selections)
          ? item.meta.selections
          : [];

        const selectionsText = groupsArr
          .map((g) => {
            const values = Array.isArray(g.values)
              ? g.values.join(", ")
              : g.values;
            return `${g.label}: ${values}`;
          })
          .join(" | ");

        const parts = [];
        if (guests) parts.push(guests);
        if (mode) parts.push(mode);
        if (selectionsText) parts.push(selectionsText);

        if (parts.length) {
          extraInfo = ` (${parts.join(" · ")})`;
        }
      }

      lines.push(
        `* ${quantity}x ${item.name}${extraInfo} (${item.buffetType}) · ${lineTotal}`
      );
    });

    const totalText = formatCurrency(total);

    const eventDate =
      details && details.eventDate ? details.eventDate : "a combinar";
    const guests = details && details.guests ? details.guests : "a combinar";
    const location =
      details && details.location ? details.location : "a combinar";
    const preferences =
      details && details.preferences
        ? details.preferences
        : "sem observações específicas";

    const message = `
Olá, Tia Jane! 💛 Tudo bem?
Encontrei o seu site "Delícias da Tia Jane" e montei um pedido com base no cardápio:

${lines.join("\n")}

Total de referência aproximado: ${totalText}

Informações do evento:
• Data do evento: ${eventDate}
• Número de convidados: ${guests}
• Cidade/Bairro: ${location}
• Preferências / observações: ${preferences}

Podemos conversar para ajustar os detalhes? Muito obrigado(a)! 😊
`.trim();

    return message;
  }

  function openWhatsApp(details) {
    const message = buildWhatsAppMessage(details);
    if (!message) return;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  // delegação de eventos no carrinho
  itemsContainer.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const itemEl = btn.closest("[data-order-id]");
    if (!itemEl) return;

    const id = itemEl.getAttribute("data-order-id");
    if (!id) return;

    if (action === "increase") {
      incrementQuantity(id);
    } else if (action === "decrease") {
      decrementItem(id);
    } else if (action === "remove") {
      removeItem(id);
    } else if (action === "toggle-details") {
      const detailsEl = itemEl.querySelector(".order-panel__item-details");
      const icon = btn.querySelector(".order-panel__item-toggle-icon");
      if (!detailsEl) return;

      const isHidden = detailsEl.hasAttribute("hidden");
      if (isHidden) {
        detailsEl.removeAttribute("hidden");
        if (icon) {
          icon.style.transform = "rotate(180deg)";
        }
      } else {
        detailsEl.setAttribute("hidden", "");
        if (icon) {
          icon.style.transform = "";
        }
      }
    }
  });

  sendButton.addEventListener("click", () => {
    if (state.size === 0) return;

    orderDetailsModal.open((details) => {
      openWhatsApp(details || {});
    });
  });

  return {
    handleSelect: addItem,
    addDish,
    addConfiguredBuffet,
  };
}
