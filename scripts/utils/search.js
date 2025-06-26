function normalize(text) {
  return text.toLowerCase().trim();
}

function getUniqueIngredients(recipesList) {
  const ingredientsSet = new Set();

  recipesList.forEach((recipe) => {
    recipe.ingredients.forEach((item) => {
      ingredientsSet.add(normalize(item.ingredient));
    });
  });

  return Array.from(ingredientsSet);
}

function getUniqueAppliances(recipesList) {
  const appliancesSet = new Set();

  recipesList.forEach((recipe) => {
    appliancesSet.add(normalize(recipe.appliance));
  });

  return Array.from(appliancesSet);
}

function getUniqueUstensils(recipesList) {
  const ustensilsSet = new Set();

  recipesList.forEach((recipe) => {
    recipe.ustensils.forEach((item) => {
      ustensilsSet.add(normalize(item));
    });
  });

  return Array.from(ustensilsSet);
}

function search(inputValue, recipes) {
  // Redirige vers simpleSearch (plus tard vers advancedSearch selon conditions)
  if (inputValue.length >= 3) {
    return simpleSearch(inputValue, recipes);
  }
  // advanced search a ajouter
  return recipes; // Retourne tout si moins de 3 caractères
}

function simpleSearch(inputValue, recipes) {
  const searchTerm = normalize(inputValue);

  return recipes.filter((recipe) => {
    const titleMatch = normalize(recipe.name).includes(searchTerm);
    const descriptionMatch = normalize(recipe.description).includes(searchTerm);
    const ingredientsMatch = recipe.ingredients.some((ingredientObj) =>
      normalize(ingredientObj.ingredient).includes(searchTerm)
    );

    return titleMatch || descriptionMatch || ingredientsMatch;
  });
}

function advancedSearch(inputValue, recipes) {
  // À coder plus tard
}
