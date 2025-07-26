// Objet pour stocker les tags sélectionnés par catégorie
const selectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

// Fonction pour extraire tous les tags uniques à partir de la liste des recettes
function getUniqueTags(recipesList) {
  // On utilise des Map pour éviter les doublons et garder une association entre la valeur normalisée et l'affichage original
  const ingredientsMap = new Map();
  const appliancesMap = new Map();
  const ustensilsMap = new Map();

  recipesList.forEach((recipe) => {
    // On parcourt chaque ingrédient et on l'ajoute à la map
    recipe.ingredients.forEach((item) => {
      const display = item.ingredient.trim();
      const value = normalize(display);
      ingredientsMap.set(value, display);
    });

    // On fait la même chose pour l’appareil
    const applianceDisplay = recipe.appliance.trim();
    const applianceValue = normalize(applianceDisplay);
    appliancesMap.set(applianceValue, applianceDisplay);

    // Et pour chaque ustensile
    recipe.ustensils.forEach((item) => {
      const display = item.trim();
      const value = normalize(display);
      ustensilsMap.set(value, display);
    });
  });

  // Fonction pour transformer une Map en tableau d'objets { value, display }
  const mapToArray = (map) =>
    Array.from(map.entries()).map(([value, display]) => ({ value, display }));

  // Retourne tous les tags uniques par catégorie
  return {
    ingredients: mapToArray(ingredientsMap),
    appliances: mapToArray(appliancesMap),
    ustensils: mapToArray(ustensilsMap),
  };
}

// Injecte les tags dans leurs menus déroulants respectifs
function populateDropdowns(tags) {
  // Récupération des conteneurs pour chaque type de tag
  const menus = {
    ingredients: document.querySelector("#ingredients-dropdown .dropdown-menu"),
    appliances: document.querySelector("#appareils-dropdown .dropdown-menu"),
    ustensils: document.querySelector("#ustensiles-dropdown .dropdown-menu"),
  };

  // Pour chaque type de tag (ingrédients, appareils, ustensiles)
  Object.entries(tags).forEach(([type, values]) => {
    const menu = menus[type];
    const searchInput = menu.querySelector(".dropdown-search");
    const closeIcon = menu.querySelector(".close-input");
    const itemsContainer = menu.querySelector(".dropdown-items");

    // On vide l’ancienne liste d’éléments
    itemsContainer.innerHTML = "";

    // On ajoute les éléments un par un si pas déjà sélectionnés
    values.forEach(({ value, display }) => {
      if (!selectedTags[type].includes(value)) {
        const item = createDropdownItem(display, type, value);
        itemsContainer.appendChild(item);
      }
    });

    // Mise à jour dynamique selon la saisie utilisateur dans le champ de recherche
    searchInput.addEventListener("input", () => {
      const query = normalize(searchInput.value.trim());
      toggleCloseIcon(closeIcon, query);
      filterDropdownItems(itemsContainer, query);
    });

    // Clique sur l’icône croix pour effacer la recherche
    closeIcon.addEventListener("click", () => {
      searchInput.value = "";
      toggleCloseIcon(closeIcon, "");
      filterDropdownItems(itemsContainer, "");
    });
  });
}

// Active le clic sur un tag pour le sélectionner
function setupTagSelection() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.addEventListener("click", (e) => {
      const target = e.target;
      if (target.classList.contains("dropdown-item")) {
        const type = target.dataset.type;
        const value = target.dataset.value;
        const display = target.textContent.trim();

        // Ajoute le tag s'il n’est pas déjà sélectionné
        if (!selectedTags[type].includes(value)) {
          selectedTags[type].push(value);
          displaySelectedTag(type, value, display);
          updateSearch(); // Rafraîchit les résultats
        }
      }
    });
  });
}

// Affiche le tag sélectionné dans le menu local et dans la zone globale
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

  // Création des éléments DOM à afficher
  const tag = createTagElement(type, value, displayText, "tag");
  const globalTag = createTagElement(type, value, displayText, "global-tag");

  if (localContainer) localContainer.appendChild(tag);
  if (globalContainer) globalContainer.appendChild(globalTag);
}

// Crée un élément HTML pour chaque item du menu déroulant
function createDropdownItem(display, type, value) {
  const item = document.createElement("div");
  item.className = "dropdown-item";
  item.textContent = display;
  item.dataset.type = type;
  item.dataset.value = value;
  item.style.cursor = "pointer";
  return item;
}

// Crée un élément HTML pour chaque tag sélectionné
function createTagElement(type, value, display, tagClass = "tag") {
  const span = document.createElement("span");
  span.className = `${tagClass} ${type}`;
  span.innerHTML = `
    ${display}
    <i class="fa-solid fa-xmark remove-tag" data-type="${type}" data-value="${value}"></i>
  `;
  return span;
}

// Affiche ou masque l’icône de fermeture (croix) selon qu’il y ait une saisie ou non
function toggleCloseIcon(icon, query) {
  icon.style.display = query.length > 0 ? "block" : "none";
}

// Filtre les items du menu déroulant selon la saisie utilisateur
function filterDropdownItems(container, query) {
  Array.from(container.children).forEach((item) => {
    const text = normalize(item.textContent.trim());
    item.style.display = text.includes(query) ? "block" : "none";
  });
}

// Gère la suppression des tags (clic sur la croix)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-tag")) {
    const type = e.target.dataset.type;
    const value = e.target.dataset.value;

    // Supprime le tag de la liste sélectionnée
    selectedTags[type] = selectedTags[type].filter((tag) => tag !== value);

    // Supprime visuellement le tag dans tous les emplacements
    document
      .querySelectorAll(
        `.remove-tag[data-type="${type}"][data-value="${value}"]`
      )
      .forEach((el) => el.parentElement.remove());

    updateSearch(); // Met à jour les résultats de recherche
  }
});
