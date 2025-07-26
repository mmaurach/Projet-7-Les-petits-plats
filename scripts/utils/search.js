// Fonction de normalisation : rend le texte insensible à la casse, aux accents et aux espaces inutiles
function normalize(text) {
  return text
    .toLowerCase() // met tout en minuscules
    .normalize("NFD") // décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .trim(); // supprime les espaces en début et fin de texte
}

// Fonction principale de recherche, appelée à chaque changement dans la barre de recherche ou les tags
function search(inputValue, recipes) {
  const hasInput = inputValue.length >= 3; // vérifie si l'utilisateur a tapé au moins 3 caractères
  const hasTags = Object.values(selectedTags).some((arr) => arr.length > 0); // vérifie si au moins un tag est sélectionné

  // Si l'utilisateur a tapé du texte et sélectionné des tags, on effectue une recherche avancée
  if (hasInput && hasTags) {
    return advancedSearch(inputValue, recipes);
  }

  // Si l'utilisateur n'a tapé que du texte, on effectue une recherche simple
  if (hasInput) {
    return simpleSearch(inputValue, recipes);
  }

  // Si aucun texte mais des tags sont sélectionnés, on effectue une recherche avancée basée uniquement sur les tags
  if (hasTags) {
    return advancedSearch("", recipes);
  }

  // Si aucun texte ni tag, on retourne toutes les recettes
  return recipes;
}

// Recherche simple : filtre les recettes selon le texte entré
function simpleSearch(inputValue, recipes) {
  const searchTerm = normalize(inputValue); // on normalise la saisie utilisateur

  return recipes.filter((recipe) => {
    // vérifie si le titre contient le texte
    const titleMatch = normalize(recipe.name).includes(searchTerm);

    // vérifie si la description contient le texte
    const descriptionMatch = normalize(recipe.description).includes(searchTerm);

    // vérifie si au moins un ingrédient contient le texte
    const ingredientsMatch = recipe.ingredients.some((ingredientObj) =>
      normalize(ingredientObj.ingredient).includes(searchTerm)
    );

    // si au moins un des champs correspond, on garde la recette
    return titleMatch || descriptionMatch || ingredientsMatch;
  });
}

// Recherche avancée : filtre selon texte (si ≥ 3 lettres) + tags sélectionnés
function advancedSearch(inputValue, recipes) {
  let filteredRecipes = recipes;

  // Si l'utilisateur a tapé au moins 3 lettres, on commence par filtrer avec la recherche simple
  if (normalize(inputValue).length >= 3) {
    filteredRecipes = simpleSearch(inputValue, recipes);
  }

  // Ensuite, on filtre les résultats en fonction des tags sélectionnés
  return filteredRecipes.filter((recipe) => {
    const tagsMatch = {
      // on vérifie que tous les tags "ingrédients" sélectionnés sont présents dans la recette
      ingredients: selectedTags.ingredients.every((tag) =>
        recipe.ingredients.some(
          (ing) => normalize(ing.ingredient) === normalize(tag)
        )
      ),
      // on vérifie que tous les tags "appareils" sélectionnés sont présents
      appliances: selectedTags.appliances.every(
        (tag) => normalize(recipe.appliance) === normalize(tag)
      ),
      // on vérifie que tous les tags "ustensiles" sélectionnés sont présents
      ustensils: selectedTags.ustensils.every((tag) =>
        recipe.ustensils.some((ust) => normalize(ust) === normalize(tag))
      ),
    };

    // la recette est gardée seulement si tous les types de tags sont valides
    return tagsMatch.ingredients && tagsMatch.appliances && tagsMatch.ustensils;
  });
}

// Fonction appelée à chaque fois que l'utilisateur tape dans la barre de recherche ou ajoute/enlève un tag
function updateSearch() {
  const inputValue = document.querySelector("#main-search").value.trim(); // récupère la valeur de recherche
  const filteredRecipes = search(inputValue, recipes); // applique la recherche principale

  // met à jour l'affichage des cartes recettes
  displayRecipes(filteredRecipes);

  // met à jour le compteur de recettes affichées
  updateRecipeCount(filteredRecipes.length);

  // met à jour les tags disponibles en fonction des recettes restantes
  const newTags = getUniqueTags(filteredRecipes);

  // recharge les dropdowns de tags
  populateDropdowns(newTags);

  // réactive la logique de sélection de tags sur les nouveaux éléments
  setupTagSelection();
}
