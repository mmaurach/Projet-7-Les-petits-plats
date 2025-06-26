function displayRecipes(recipes) {
  const section = document.querySelector(".recipes-container");
  section.innerHTML = ""; // Nettoyer au cas où

  recipes.forEach((recipe) => {
    const template = recipeTemplate(recipe);
    const recipeCard = template.getRecipeCardDOM();
    section.appendChild(recipeCard);
  });
}

// Appel principal (recettes déjà chargées via script)
displayRecipes(recipes);

const recipeCountSpan = document.querySelector(".recipe-count");
recipeCountSpan.textContent = `${recipes.length} recettes`;

const searchInput = document.querySelector("#main-search");
const closeIcon = document.querySelector(".close-icon");

searchInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  // Affiche ou masque la croix
  if (inputValue.length > 0) {
    closeIcon.style.display = "block";
  } else {
    closeIcon.style.display = "none";
  }

  const filtered = search(inputValue, recipes);
  displayRecipes(filtered);
  updateRecipeCount(filtered.length);
});

// Quand on clique sur la croix, on vide le champ et on réinitialise
closeIcon.addEventListener("click", () => {
  searchInput.value = "";
  closeIcon.style.display = "none";
  displayRecipes(recipes);
  updateRecipeCount(recipes.length);
});

function updateRecipeCount(count) {
  recipeCountSpan.textContent = `${count} recette${count > 1 ? "s" : ""}`;
}

//Affichage des tags ici ou autre fichier
