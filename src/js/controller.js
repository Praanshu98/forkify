import {
	addBookmark,
	deleteBookmark,
	getSearchResultsPage,
	loadRecipe,
	loadSearchResult,
	state,
	updateServings,
} from "./model";
import bookmarkViews from "./views/bookmarkViews";
import paginationViews from "./views/paginationViews";
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
		// Update results view to mark selected search result
		resultsViews.update(getSearchResultsPage());
		bookmarkViews.update(state.bookmarks);

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
		resultsViews.render(getSearchResultsPage());

		// Rendering Pagination buttons
		paginationViews.render(state.search);
	} catch (error) {
		console.error(error);
	}
};

export const controlPagination = function (pageNumber) {
	console.log(pageNumber);

	// Rendering New Search Result
	resultsViews.render(getSearchResultsPage(pageNumber));

	// Rendering New Pagination buttons
	paginationViews.render(state.search);
};

const controlServings = function (newServings) {
	// Update the recipe servings ( in the state )
	updateServings(newServings);

	// Update the recipe view
	recipeViews.update(state.recipe);
};

const controlAddBookmark = function () {
	// Add/Remove a bookmark
	if (!state.recipe.bookmarked) addBookmark(state.recipe);
	else deleteBookmark(state.recipe);

	// Update recipe view
	recipeViews.update(state.recipe);

	// Render bookmarks
	bookmarkViews.render(state.bookmarks);
};

const controlBookmarks = function () {
	bookmarkViews.render(state.bookmarks);
};

const init = function () {
	bookmarkViews.addHandlerRender(controlBookmarks);
	recipeViews.addHandlerRender(controlRecipe);
	recipeViews.addHandlerUpdateServings(controlServings);
	recipeViews.addHandlerBookmark(controlAddBookmark);
	searchViews.addHandlerSearch(controlSearchResult);
	paginationViews.addHandlerClick(controlPagination);
};
init();
