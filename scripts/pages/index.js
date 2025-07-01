// Affiche les recettes dans le DOM
function displayRecipes(recipes) {
  const section = document.querySelector(".recipes-container");
  section.innerHTML = "";

  recipes.forEach((recipe) => {
    const template = recipeTemplate(recipe);
    const recipeCard = template.getRecipeCardDOM();
    section.appendChild(recipeCard);
  });
}

// Met à jour le compteur de recettes
function updateRecipeCount(count) {
  const recipeCountSpan = document.querySelector(".recipe-count");
  recipeCountSpan.textContent = `${count} recette${count > 1 ? "s" : ""}`;
}

function setupSearch() {
  const searchInput = document.querySelector("#main-search");
  const closeIcon = document.querySelector(".close-icon");

  // Lors de la saisie dans le champ principal
  searchInput.addEventListener("input", (e) => {
    const inputValue = e.target.value.trim();

    // Affiche ou masque la croix selon la saisie
    closeIcon.style.display = inputValue.length > 0 ? "block" : "none";

    // Met à jour les recettes et les tags
    updateSearch();
  });

  // Lors du clic sur la croix (pour vider le champ)
  closeIcon.addEventListener("click", () => {
    // Vide le champ
    searchInput.value = "";

    // Cache la croix
    closeIcon.style.display = "none";

    // Déclenche manuellement l'événement input pour réutiliser la logique
    searchInput.dispatchEvent(new Event("input"));
  });
}

function setupDropdownToggles() {
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle");

  // Tous les menus sont fermés au démarrage
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.style.display = "none";
  });

  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const parentDropdown = toggle.closest(".dropdown");
      const menu = parentDropdown.querySelector(".dropdown-menu");
      const isOpen = menu.style.display === "block";

      // Basculer indépendamment le menu (sans fermer les autres)
      menu.style.display = isOpen ? "none" : "block";

      // Ajout ou retrait de la classe 'open' pour activer la rotation du chevron
      parentDropdown.classList.toggle("open", !isOpen);
    });
  });
}

// Initialise la page avec toutes les recettes et les tags
function init() {
  displayRecipes(recipes);
  updateRecipeCount(recipes.length);

  const tags = getUniqueTags(recipes);
  populateDropdowns(tags);
  setupTagSelection();

  setupSearch();
  setupDropdownToggles();
}

init();
