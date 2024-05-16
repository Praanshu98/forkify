import { API_URL, RESULT_PER_PAGE } from "./config";
import { fetchData } from "./helpers";

export const state = {
	recipe: {
		// Recipe object
	},
	search: {
		query: "",
		result: {
			// Result object for query
		},
		resultsPerPage: RESULT_PER_PAGE,
		page: 1,
	},
};

/**
 * Function to fetch data from url (passed as parameter) and return json data.
 * @param {string} url | The url to fetch data from
 * @returns {JSON} | The JSON data fetched from url
 */

export const fetchRecipe = async function (url) {
	try {
		const data = await fetchData(url);

		let { recipe } = data.data;
		state.recipe = {
			id: recipe.id,
			publisher: recipe.publisher,
			title: recipe.title,
			sourceUrl: recipe.source_url,
			imageUrl: recipe.image_url,
			servings: recipe.servings,
			cookingTime: recipe.cooking_time,
			ingredients: recipe.ingredients,
		};
	} catch (error) {
		throw Error(error);
	}
};

export const loadRecipe = async function (id) {
	const url = `${API_URL}/${id}`;
	await fetchRecipe(url);
};

export const loadSearchResult = async function (query) {
	try {
		state.search.query = query;
		const data = await fetchData(`${API_URL}?search=${query}`);

		state.search.result = data.data.recipes.map((recipe) => {
			return {
				id: recipe.id,
				publisher: recipe.publisher,
				title: recipe.title,
				imageUrl: recipe.image_url,
			};
		});
	} catch (error) {
		throw Error(error);
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;
	// console.log(!Object.keys(state.search.result).length === 0);
	if (!Object.keys(state.search.result).length === 0) {
		const start = (page - 1) * state.search.resultsPerPage;
		const end = page * state.search.resultsPerPage;
		return state.search.result.slice(start, end);
	}
};

export const updateServings = function (numberOfServings) {
	state.recipe.ingredients.forEach((ingredient) => {
		ingredient.quantity =
			ingredient.quantity * (numberOfServings / state.recipe.servings);
	});
	state.recipe.servings = numberOfServings;
};
