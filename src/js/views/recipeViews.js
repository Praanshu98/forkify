import icons from "../../img/icons.svg";
import { numberToFraction } from "../helpers.js";
import View from "./Views";

export class RecipeView extends View {
	_parentElement = document.querySelector(".recipe");
	_errorMessage = "No recipes found for your query. Please try again!";
	_message = "some message";

	addHandlerRender(handler) {
		const eventsList = ["hashchange", "load"];
		eventsList.forEach((event) => {
			addEventListener(event, handler);
		});
	}

	addHandlerUpdateServings(handler) {
		this._parentElement.addEventListener("click", (event) => {
			const button = event.target.closest(".btn--update-servings");
			if (!button) return;
			const { updateTo } = button.dataset;
			handler(+updateTo);
		});
	}

	addHandlerBookmark(handler) {
		this._parentElement.addEventListener("click", (event) => {
			const button = event.target.closest(".btn--bookmark");
			if (!button) return;
			handler();
		});
	}

	_clear() {
		this._parentElement.innerHTML = "";
	}

	_generateMarkup() {
		return `
		<figure class="recipe__fig">
          <img src="${this._data.imageUrl}" alt="${
			this._data.title
		}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
				this._data.cookingTime
			}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}.svg#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
				this._data.servings
			}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button data-update-to="${
					this._data.servings > 1
						? this._data.servings - 1
						: this._data.servings
				}" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}.svg#icon-minus-circle"></use>
                </svg>
              </button>
              <button data-update-to="${
					this._data.servings + 1
				}" class="btn--tiny btn--update-servings">
                <svg>
                  <use href="${icons}.svg#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>

          <div class="recipe__user-generated ${this._data.key ? "" : "hidden"}">
            <svg>
				<use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}.svg#icon-bookmark${
			this._data.bookmarked ? "-fill" : ""
		}"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
            ${this._data.ingredients
				.map((ingredient) => {
					return `
					<li class="recipe__ingredient">
					<svg class="recipe__icon">
						<use href="${icons}.svg#icon-check"></use>
					</svg>
					<div class="recipe__quantity">${
						ingredient.quantity
							? numberToFraction(ingredient.quantity).toString()
							: ""
					}</div>
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
				this._data.publisher
			}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
	`;
	}
}

export default new RecipeView();
