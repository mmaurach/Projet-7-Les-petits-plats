const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

function getUniqueTags(recipesList) {
  const ingredientsMap = new Map();
  const appliancesMap = new Map();
  const ustensilsMap = new Map();

  recipesList.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
      const display = item.ingredient.trim();
      const value = normalize(display);
      ingredientsMap.set(value, display);
    });

    const applianceDisplay = recipe.appliance.trim();
    const applianceValue = normalize(applianceDisplay);
    appliancesMap.set(applianceValue, applianceDisplay);

    recipe.ustensils.forEach((item) => {
      const display = item.trim();
      const value = normalize(display);
      ustensilsMap.set(value, display);
    });
  });

  const mapToArray = (map) =>
    Array.from(map.entries()).map(([value, display]) => ({ value, display }));

  return {
    ingredients: mapToArray(ingredientsMap),
    appliances: mapToArray(appliancesMap),
    ustensils: mapToArray(ustensilsMap),
  };
}

function populateDropdowns(tags) {
  const menus = {
    ingredients: document.querySelector("#ingredients-dropdown .dropdown-menu"),
    appliances: document.querySelector("#appareils-dropdown .dropdown-menu"),
    ustensils: document.querySelector("#ustensiles-dropdown .dropdown-menu"),
  };

  Object.entries(tags).forEach(([type, values]) => {
    const menu = menus[type];
    const searchInput = menu.querySelector(".dropdown-search");
    const closeIcon = menu.querySelector(".close-input");
    const itemsContainer = menu.querySelector(".dropdown-items");

    itemsContainer.innerHTML = "";

    values.forEach(({ value, display }) => {
      if (!selectedTags[type].includes(value)) {
        const item = createDropdownItem(display, type, value);
        itemsContainer.appendChild(item);
      }
    });

    searchInput.addEventListener("input", () => {
      const query = normalize(searchInput.value.trim());
      toggleCloseIcon(closeIcon, query);
      filterDropdownItems(itemsContainer, query);
    });

    closeIcon.addEventListener("click", () => {
      searchInput.value = "";
      toggleCloseIcon(closeIcon, "");
      filterDropdownItems(itemsContainer, "");
    });
  });
}

function setupTagSelection() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("dropdown-item")) {
        const type = target.dataset.type;
        const value = target.dataset.value;
        const display = target.textContent.trim();

        if (!selectedTags[type].includes(value)) {
          selectedTags[type].push(value);
          displaySelectedTag(type, value, display);
          updateSearch();
        }
      }
    });
  });
}

function displaySelectedTag(type, value, displayText) {
  const typeToId = {
    ingredients: "ingredients-dropdown",
    appliances: "appareils-dropdown",
    ustensils: "ustensiles-dropdown",
  };

  const localContainer = document.querySelector(
    `#${typeToId[type]} .selected-tags`
  );
  const globalContainer = document.querySelector(".global-selected-tags");

  const tag = createTagElement(type, value, displayText, "tag");
  const globalTag = createTagElement(type, value, displayText, "global-tag");

  if (localContainer) localContainer.appendChild(tag);
  if (globalContainer) globalContainer.appendChild(globalTag);
}

function createDropdownItem(display, type, value) {
  const item = document.createElement("div");
  item.className = "dropdown-item";
  item.textContent = display;
  item.dataset.type = type;
  item.dataset.value = value;
  item.style.cursor = "pointer";
  return item;
}

function createTagElement(type, value, display, tagClass = "tag") {
  const span = document.createElement("span");
  span.className = `${tagClass} ${type}`;
  span.innerHTML = `
    ${display}
    <i class="fa-solid fa-xmark remove-tag" data-type="${type}" data-value="${value}"></i>
  `;
  return span;
}

function toggleCloseIcon(icon, query) {
  icon.style.display = query.length > 0 ? "block" : "none";
}

function filterDropdownItems(container, query) {
  Array.from(container.children).forEach((item) => {
    const text = normalize(item.textContent.trim());
    item.style.display = text.includes(query) ? "block" : "none";
  });
}

// Suppression des tags sélectionnés (globaux ou locaux)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-tag")) {
    const type = e.target.dataset.type;
    const value = e.target.dataset.value;

    selectedTags[type] = selectedTags[type].filter((tag) => tag !== value);

    document
      .querySelectorAll(
        `.remove-tag[data-type="${type}"][data-value="${value}"]`
      )
      .forEach((el) => el.parentElement.remove());

    updateSearch();
  }
});
