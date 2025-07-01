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

  return {
    ingredients: Array.from(ingredientsMap.entries()).map(
      ([value, display]) => ({ value, display })
    ),
    appliances: Array.from(appliancesMap.entries()).map(([value, display]) => ({
      value,
      display,
    })),
    ustensils: Array.from(ustensilsMap.entries()).map(([value, display]) => ({
      value,
      display,
    })),
  };
}

function populateDropdowns(tags) {
  const menus = {
    ingredients: document.querySelector("#ingredients-dropdown .dropdown-menu"),
    appliances: document.querySelector("#appareils-dropdown .dropdown-menu"),
    ustensils: document.querySelector("#ustensiles-dropdown .dropdown-menu"),
  };

  Object.entries(tags).forEach(([key, values]) => {
    const menu = menus[key];
    const searchInput = menu.querySelector(".dropdown-search");
    const closeIcon = menu.querySelector(".close-input");
    const itemsContainer = menu.querySelector(".dropdown-items");

    itemsContainer.innerHTML = "";

    values.forEach(({ value, display }) => {
      if (selectedTags[key].includes(value)) return;

      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = display;
      item.dataset.type = key;
      item.dataset.value = value;
      item.style.cursor = "pointer";
      itemsContainer.appendChild(item);
    });

    // Recherche
    searchInput.addEventListener("input", () => {
      const query = normalize(searchInput.value.trim());
      closeIcon.style.display = query.length > 0 ? "block" : "none";

      Array.from(itemsContainer.children).forEach((item) => {
        const itemText = normalize(item.textContent.trim());
        item.style.display = itemText.includes(query) ? "block" : "none";
      });
    });

    // Reset input
    closeIcon.addEventListener("click", () => {
      searchInput.value = "";
      closeIcon.style.display = "none";

      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = "block";
      });
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

  const dropdownContainer = document.querySelector(
    `#${typeToId[type]} .selected-tags`
  );
  const globalContainer = document.querySelector(".global-selected-tags");

  // Crée le tag local (dans le menu déroulant)
  const tagEl = document.createElement("span");
  tagEl.className = `tag ${type}`;
  tagEl.innerHTML = `
    ${displayText}
    <i class="fa-solid fa-xmark remove-tag" data-type="${type}" data-value="${value}"></i>
  `;

  if (dropdownContainer) {
    dropdownContainer.appendChild(tagEl);
  }

  // Crée le tag global (en haut)
  const globalTag = document.createElement("span");
  globalTag.className = `global-tag ${type}`;
  globalTag.innerHTML = `
    ${displayText}
    <i class="fa-solid fa-xmark remove-tag" data-type="${type}" data-value="${value}"></i>
  `;
  globalContainer.appendChild(globalTag);
}

// Suppression des tags sélectionnés (globaux ou locaux)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-tag")) {
    const type = e.target.dataset.type;
    const value = e.target.dataset.value;

    selectedTags[type] = selectedTags[type].filter((tag) => tag !== value);

    // Supprime tous les tags avec ce type+value
    document
      .querySelectorAll(
        `.remove-tag[data-type="${type}"][data-value="${value}"]`
      )
      .forEach((el) => el.parentElement.remove());

    updateSearch();
  }
});
