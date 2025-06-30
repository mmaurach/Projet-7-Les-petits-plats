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

    // Récupération des éléments HTML existants
    const searchInput = menu.querySelector(".dropdown-search");
    const closeIcon = menu.querySelector(".close-input");
    const itemsContainer = menu.querySelector(".dropdown-items");

    // Nettoyer les anciens items
    itemsContainer.innerHTML = "";

    // Ajouter dynamiquement les tags dans le menu
    values.forEach((value) => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.textContent = value;
      itemsContainer.appendChild(item);
    });

    // Logique de recherche
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase().trim();

      closeIcon.style.display = query.length > 0 ? "block" : "none";

      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query)
          ? "block"
          : "none";
      });
    });

    // Logique de suppression du texte avec l'icône "x"
    closeIcon.addEventListener("click", () => {
      searchInput.value = "";
      closeIcon.style.display = "none";

      Array.from(itemsContainer.children).forEach((item) => {
        item.style.display = "block";
      });
    });
  });
}
