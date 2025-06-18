function recipeTemplate(recipe) {
  const { name, image, time, description, ingredients } = recipe;

  function getRecipeCardDOM() {
    const article = document.createElement("article");
    article.classList.add("recipe-card");

    // === Image et temps ===
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("recipe-image-container");

    const img = document.createElement("img");
    img.classList.add("recipe-img");
    img.setAttribute("src", `./assets/${image}`);
    img.setAttribute("alt", name);

    const timeTag = document.createElement("span");
    timeTag.classList.add("recipe-time");
    timeTag.textContent = `${time} min`;

    imageContainer.appendChild(img);
    imageContainer.appendChild(timeTag);

    // === Contenu de la carte ===
    const content = document.createElement("div");
    content.classList.add("recipe-content");

    const title = document.createElement("h2");
    title.classList.add("recipe-title");
    title.textContent = name;

    // === Description ===
    const descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("recipe-description");

    const recipeTitle = document.createElement("h3");
    recipeTitle.textContent = "Recette";
    const descriptionText = document.createElement("p");
    descriptionText.textContent = description;

    descriptionDiv.appendChild(recipeTitle);
    descriptionDiv.appendChild(descriptionText);

    // === Ingrédients ===
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("recipe-details");

    const ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingrédients";

    const ul = document.createElement("ul");
    ul.classList.add("recipe-ingredients");

    ingredients.forEach((item) => {
      const li = document.createElement("li");

      const nameEl = document.createElement("strong");
      nameEl.textContent = item.ingredient;

      li.appendChild(nameEl);

      if (item.quantity || item.unit) {
        const quantity = document.createElement("br");
        const span = document.createElement("span");
        span.classList.add("ingredient-quantity");
        span.textContent = `${item.quantity || ""} ${item.unit || ""}`.trim();
        li.appendChild(quantity);
        li.appendChild(span);
      }

      ul.appendChild(li);
    });

    detailsDiv.appendChild(ingredientsTitle);
    detailsDiv.appendChild(ul);

    // Construction finale
    content.appendChild(title);
    content.appendChild(descriptionDiv);
    content.appendChild(detailsDiv);

    article.appendChild(imageContainer);
    article.appendChild(content);

    return article;
  }

  return { getRecipeCardDOM };
}
