import { describe, expect, it, vi } from "vitest";
import { fetchRecipe, state } from "../model.js";

// Mock the fetch function
global.fetch = vi.fn();
fetch.mockImplementation(() => {
	return Promise.resolve({
		ok: true,
		json() {
			return Promise.resolve({
				data: {
					status: "success",
					recipe: {
						publisher: "Test User",
						ingredients: [],
						source_url: "http://www.test-recipe.com/recipe1",
						image_url: "http://test-recipe.com/images/dish.jpg",
						title: "Test Recipe",
						servings: 4,
						cooking_time: 45,
						id: "dish1",
					},
				},
			});
		},
	});
});

describe("state object", () => {
	it("to be present", () => {
		expect(state).toBeDefined();
	});

	it("should contain recipe object", () => {
		expect(state.recipe).toBeDefined();
	});
});

describe("fetchRecipe()", () => {
	const testInput = "https://api.test.com/data";
	const testCorrectState = {
		recipe: {
			publisher: "Test User",
			ingredients: [],
			sourceUrl: "http://www.test-recipe.com/recipe1",
			imageUrl: "http://test-recipe.com/images/dish.jpg",
			title: "Test Recipe",
			servings: 4,
			cookingTime: 45,
			id: "dish1",
		},
	};
	afterEach(() => {
		state.recipe = {
			//
		};
	});

	it("should update state.recipe object when called", async () => {
		await fetchRecipe(testInput);
		expect(state).toEqual(testCorrectState);
	});

	it("should throw error if fetch throws error", async () => {
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false,
				status: 404,
				json: () => Promise.resolve({}),
			}),
		);
		await expect(fetchRecipe(testInput)).rejects.toThrow();
	});
});
