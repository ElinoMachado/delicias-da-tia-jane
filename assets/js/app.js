// assets/js/app.js
// Orquestração: importa dados e componentes, inicializa o site.

import { dishes } from "./data/dishesData.js";
import { menuItems } from "./data/menuData.js";

import { initScrollAnimations } from "./components/scrollAnimation.js";
import { initDishModal } from "./components/modalGallery.js";
import { initHeroParallax } from "./components/heroParallax.js";
import { renderMenuSection } from "./components/menuSection.js";
import { initMenuCart } from "./components/menuCart.js";
import { initMenuFilters } from "./components/menuFilters.js";
import { initBuffetConfigModal } from "./components/buffetConfigModal.js";

function renderDishes(cart) {
  const grid = document.getElementById("dishesGrid");
  if (!grid) return;

  const fragment = document.createDocumentFragment();

  dishes.forEach((dish) => {
    const card = document.createElement("article");
    card.className = "dish-card";
    card.setAttribute("data-dish-id", dish.id);

    card.innerHTML = `
      <div class="dish-card__image" style="background-image: url('${
        dish.image
      }')">
        <span class="dish-card__badge">${dish.badge}</span>
      </div>
      <div class="dish-card__body">
        <h3 class="dish-card__title">${dish.name}</h3>
        <p class="dish-card__description">${dish.description}</p>
        <div class="dish-card__meta">
          <span class="dish-card__price">${dish.price}</span>
          <div class="dish-card__tags">
            ${dish.tags
              .map((tag) => `<span class="dish-card__tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
        <div class="dish-card__footer">
          <button
            class="button button--primary dish-card__cta"
            type="button"
            data-dish-id="${dish.id}"
          >
            Eu quero!
          </button>
        </div>
      </div>
    `;

    const ctaButton = card.querySelector(".dish-card__cta");

    if (ctaButton && cart && typeof cart.addDish === "function") {
      ctaButton.addEventListener("click", (event) => {
        event.stopPropagation();
        cart.addDish(dish);
      });
    }

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

function initNavToggle() {
  const nav = document.querySelector(".main-nav");
  const toggle = document.querySelector(".main-nav__toggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("main-nav--open");
  });

  nav.addEventListener("click", (event) => {
    const link = event.target.closest(".main-nav__link");
    if (!link) return;

    nav.classList.remove("main-nav--open");
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('.main-nav__link[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initApp() {
  const cart = initMenuCart(menuItems);
  const buffetModal = initBuffetConfigModal();

  renderDishes(cart);
  initNavToggle();
  initSmoothScroll();
  initScrollAnimations();
  initDishModal(dishes);
  initHeroParallax();

  function handleBuffetClick(itemId) {
    const buffetItem = menuItems.find((m) => m.id === itemId);
    if (!buffetItem) return;

    buffetModal.open(buffetItem, (config) => {
      if (!config) return;
      if (typeof cart.addConfiguredBuffet === "function") {
        cart.addConfiguredBuffet(buffetItem, config);
      }
    });
  }

  function applyFilter(filterValue) {
    const filtered =
      !filterValue || filterValue === "all"
        ? menuItems
        : menuItems.filter((item) => item.buffetType === filterValue);

    renderMenuSection(filtered, handleBuffetClick);
  }

  initMenuFilters(menuItems, applyFilter);
}

document.addEventListener("DOMContentLoaded", initApp);
