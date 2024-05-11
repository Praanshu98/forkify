import { loadRecipe, state } from "./model";
import recipeView from "./views/recipeViews";

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

export const controlRecipe = async function () {
	const id = window.location.hash.slice(1);
	if (!id) return;

	recipeView.renderSpinner();
	try {
		// Fetching recipes
		await loadRecipe(id);

		// Rendering recipes
		recipeView.render(state.recipe);
	} catch (error) {
		console.error(error);
	}
};

const init = function () {
	recipeView.addHandlerRender(controlRecipe);
};
init();
