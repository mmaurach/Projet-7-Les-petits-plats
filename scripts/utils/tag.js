const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

// Mapping pour cibler le bon menu selon le type
const typeToDropdownId = {
  ingredients: "ingredients-dropdown",
  appliances: "appareils-dropdown",
  ustensils: "ustensiles-dropdown",
};

// --- Extraction des tags ---
function getUniqueTags(recipesList) {
  const ingredientsSet = new Set();
  const appliancesSet = new Set();
  const ustensilsSet = new Set();

  recipesList.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
      ingredientsSet.add(normalize(item.ingredient));
    });
    appliancesSet.add(normalize(recipe.appliance));
    recipe.ustensils.forEach((item) => {
      ustensilsSet.add(normalize(item));
    });
  });

  return {
    ingredients: Array.from(ingredientsSet),
    appliances: Array.from(appliancesSet),
    ustensils: Array.from(ustensilsSet),
  };
}

// --- Remplissage des menus déroulants ---
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

    values.forEach((value) => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = value;
      item.dataset.type = key;
      item.style.cursor = "pointer";
      itemsContainer.appendChild(item);
    });

    // Recherche dans les tags
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      closeIcon.style.display = query.length > 0 ? "block" : "none";

      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query)
          ? "block"
          : "none";
      });
    });

    closeIcon.addEventListener("click", () => {
      searchInput.value = "";
      closeIcon.style.display = "none";
      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = "block";
      });
    });
  });
}

// --- Gestion de la sélection de tag ---
function setupTagSelection() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("dropdown-item")) {
        const type = target.dataset.type;
        const value = target.textContent.trim();

        if (!selectedTags[type].includes(value)) {
          selectedTags[type].push(value);
          displaySelectedTag(type, value);
          target.style.display = "none";
          updateSearch(); // À connecter à advancedSearch plus tard
        }
      }
    });
  });
}

// --- Affichage du tag sélectionné dans le bon menu ---
function displaySelectedTag(type, value) {
  const dropdownId = typeToDropdownId[type];
  const container = document.querySelector(`#${dropdownId} .selected-tags`);

  const tagEl = document.createElement("span");
  tagEl.className = `tag ${type}`;
  tagEl.innerHTML = `
    ${value}
    <i class="fa-solid fa-xmark remove-tag" data-type="${type}" data-value="${value}" style="cursor:pointer;"></i>
  `;

  container.appendChild(tagEl);
}

// --- Suppression d’un tag sélectionné ---
document.querySelectorAll(".dropdown-menu").forEach((menu) => {
  const selectedTagsContainer = menu.querySelector(".selected-tags");
  selectedTagsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-tag")) {
      const type = e.target.dataset.type;
      const value = e.target.dataset.value;

      // Mise à jour du tableau
      selectedTags[type] = selectedTags[type].filter((tag) => tag !== value);

      // Retirer du DOM
      e.target.parentElement.remove();

      // Réaffichage dans la liste
      const dropdownId = typeToDropdownId[type];
      const menuElement = document.querySelector(
        `#${dropdownId} .dropdown-menu`
      );
      const items = menuElement.querySelectorAll(".dropdown-item");

      items.forEach((item) => {
        if (normalize(item.textContent) === normalize(value)) {
          item.style.display = "block";
        }
      });

      updateSearch(); // À connecter à advancedSearch plus tard
    }
  });
});
