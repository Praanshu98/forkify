import fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { RecipeView } from "../views/recipeViews";

const htmlDocumentPath = path.join(process.cwd(), "/index.html");
const htmlFileContent = fs.readFileSync(htmlDocumentPath).toString();

let recipeView;
let data;
let { document } = new JSDOM("").window;

vi.stubGlobal("document", document);

beforeEach(() => {
	document.body.innerHTML = "";
	document.write(htmlFileContent);
	recipeView = new RecipeView();
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
});

describe("class RecipeView", () => {
	let parentElement;
	let handler;

	beforeEach(() => {
		// Create a mock handler before each test
		parentElement = document.querySelector(".recipe");
		handler = vi.fn();
	});

	it("render should add recipe content to .recipe element", () => {
		recipeView.render(data);
		expect(parentElement.firstChild).toBeDefined();
	});

	it("renderSpinner should add spinner to .recipe element", () => {
		recipeView.renderSpinner();
		expect(parentElement.firstChild).toBeDefined();
	});

	it("renderError should add error message to .recipe element", () => {
		recipeView.renderError();
		expect(parentElement.firstChild).toBeDefined();
	});

	it("renderError should add correct error message (passed in argument) to .recipe element", () => {
		const testError = "Test Error";
		recipeView.renderError(testError);
		expect(parentElement.querySelector("p").innerHTML).toBe(testError);
	});

	it("renderMessage should add message to .recipe element", () => {
		recipeView.renderMessage();
		expect(document.querySelector(".recipe").firstChild).toBeDefined();
	});

	it("addHandlerRender should be called with handler function", () => {
		const addHandlerRenderSpy = vi.spyOn(window, "addEventListener");

		recipeView.addHandlerRender(handler);

		expect(addHandlerRenderSpy).toHaveBeenCalledWith("hashchange", handler);
		expect(addHandlerRenderSpy).toHaveBeenCalledWith("load", handler);
		addHandlerRenderSpy.mockRestore();
	});

	it('should call the handler when the "hashchange" event is triggered', () => {
		recipeView.addHandlerRender(handler);

		// Dispatch the "hashchange" event
		window.dispatchEvent(new Event("hashchange"));
		expect(handler).toHaveBeenCalled();
	});

	it('should call the handler when the "load" event is triggered', () => {
		recipeView.addHandlerRender(handler);

		// Dispatch the "load" event
		window.dispatchEvent(new Event("load"));
		expect(handler).toHaveBeenCalled();
	});

	it("should clear the parent element's inner HTML", () => {
		parentElement.insertAdjacentHTML("afterbegin", "<p>Test Content</p>");

		recipeView.renderSpinner(); // This internally calls #clear

		const expectedHTML = `
        <div class="spinner">
          <svg>
            <use href="/src/img/icons.svg#icon-loader"></use>
          </svg>
        </div>`.replace(/\s/g, ""); // Removing all whitespace for comparison

		const actualHTML = parentElement.innerHTML.replace(/\s/g, ""); // Removing all whitespace for comparison

		expect(actualHTML).toBe(expectedHTML);
	});
});
