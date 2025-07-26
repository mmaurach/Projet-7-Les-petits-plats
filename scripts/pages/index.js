// Affiche les recettes dans le DOM
function displayRecipes(recipes) {
  const section = document.querySelector(".recipes-container"); // Sélectionne le conteneur où seront affichées les cartes recettes
  section.innerHTML = ""; // Vide le conteneur avant de réafficher les nouvelles recettes

  recipes.forEach((recipe) => {
    const template = recipeTemplate(recipe); // Crée un objet de template pour chaque recette
    const recipeCard = template.getRecipeCardDOM(); // Génère le DOM de la carte recette
    section.appendChild(recipeCard); // Ajoute la carte à la section
  });
}

// Met à jour le compteur de recettes affichées
function updateRecipeCount(count) {
  const recipeCountSpan = document.querySelector(".recipe-count"); // Sélectionne l’élément affichant le nombre de recettes
  recipeCountSpan.textContent = `${count} recette${count > 1 ? "s" : ""}`; // Met à jour le texte, en ajoutant un "s" si besoin
}

// Initialise la recherche globale
function setupSearch() {
  const searchInput = document.querySelector("#main-search"); // Champ principal de recherche
  const closeIcon = document.querySelector(".close-icon"); // Icône croix pour effacer le champ

  // Lorsqu’on tape dans le champ de recherche
  searchInput.addEventListener("input", (e) => {
    const inputValue = e.target.value.trim(); // On récupère la valeur saisie sans les espaces

    // Affiche ou masque la croix en fonction de la présence de texte
    closeIcon.style.display = inputValue.length > 0 ? "block" : "none";

    // Met à jour les recettes et les tags correspondants
    updateSearch();
  });

  // Lorsqu'on clique sur la croix pour vider le champ
  closeIcon.addEventListener("click", () => {
    searchInput.value = ""; // Vide le champ
    closeIcon.style.display = "none"; // Cache la croix

    // Déclenche manuellement l’événement input pour relancer la recherche
    searchInput.dispatchEvent(new Event("input"));
  });
}

// Gère l'ouverture/fermeture des dropdowns (menus des tags)
function setupDropdownToggles() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle"); // Sélectionne tous les boutons de dropdown

  // Ferme tous les menus dropdown au chargement
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.display = "none";
  });

  // Ajoute un écouteur à chaque bouton de dropdown
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const parentDropdown = toggle.closest(".dropdown"); // Récupère le conteneur parent
      const menu = parentDropdown.querySelector(".dropdown-menu"); // Récupère le menu correspondant
      const isOpen = menu.style.display === "block"; // Vérifie si le menu est déjà ouvert

      // Ouvre ou ferme le menu en fonction de son état actuel
      menu.style.display = isOpen ? "none" : "block";

      // Active ou désactive la rotation du chevron via la classe CSS 'open'
      parentDropdown.classList.toggle("open", !isOpen);
    });
  });
}

// Fonction principale d’initialisation du site
function init() {
  displayRecipes(recipes); // Affiche toutes les recettes au chargement
  updateRecipeCount(recipes.length); // Affiche le nombre total de recettes

  const tags = getUniqueTags(recipes); // Récupère tous les tags uniques depuis les recettes
  populateDropdowns(tags); // Remplit les menus déroulants avec ces tags
  setupTagSelection(); // Active la logique de sélection/désélection des tags

  setupSearch(); // Initialise le comportement du champ de recherche
  setupDropdownToggles(); // Initialise les menus dropdowns
}

// Démarre l'application
init();
