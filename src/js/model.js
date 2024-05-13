import { API_URL } from "./config";
import { fetchData } from "./helpers";

export const state = {
	recipe: {
		// Recipe object
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
