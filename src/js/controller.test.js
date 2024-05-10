import { vi } from "vitest";
import { fetchData, fetchRecipe, timeout } from "./controller";

// Mock the fetch function
global.fetch = vi.fn();

describe("timeout()", () => {
	/**
	 * This function throws 'Request took too long' error after user defined number of seconds passed in parameter.
	 * @param {integer} inputSeconds | number of seconds to wait
	 */
	const runTimeoutTest = async (inputSeconds) => {
		vi.useFakeTimers();
		const result = timeout(inputSeconds);

		vi.advanceTimersByTime(inputSeconds * 1000);
		await expect(result).rejects.toThrowError(
			`Request took too long! Timeout after ${inputSeconds} second`,
		);
	};

	it("should reject the promise after a user defined seconds passed in parameter", async () => {
		await runTimeoutTest(2);
	});

	it("should reject the promise with correct error message", async () => {
		await runTimeoutTest(2);
	});

	it("should reject correctly for different timeout values", async () => {
		await runTimeoutTest(5);
	});

	it("should reject immediately if timeout is set to 0 seconds", async () => {
		await runTimeoutTest(0);
	});
});

describe("fetchData()", () => {
	const testInput = "https://api.test.com/data";
	const testResponseData = { message: "Success" };

	it("should throw an error if fetch response is not ok", async () => {
		// Mock fetch implementation for a failed response
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false,
				status: 404,
				json: () => Promise.resolve({}),
			}),
		);

		// Expect fetchData to throw an error
		await expect(fetchData(testInput)).rejects.toThrow("Status 404");
	});

	it("should resolve with correct response data", async () => {
		// Mock fetch implementation for a successful response
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve(testResponseData),
			}),
		);

		// Expect fetchData to return the correct data
		const data = await fetchData(testInput);
		expect(data).toEqual(testResponseData);
	});

	it("should handle network errors", async () => {
		// Mock fetch implementation to simulate a network error
		fetch.mockImplementationOnce(() =>
			Promise.reject(new Error("Network error")),
		);

		// Expect fetchData to throw a network error
		await expect(fetchData(testInput)).rejects.toThrow("Network error");
	});
});

describe("fetchRecipe()", () => {
	const testInput = "https://api.test.com/data";
	const testData = {
		publisher: "Test User",
		ingredients: [],
		sourceUrl: "http://www.test-recipe.com/recipe1",
		imageUrl: "http://test-recipe.com/images/dish.jpg",
		title: "Test Recipe",
		servings: 4,
		cookingTime: 45,
		id: "dish1",
	};
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
	it("should return recipe object when called", async () => {
		expect(fetchRecipe(testInput)).resolves.toEqual(testData);
	});

	it("should throw error if fetch throws error", async () => {
		fetch.mockImplementationOnce(() =>
			Promise.resolve({
				ok: false,
				status: 404,
				json: () => Promise.resolve({}),
			}),
		);
		await expect(fetchData(testInput)).rejects.toThrow();
	});

	it("should return type of object", () => {
		expect(fetchRecipe(testInput)).resolves.toBeTypeOf("object");
	});
});
