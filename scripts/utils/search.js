function normalize(text) {
  return text.toLowerCase().trim();
}

// Point d’entrée unique
function search(inputValue, recipes) {
  const hasInput = inputValue.length >= 3;
  const hasTags = Object.values(selectedTags).some((arr) => arr.length > 0);

  if (hasInput && hasTags) {
    return advancedSearch(inputValue, recipes);
  }

  if (hasInput) {
    return simpleSearch(inputValue, recipes);
  }

  if (hasTags) {
    return advancedSearch("", recipes); // recherche par tags uniquement
  }

  return recipes;
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
  const searchTerm = normalize(inputValue);

  return recipes.filter((recipe) => {
    // 1. Si input ≥ 3 lettres, filtrer par titre, description, ingrédients
    if (searchTerm.length >= 3) {
      const titleMatch = normalize(recipe.name).includes(searchTerm);
      const descriptionMatch = normalize(recipe.description).includes(
        searchTerm
      );
      const ingredientsMatch = recipe.ingredients.some((ingredientObj) =>
        normalize(ingredientObj.ingredient).includes(searchTerm)
      );

      if (!(titleMatch || descriptionMatch || ingredientsMatch)) {
        return false;
      }
    }

    // 2. Filtrer par tags sélectionnés
    const tagsMatch = {
      ingredients: selectedTags.ingredients.every((tag) =>
        recipe.ingredients.some(
          (ing) => normalize(ing.ingredient) === normalize(tag)
        )
      ),
      appliances: selectedTags.appliances.every(
        (tag) => normalize(recipe.appliance) === normalize(tag)
      ),
      ustensils: selectedTags.ustensils.every((tag) =>
        recipe.ustensils.some((ust) => normalize(ust) === normalize(tag))
      ),
    };

    return tagsMatch.ingredients && tagsMatch.appliances && tagsMatch.ustensils;
  });
}
