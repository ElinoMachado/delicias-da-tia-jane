// assets/js/components/menuSection.js
export function renderMenuSection(menuItems, onItemSelected) {
  const container = document.getElementById("menuList");
  if (!container) return;

  container.innerHTML = "";

  const selectCallback =
    typeof onItemSelected === "function" ? onItemSelected : () => {};

  const groups = new Map();

  menuItems.forEach((item) => {
    if (!groups.has(item.section)) {
      groups.set(item.section, []);
    }
    groups.get(item.section).push(item);
  });

  groups.forEach((items, sectionName) => {
    const groupEl = document.createElement("section");
    groupEl.className = "menu-group";

    const titleEl = document.createElement("h3");
    titleEl.className = "menu-group__title";
    titleEl.textContent = sectionName;
    groupEl.appendChild(titleEl);

    const gridEl = document.createElement("div");
    gridEl.className = "menu-group__grid";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "menu-card";
      card.setAttribute("data-menu-id", item.id);

      const detailsList =
        item.details && item.details.length
          ? item.details
              .map((detail) => `<li class="menu-card__detail">${detail}</li>`)
              .join("")
          : "";

      card.innerHTML = `
        <div class="menu-card__header">
          <span class="menu-card__badge">${item.buffetType}</span>
          ${
            item.serves
              ? `<span class="menu-card__serves">${item.serves}</span>`
              : ""
          }
        </div>
        <h3 class="menu-card__title">${item.name}</h3>
        ${
          item.description
            ? `<p class="menu-card__description">${item.description}</p>`
            : ""
        }
        ${
          detailsList
            ? `<ul class="menu-card__details">${detailsList}</ul>`
            : ""
        }
        <div class="menu-card__footer">
          <div class="menu-card__price-block">
            <span class="menu-card__price">${item.displayPrice}</span>
            ${
              item.note
                ? `<span class="menu-card__note">${item.note}</span>`
                : ""
            }
          </div>
          <button
            class="button button--primary menu-card__button"
            type="button"
            data-menu-id="${item.id}"
          >
            Eu quero!
          </button>
        </div>
      `;

      const button = card.querySelector(".menu-card__button");
      if (button) {
        button.addEventListener("click", () => {
          selectCallback(item.id);
        });
      }

      gridEl.appendChild(card);
    });

    groupEl.appendChild(gridEl);
    container.appendChild(groupEl);
  });
}
