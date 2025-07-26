// Fonction qui normalise un texte :
// - met en minuscules
// - supprime les accents (décomposition Unicode NFD + RegEx)
// - enlève les espaces superflus
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Vérifie si au moins un ingrédient de la liste contient le texte recherché
// Utilisé dans simpleSearch
function someNativeIngredient(array, inputText) {
  for (let i = 0; i < array.length; i++) {
    // On compare chaque ingrédient avec le texte recherché (après normalisation)
    if (normalize(array[i].ingredient).includes(normalize(inputText))) {
      return true; // match trouvé
    }
  }
  return false; // aucun match trouvé
}

// Vérifie si tous les tags sélectionnés (ingredients, appliances, ustensils)
// sont présents dans la recette. Permet de filtrer les recettes par tags.
function everyNative(tags, arrayToCheck, key) {
  for (let i = 0; i < tags.length; i++) {
    const tag = normalize(tags[i]); // tag à vérifier (normalisé)
    let found = false;

    // On parcourt la liste à vérifier (ex: liste des ustensils ou ingrédients)
    for (let j = 0; j < arrayToCheck.length; j++) {
      const valueToCheck = key ? arrayToCheck[j][key] : arrayToCheck[j];
      if (normalize(valueToCheck) === tag) {
        found = true;
        break; // on a trouvé le tag dans la recette
      }
    }

    // Si un tag n’est pas trouvé dans la recette, la recette est rejetée
    if (!found) {
      return false;
    }
  }

  // Tous les tags ont été trouvés, la recette est valide
  return true;
}

// Fonction qui remplace .filter() pour filtrer les recettes selon l'input utilisateur
function filterNative(array, inputText) {
  const searchTerm = normalize(inputText);
  const result = [];

  for (let i = 0; i < array.length; i++) {
    const recipe = array[i];

    // On cherche le texte dans :
    // - le nom de la recette
    const titleMatch = normalize(recipe.name).includes(searchTerm);

    // - la description de la recette
    const descriptionMatch = normalize(recipe.description).includes(searchTerm);

    // - les ingrédients
    const ingredientMatch = someNativeIngredient(
      recipe.ingredients,
      searchTerm
    );

    // Si l'une des 3 correspondances est trouvée, on garde la recette
    if (titleMatch || descriptionMatch || ingredientMatch) {
      result.push(recipe);
    }
  }

  return result; // liste des recettes filtrées
}

// Recherche simple : filtre les recettes selon le champ de recherche uniquement
function simpleSearch(inputValue, recipes) {
  return filterNative(recipes, inputValue);
}

// Recherche avancée : recherche par input + tags (si input >= 3 lettres)
// ou uniquement par tags si pas d'input
function advancedSearch(inputValue, recipes) {
  let filteredRecipes = recipes;

  // Si l'input est assez long, on applique d'abord la recherche simple
  if (normalize(inputValue).length >= 3) {
    filteredRecipes = filterNative(recipes, inputValue);
  }

  const finalRecipes = [];

  // On filtre ensuite les recettes restantes avec les tags sélectionnés
  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];

    // Vérifie si tous les tags sont présents dans la recette
    const ingredientsOk = everyNative(
      selectedTags.ingredients,
      recipe.ingredients,
      "ingredient"
    );

    const appliancesOk = everyNative(selectedTags.appliances, [
      recipe.appliance,
    ]);

    const ustensilsOk = everyNative(selectedTags.ustensils, recipe.ustensils);

    // Si tous les tags sont présents, on garde la recette
    if (ingredientsOk && appliancesOk && ustensilsOk) {
      finalRecipes.push(recipe);
    }
  }

  return finalRecipes; // recettes filtrées par input + tags
}

// Point d'entrée de la recherche : selon si on a de l'input, des tags, ou les deux
function search(inputValue, recipes) {
  const hasInput = inputValue.length >= 3;

  // Vérifie si au moins un tag est sélectionné
  let hasTags = false;
  const tagsArrays = Object.values(selectedTags);
  for (let i = 0; i < tagsArrays.length; i++) {
    if (tagsArrays[i].length > 0) {
      hasTags = true;
      break;
    }
  }

  // Cas 1 : recherche par input + tags
  if (hasInput && hasTags) {
    return advancedSearch(inputValue, recipes);
  }

  // Cas 2 : recherche simple uniquement
  if (hasInput) {
    return simpleSearch(inputValue, recipes);
  }

  // Cas 3 : recherche uniquement par tags
  if (hasTags) {
    return advancedSearch("", recipes);
  }

  // Aucun critère de recherche : on retourne toutes les recettes
  return recipes;
}

// Met à jour la recherche en fonction de l'input utilisateur
function updateSearch(inputValue) {
  const filteredRecipes = search(inputValue, recipes); // exécute la recherche

  // Affiche les recettes filtrées
  displayRecipes(filteredRecipes);

  // Met à jour le compteur de recettes affichées
  updateRecipeCount(filteredRecipes.length);

  // Met à jour les tags disponibles selon les recettes filtrées
  const newTags = getUniqueTags(filteredRecipes);

  // Affiche les tags dans les menus déroulants
  populateDropdowns(newTags);

  // Réactive la sélection des tags
  setupTagSelection();
}
