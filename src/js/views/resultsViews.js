import View from "./Views";
import previewViews from "./previewViews";

if (module.hot) {
	module.hot.accept();
}

class ResultViews extends View {
	//
	_parentElement = document.querySelector(".results");
	_errorMessage = "No recipes found for your query. Please try again!";
	_message = "some message";

	_generateMarkup() {
		return this._data
			.map((bookmark) => previewViews.render(bookmark, false))
			.join("");
	}
}

export default new ResultViews();
