function normalize(text) {
  return text.toLowerCase().trim();
}

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
