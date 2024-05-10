import icons from "url:../img/icons.svg";

const recipeContainer = document.querySelector(".recipe");

/**
 * Function to throw timeout error after certain seconds (passed in parameter) and return rejected promise
 * @param {number} seconds | The number of seconds to wait before throwing timeout error.
 * @returns {promise} | The rejected promise
 */
export const timeout = function (seconds) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(
					`Request took too long! Timeout after ${seconds} second`,
				),
			);
		}, seconds * 1000);
	});
};

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

/**
 * Function to fetch data from url (passed as parameter) and return json data.
 * @param {string} url | The url to fetch data from
 * @returns {JSON} | The JSON data fetched from url
 */
export const fetchData = async function (url) {
	const response = await fetch(url);
	const data = await response.json();

	if (!response.ok) throw Error(`Status ${response.status}`);
	return data;
};

export const fetchRecipe = async function (url) {
	try {
		const data = await fetchData(url);

		let { recipe } = data.data;
		recipe = {
			id: recipe.id,
			publisher: recipe.publisher,
			title: recipe.title,
			sourceUrl: recipe.source_url,
			imageUrl: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};
		return recipe;
	} catch (error) {
		throw Error(error);
	}
};

const renderSpinner = function (parentElement) {
	const html = `
		<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
	`;
	parentElement.innerHTML = "";
	parentElement.insertAdjacentHTML("afterbegin", html);
};

const renderRecipe = function (recipe) {
	const html = `
		<figure class="recipe__fig">
          <img src="${recipe.imageUrl}" alt="${
		recipe.title
	}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${recipe.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
				recipe.cookingTime
			}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
				recipe.servings
			}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings">
                <svg>
                  <use href="${icons}.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated">
            <svg>
              <use href="${icons}.svg#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round">
            <svg class="">
              <use href="${icons}.svg#icon-bookmark-fill"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${recipe.ingredients
				.map((ingredient) => {
					return `
					<li class="recipe__ingredient">
					<svg class="recipe__icon">
						<use href="${icons}.svg#icon-check"></use>
					</svg>
					<div class="recipe__quantity">${ingredient.quantity}</div>
					<div class="recipe__description">
						<span class="recipe__unit">${ingredient.unit}</span>
						${ingredient.description}
					</div>
					</li>
				`;
				})
				.join("")}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
				recipe.publisher
			}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${recipe.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
	`;
	recipeContainer.innerHTML = "";
	recipeContainer.insertAdjacentHTML("afterbegin", html);
};

export const showRecipe = async function () {
	const id = window.location.hash.slice(1);
	if (!id) return;

	const url = `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`;
	try {
		// Fetching recipes
		renderSpinner(recipeContainer);
		const recipe = await fetchRecipe(url);

		// Rendering recipes
		renderRecipe(recipe);
	} catch (error) {
		console.error(error);
	}
};

const eventsList = ["hashchange", "load"];
eventsList.forEach((event) => {
	addEventListener(event, showRecipe);
});
