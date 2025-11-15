// assets/js/components/buffetConfigModal.js
// Responsabilidade: modal onde o cliente configura o buffet
// (convidados, opções, "A moda da Tia Jane!") e devolve
// um config + preço estimado com lógica coerente.

function parsePriceString(priceStr) {
  if (typeof priceStr !== "string") return null;
  const normalized = priceStr
    .replace(/[^\d,,-.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? numeric : null;
}

function formatCurrency(value) {
  const safe = typeof value === "number" ? value : 0;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(safe);
}

// traduz categoria de custo da opção em peso numérico
function costWeightFromCategory(category) {
  switch (category) {
    case "low":
      return 0.9;
    case "medium":
      return 1.0;
    case "high":
      return 1.15;
    case "premium":
      return 1.3;
    default:
      return 1.0;
  }
}

export function initBuffetConfigModal() {
  const modal = document.getElementById("buffetConfigModal");
  if (!modal) {
    // fallback inofensivo
    return {
      open(_item, onConfirm) {
        if (typeof onConfirm === "function") {
          onConfirm(null);
        }
      },
    };
  }

  const overlay = modal.querySelector(".buffet-modal__overlay");
  const content = modal.querySelector(".buffet-modal__content");
  const closeButtons = modal.querySelectorAll("[data-buffet-close]");

  const titleEl = document.getElementById("buffetConfigTitle");
  const subtitleEl = document.getElementById("buffetConfigSubtitle");
  const guestsInput = document.getElementById("buffetConfigGuests");
  const guestsHintEl = document.getElementById("buffetConfigGuestsHint");
  const quickButton = document.getElementById("buffetConfigQuick");
  const optionsContainer = document.getElementById("buffetConfigOptions");
  const priceEl = document.getElementById("buffetConfigPrice");
  const noteEl = document.getElementById("buffetConfigNote");
  const confirmButton = document.getElementById("buffetConfigConfirm");

  let currentItem = null;
  let currentGuests = null;
  let selections = {};
  let usedQuickMode = false;
  let confirmCallback = null;

  function getConfig(item) {
    return item && item.config ? item.config : {};
  }

  function getBaseGuests(item) {
    const cfg = getConfig(item);
    return typeof cfg.baseGuests === "number" && cfg.baseGuests > 0
      ? cfg.baseGuests
      : 10;
  }

  function getBasePrice(item) {
    if (!item) return 0;
    if (typeof item.referencePrice === "number") {
      return item.referencePrice;
    }
    const parsed = parsePriceString(item.displayPrice);
    return parsed || 0;
  }

  function getOptionGroups(item) {
    const cfg = getConfig(item);
    return Array.isArray(cfg.optionGroups) ? cfg.optionGroups : [];
  }

  function buildSelectionsFromDefaults(item) {
    const groups = getOptionGroups(item);
    const initial = {};

    groups.forEach((group) => {
      if (group.type === "single") {
        initial[group.id] = group.default || (group.options[0]?.id ?? null);
      } else if (group.type === "multi") {
        if (Array.isArray(group.default) && group.default.length > 0) {
          initial[group.id] = [...group.default];
        } else if (group.options && group.options.length > 0) {
          initial[group.id] = [group.options[0].id];
        } else {
          initial[group.id] = [];
        }
      }
    });

    return initial;
  }

  function renderGroups(item, currentSelections) {
    const groups = getOptionGroups(item);
    optionsContainer.innerHTML = "";

    if (!groups.length) {
      optionsContainer.style.display = "none";
      return;
    }

    optionsContainer.style.display = "";

    groups.forEach((group) => {
      const groupEl = document.createElement("section");
      groupEl.className = "modal-buffet-group";
      groupEl.setAttribute("data-group-id", group.id);

      const title = document.createElement("h4");
      title.className = "modal-buffet-group__title";
      title.textContent = group.label;
      groupEl.appendChild(title);

      const optionsEl = document.createElement("div");
      optionsEl.className = "modal-buffet-group__options";

      const selectedValues = currentSelections[group.id];

      group.options.forEach((opt) => {
        const label = document.createElement("label");
        label.className = "modal-buffet-group__option";

        const input = document.createElement("input");
        input.type = group.type === "single" ? "radio" : "checkbox";
        input.name = `buffetGroup_${group.id}`;
        input.value = opt.id;
        input.dataset.groupId = group.id;
        input.dataset.optionId = opt.id;

        if (group.type === "single") {
          input.checked = selectedValues === opt.id;
        } else {
          input.checked =
            Array.isArray(selectedValues) && selectedValues.includes(opt.id);
        }

        const span = document.createElement("span");
        span.textContent = opt.label;

        label.appendChild(input);
        label.appendChild(span);
        optionsEl.appendChild(label);
      });

      groupEl.appendChild(optionsEl);
      optionsContainer.appendChild(groupEl);
    });
  }

  // cálculo inteligente de preço
  function calculateBuffetPrice(item, guests, currentSelections) {
    const baseGuests = getBaseGuests(item);
    const basePrice = getBasePrice(item);
    if (!baseGuests || !basePrice) return 0;

    const effectiveGuests =
      typeof guests === "number" && guests > 0 ? guests : baseGuests;

    const basePerGuest = basePrice / baseGuests;
    const groups = getOptionGroups(item);

    let factor = 1;

    groups.forEach((group) => {
      const groupPricing = group.pricing || {};
      const baseCount =
        typeof groupPricing.baseCount === "number"
          ? groupPricing.baseCount
          : group.type === "single"
          ? 1
          : Array.isArray(group.default)
          ? group.default.length
          : 1;

      const extraPercent =
        typeof groupPricing.extraPerOptionPercent === "number"
          ? groupPricing.extraPerOptionPercent
          : 0;

      const defaultIds = Array.isArray(group.default)
        ? group.default
        : group.default
        ? [group.default]
        : [];

      const selected = currentSelections[group.id];
      const selectedIds =
        group.type === "single"
          ? selected
            ? [selected]
            : []
          : Array.isArray(selected)
          ? selected
          : selected
          ? [selected]
          : [];

      const selectedCount = selectedIds.length;

      // 1) cobrar opções extras além do padrão
      if (extraPercent && selectedCount > baseCount) {
        const extraCount = selectedCount - baseCount;
        factor *= 1 + (extraPercent / 100) * extraCount;
      }

      // 2) custo relativo das opções (strogonoff vs carne assada etc.)
      function avgWeight(ids) {
        if (!ids || !ids.length) return 1;
        let sum = 0;
        let count = 0;
        ids.forEach((id) => {
          const opt = group.options.find((o) => o.id === id);
          const w = costWeightFromCategory(opt?.costCategory);
          sum += w;
          count++;
        });
        return count ? sum / count : 1;
      }

      const baseWeight = defaultIds.length ? avgWeight(defaultIds) : 1;
      const selWeight = selectedIds.length
        ? avgWeight(selectedIds)
        : baseWeight;

      if (baseWeight && selWeight) {
        factor *= selWeight / baseWeight;
      }
    });

    const perGuestAdjusted = basePerGuest * factor;
    const total = perGuestAdjusted * effectiveGuests;

    // arredonda pra múltiplos de 10 (cara de “preço de buffet”)
    return Math.round(total / 10) * 10;
  }

  function updatePrice() {
    if (!currentItem) return 0;

    const baseGuests = getBaseGuests(currentItem);
    const guests =
      typeof currentGuests === "number" && currentGuests > 0
        ? currentGuests
        : baseGuests;

    const estimated = calculateBuffetPrice(
      currentItem,
      guests,
      selections || {}
    );

    priceEl.textContent = formatCurrency(estimated);

    const cfg = getConfig(currentItem);
    const quickLabel = cfg.quickModeLabel || "Buffet montado pela Tia Jane";

    if (noteEl) {
      const modeText = usedQuickMode
        ? `"${quickLabel}" selecionado como base.`
        : "Você pode ajustar convidados e opções conforme o seu gosto.";
      noteEl.textContent = `${modeText} Valores são estimativas de referência e podem ser ajustados pela Tia Jane.`;
    }

    return estimated;
  }

  function open(item, onConfirm) {
    currentItem = item;
    confirmCallback = typeof onConfirm === "function" ? onConfirm : null;
    usedQuickMode = false;

    const baseGuests = getBaseGuests(item);
    currentGuests = baseGuests;
    selections = buildSelectionsFromDefaults(item);

    if (titleEl) titleEl.textContent = item.name;
    if (subtitleEl)
      subtitleEl.textContent =
        item.description ||
        "Monte o buffet do jeito que combina com o seu evento.";

    if (guestsInput) {
      guestsInput.value = String(baseGuests);
    }
    if (guestsHintEl) {
      guestsHintEl.textContent = `Referência original: até ${baseGuests} pessoas.`;
    }

    const cfg = getConfig(item);
    if (quickButton) {
      quickButton.textContent = cfg.quickModeLabel || "A moda da Tia Jane!";
    }

    renderGroups(item, selections);
    updatePrice();

    modal.classList.remove("buffet-modal--hidden");
    modal.classList.add("buffet-modal--visible");

    if (content) {
      content.style.opacity = "1";
      content.style.transform = "translateY(0)";
    }

    if (guestsInput && typeof guestsInput.focus === "function") {
      setTimeout(() => guestsInput.focus(), 80);
    }
  }

  function hide() {
    modal.classList.add("buffet-modal--hidden");
    modal.classList.remove("buffet-modal--visible");

    if (content) {
      content.style.opacity = "";
      content.style.transform = "";
    }

    currentItem = null;
    confirmCallback = null;
  }

  // eventos

  if (guestsInput) {
    guestsInput.addEventListener("input", () => {
      const raw = guestsInput.value.trim();
      const n = Number(raw);
      currentGuests = Number.isFinite(n) && n > 0 ? n : null;
      usedQuickMode = false;
      updatePrice();
    });
  }

  if (optionsContainer) {
    optionsContainer.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;

      const groupId = target.dataset.groupId;
      const optionId = target.dataset.optionId;
      if (!groupId || !optionId) return;

      const groups = getOptionGroups(currentItem);
      const group = groups.find((g) => g.id === groupId);
      if (!group) return;

      usedQuickMode = false;

      if (group.type === "single") {
        selections[groupId] = optionId;
      } else {
        const arr = Array.isArray(selections[groupId])
          ? [...selections[groupId]]
          : [];
        if (target.checked) {
          if (!arr.includes(optionId)) arr.push(optionId);
        } else {
          const idx = arr.indexOf(optionId);
          if (idx >= 0) arr.splice(idx, 1);
        }
        selections[groupId] = arr;
      }

      updatePrice();
    });
  }

  if (quickButton) {
    quickButton.addEventListener("click", () => {
      if (!currentItem) return;

      const baseGuests = getBaseGuests(currentItem);
      currentGuests = baseGuests;

      if (guestsInput) guestsInput.value = String(baseGuests);

      selections = buildSelectionsFromDefaults(currentItem);
      usedQuickMode = true;

      renderGroups(currentItem, selections);
      updatePrice();
    });
  }

  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      if (!currentItem) return;

      const baseGuests = getBaseGuests(currentItem);
      const guests =
        typeof currentGuests === "number" && currentGuests > 0
          ? currentGuests
          : baseGuests;

      const estimated = calculateBuffetPrice(
        currentItem,
        guests,
        selections || {}
      );

      const groups = getOptionGroups(currentItem);
      const selectionGroups = [];

      groups.forEach((group) => {
        const selected = selections[group.id];
        if (!selected) return;

        const lookupLabel = (id) =>
          group.options.find((o) => o.id === id)?.label || id;

        if (group.type === "single") {
          const label = lookupLabel(selected);
          selectionGroups.push({
            id: group.id,
            label: group.label,
            values: [label],
          });
        } else {
          const arr = Array.isArray(selected) ? selected : [selected];
          const values = arr.map(lookupLabel);
          if (values.length) {
            selectionGroups.push({
              id: group.id,
              label: group.label,
              values,
            });
          }
        }
      });

      const result = {
        guests,
        mode: usedQuickMode ? "tia-jane" : "custom",
        selections: selectionGroups,
        estimatedPrice: estimated,
      };

      const cb = confirmCallback;
      hide();

      if (cb) cb(result);
    });
  }

  [...closeButtons].forEach((btn) => btn.addEventListener("click", hide));
  if (overlay) overlay.addEventListener("click", hide);

  return {
    open,
  };
}
