import View from "./Views";
import previewViews from "./previewViews";

if (module.hot) {
	module.hot.accept();
}

class BookmarkViews extends View {
	//
	_parentElement = document.querySelector(".bookmarks__list");
	_errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)";
	_message = "some message";

	addHandlerRender(handler) {
		window.addEventListener("load", handler);
	}

	_generateMarkup() {
		return this._data
			.map((bookmark) => previewViews.render(bookmark, false))
			.join("");
	}
}

export default new BookmarkViews();
