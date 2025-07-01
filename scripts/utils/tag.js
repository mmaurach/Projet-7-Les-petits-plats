const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

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
      if (selectedTags[key].includes(value)) return;

      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = value;
      item.dataset.type = key;
      item.style.cursor = "pointer";
      itemsContainer.appendChild(item);
    });

    // Recherche dans le menu
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();
      closeIcon.style.display = query.length > 0 ? "block" : "none";

      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query)
          ? "block"
          : "none";
      });
    });

    // Réinitialise la recherche
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
        const value = target.textContent.trim();

        if (!selectedTags[type].includes(value)) {
          selectedTags[type].push(value);
          displaySelectedTag(type, value);
          updateSearch();
        }
      }
    });
  });
}

function displaySelectedTag(type, value) {
  // Mapping dynamique pour insérer le tag dans le bon menu
  const container = document.querySelector(`#${type}-dropdown .selected-tags`);

  const tagEl = document.createElement("span");
  tagEl.className = `tag ${type}`;
  tagEl.innerHTML = `
    ${value}
    <i class="fa-solid fa-xmark remove-tag" data-type="${type}" data-value="${value}"></i>
  `;

  container.appendChild(tagEl);
}

// Suppression de tag
document.querySelectorAll(".selected-tags").forEach((container) => {
  container.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-tag")) {
      const type = e.target.dataset.type;
      const value = e.target.dataset.value;

      selectedTags[type] = selectedTags[type].filter((tag) => tag !== value);

      e.target.parentElement.remove();
      updateSearch();
    }
  });
});

// Fonction appelée à chaque modification (input ou tag)
function updateSearch() {
  const inputValue = document.querySelector("#main-search").value.trim();
  const filteredRecipes = search(inputValue, recipes);

  displayRecipes(filteredRecipes);
  updateRecipeCount(filteredRecipes.length);

  const newTags = getUniqueTags(filteredRecipes);
  populateDropdowns(newTags);
  setupTagSelection();
}
