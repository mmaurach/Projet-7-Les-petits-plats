function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Vérifie si au moins un ingrédient contient le texte recherché (simpleSearch)
function someNativeIngredient(array, inputText) {
  for (let i = 0; i < array.length; i++) {
    if (normalize(array[i].ingredient).includes(normalize(inputText))) {
      return true;
    }
  }
  return false;
}

function everyNative(tags, arrayToCheck, key) {
  for (let i = 0; i < tags.length; i++) {
    const tag = normalize(tags[i]);
    let found = false;

    for (let j = 0; j < arrayToCheck.length; j++) {
      const valueToCheck = key ? arrayToCheck[j][key] : arrayToCheck[j];
      if (normalize(valueToCheck) === tag) {
        found = true;
        break;
      }
    }

    if (!found) {
      return false;
    }
  }
  return true;
}

function filterNative(array, inputText) {
  const searchTerm = normalize(inputText);
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const recipe = array[i];

    const titleMatch = normalize(recipe.name).includes(searchTerm);
    const descriptionMatch = normalize(recipe.description).includes(searchTerm);
    const ingredientMatch = someNativeIngredient(
      recipe.ingredients,
      searchTerm
    );

    if (titleMatch || descriptionMatch || ingredientMatch) {
      result.push(recipe);
    }
  }

  return result;
}

function simpleSearch(inputValue, recipes) {
  return filterNative(recipes, inputValue);
}

function advancedSearch(inputValue, recipes) {
  let filteredRecipes = recipes;

  if (normalize(inputValue).length >= 3) {
    filteredRecipes = filterNative(recipes, inputValue);
  }

  const finalRecipes = [];

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];
    console.log(selectedTags);
    const ingredientsOk = everyNative(
      selectedTags.ingredients,
      recipe.ingredients,
      "ingredient"
    );
    const appliancesOk = everyNative(selectedTags.appliances, [
      recipe.appliance,
    ]);
    const ustensilsOk = everyNative(selectedTags.ustensils, recipe.ustensils);

    if (ingredientsOk && appliancesOk && ustensilsOk) {
      finalRecipes.push(recipe);
    }
  }

  return finalRecipes;
}

function search(inputValue, recipes) {
  const hasInput = inputValue.length >= 3;

  let hasTags = false;
  const tagsArrays = Object.values(selectedTags);
  for (let i = 0; i < tagsArrays.length; i++) {
    if (tagsArrays[i].length > 0) {
      hasTags = true;
      break;
    }
  }

  if (hasInput && hasTags) {
    return advancedSearch(inputValue, recipes);
  }

  if (hasInput) {
    return simpleSearch(inputValue, recipes);
  }

  if (hasTags) {
    return advancedSearch("", recipes);
  }

  return recipes;
}

function updateSearch(inputValue) {
  const filteredRecipes = search(inputValue, recipes); // recherche principale

  displayRecipes(filteredRecipes);
  updateRecipeCount(filteredRecipes.length);

  const newTags = getUniqueTags(filteredRecipes);
  populateDropdowns(newTags);
  setupTagSelection();
}
