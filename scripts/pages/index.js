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
