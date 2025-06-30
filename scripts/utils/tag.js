function getUniqueTags(recipesList) {
  const ingredientsSet = new Set();
  const appliancesSet = new Set();
  const ustensilsSet = new Set();

  recipesList.forEach((recipe) => {
    // Ingrédients
    recipe.ingredients.forEach((item) => {
      ingredientsSet.add(normalize(item.ingredient));
    });

    // Appareil
    appliancesSet.add(normalize(recipe.appliance));

    // Ustensiles
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
    menu.innerHTML = ""; // Vider le menu

    // Ajout d'un conteneur pour l'input et l'icône
    const searchWrapper = document.createElement("div");
    searchWrapper.className = "dropdown-search-wrapper";

    // Création de l'input
    const searchInput = document.createElement("input");
    searchInput.className = "dropdown-search";
    searchInput.type = "text";

    // Création de l’icône loupe
    const searchIcon = document.createElement("i");
    searchIcon.className = "fa-solid fa-magnifying-glass search-input";

    // Ajout à la structure
    searchWrapper.appendChild(searchInput);
    searchWrapper.appendChild(searchIcon);
    menu.appendChild(searchWrapper);

    // Conteneur pour les éléments filtrables
    const itemsContainer = document.createElement("div");
    itemsContainer.className = "dropdown-items";
    menu.appendChild(itemsContainer);

    // Ajouter tous les items
    values.forEach((value) => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = value;
      itemsContainer.appendChild(item);
    });

    // Ajout logique de filtrage
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();

      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query)
          ? "block"
          : "none";
      });
    });
  });
}
