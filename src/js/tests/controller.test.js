import fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { describe, it, vi } from "vitest";

const htmlDocumentPath = path.join(process.cwd(), "/index.html");
const htmlFileContent = fs.readFileSync(htmlDocumentPath).toString();

let data;
let { document } = new JSDOM("").window;

vi.stubGlobal("document", document);
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

data = {
	publisher: "Test User",
	ingredients: [],
	sourceUrl: "http://www.test-recipe.com/recipe1",
	imageUrl: "http://test-recipe.com/images/dish.jpg",
	title: "Test Recipe",
	servings: 4,
	cookingTime: 45,
	id: "dish1",
};

beforeEach(() => {
	document.body.innerHTML = "";
	document.write(htmlFileContent);
});

describe("controlRecipe", () => {
	it("should render the recipes", () => {
		expect(document.querySelector(".recipe").firstChild).toBeDefined();
	});
});
