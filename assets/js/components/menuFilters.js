// assets/js/components/menuFilters.js
// Responsabilidade: criar filtros por tipo de buffet
// e avisar quem está responsável por renderizar o cardápio.

export function initMenuFilters(menuItems, onFilterChange) {
  const container = document.getElementById("menuFilters");
  if (!container) return;

  const typesSet = new Set();
  menuItems.forEach((item) => {
    if (item.buffetType) {
      typesSet.add(item.buffetType);
    }
  });

  const uniqueTypes = Array.from(typesSet);

  const filters = [
    { label: "Todos", value: "all" },
    ...uniqueTypes.map((type) => ({
      label: type,
      value: type,
    })),
  ];

  let activeValue = "all";

  function renderButtons() {
    container.innerHTML = "";

    filters.forEach((filter) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "menu-filter" +
        (filter.value === activeValue ? " menu-filter--active" : "");
      btn.textContent = filter.label;
      btn.setAttribute("data-filter-value", filter.value);

      btn.addEventListener("click", () => {
        if (activeValue === filter.value) return;
        activeValue = filter.value;

        // Atualiza estado visual
        container.querySelectorAll(".menu-filter").forEach((buttonEl) => {
          const val = buttonEl.getAttribute("data-filter-value");
          buttonEl.classList.toggle("menu-filter--active", val === activeValue);
        });

        if (typeof onFilterChange === "function") {
          onFilterChange(activeValue);
        }
      });

      container.appendChild(btn);
    });
  }

  renderButtons();

  // Render inicial com "Todos"
  if (typeof onFilterChange === "function") {
    onFilterChange(activeValue);
  }
}
