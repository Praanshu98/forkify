import { loadRecipe, loadSearchResult, state } from "./model";
import recipeViews from "./views/recipeViews";
import resultsViews from "./views/resultsViews";
import searchViews from "./views/searchViews";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

export const controlRecipe = async function () {
	const id = window.location.hash.slice(1);
	if (!id) return;

	recipeViews.renderSpinner();

	try {
		// Fetching recipes
		await loadRecipe(id);
		// Rendering recipes
		recipeViews.render(state.recipe);
	} catch (error) {
		recipeViews.renderError();
		console.error(error);
	}
};

export const controlSearchResult = async function () {
	// Get Search Query
	const query = searchViews.getQuery();
	if (!query) return;

	resultsViews.renderSpinner();

	try {
		// Fetching Search Result
		await loadSearchResult(query);

		// Rendering Search Result
		resultsViews.render(state.search.result);
	} catch (error) {
		console.error(error);
	}
};

const init = function () {
	recipeViews.addHandlerRender(controlRecipe);
	searchViews.addHandlerSearch(controlSearchResult);
};
init();
