import { API_URL, KEY, RESULT_PER_PAGE } from "./config";
import { fetchData, sendJSON } from "./helpers";

export const state = {
	recipe: {
		// Recipe object
	},
	search: {
		query: "",
		result: [
			// Result object for query
		],
		resultsPerPage: RESULT_PER_PAGE,
		page: 1,
	},
	bookmarks: [],
};

const createRecipeObject = function (data) {
	const { recipe } = data.data;
	return {
		id: recipe.id,
		publisher: recipe.publisher,
		title: recipe.title,
		sourceUrl: recipe.source_url,
		imageUrl: recipe.image_url,
		servings: recipe.servings,
		cookingTime: recipe.cooking_time,
		ingredients: recipe.ingredients,
		...(recipe.key && { key: recipe.key }),
	};
};

export const fetchRecipe = async function (url) {
	try {
		const data = await fetchData(url);
		const id = window.location.hash.slice(1);

		state.recipe = createRecipeObject(data);

		if (state.bookmarks.some((bookmark) => bookmark.id === id))
			state.recipe.bookmarked = true;
		else state.recipe.bookmarked = false;
	} catch (error) {
		throw Error(error);
	}
};

export const loadRecipe = async function (id) {
	const url = `${API_URL}/${id}?key=${KEY}`;
	await fetchRecipe(url);
};

export const loadSearchResult = async function (query) {
	try {
		state.search.query = query;
		const data = await fetchData(`${API_URL}?search=${query}&key=${KEY}`);

		state.search.result = data.data.recipes.map((recipe) => {
			return {
				id: recipe.id,
				publisher: recipe.publisher,
				title: recipe.title,
				imageUrl: recipe.image_url,
				...(recipe.key && { key: recipe.key }),
			};
		});
		state.search.page = 1;
	} catch (error) {
		throw Error(error);
	}
};

export const getSearchResultsPage = function (page = state.search.page) {
	state.search.page = page;
	// console.log(typeof state.search.result);
	if (state.search.result.length) {
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

export const addBookmark = function (recipe) {
	//Add bookmark to state
	state.bookmarks.push(recipe);

	// Mark current recipe as bookmarked
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
	persistBookmarks();
};

export const deleteBookmark = function (recipe) {
	// Delete bookmark from state
	const index = state.bookmarks.findIndex(
		(bookmark) => bookmark.id === recipe.id,
	);
	state.bookmarks.splice(index, 1);

	// Mark current recipe as NOT bookmarked
	if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
	persistBookmarks();
	console.log(state.bookmarks);
};

const persistBookmarks = function () {
	localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

const init = function () {
	const storage = localStorage.getItem("bookmarks");
	if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
	localStorage.clear("bookmarks");
};

clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
	//
	const ingredients = Object.entries(newRecipe)
		.filter(
			(recipe) => recipe[0].startsWith("ingredient") && recipe[1] !== "",
		)
		.map((ingredient) => {
			const ingredientArray = ingredient[1]
				.split(",")
				.map((item) => item.trim());
			if (ingredientArray.length !== 3)
				throw Error(
					"Wrong ingredient format! Please use the correct format!",
				);
			const [quantity, unit, description] = ingredientArray;
			return { quantity: quantity ? +quantity : null, unit, description };
		});

	const recipe = {
		publisher: newRecipe.publisher,
		title: newRecipe.title,
		source_url: newRecipe.sourceUrl,
		image_url: newRecipe.image,
		servings: +newRecipe.servings,
		cooking_time: +newRecipe.cookingTime,
		ingredients,
	};
	const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
	state.recipe = createRecipeObject(data);
	console.log(state.recipe);
	addBookmark(state.recipe);
};
