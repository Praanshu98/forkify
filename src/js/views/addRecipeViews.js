import View from "./Views";

class addRecipeViews extends View {
	//
	_parentElement = document.querySelector(".upload");
	_window = document.querySelector(".add-recipe-window");
	_overlay = document.querySelector(".overlay");
	_buttonOpen = document.querySelector(".nav__btn--add-recipe");
	_buttonClose = document.querySelector(".btn--close-modal");
	_message = "Recipe was successfully uploaded.";

	constructor() {
		super();
		this._addHandlerShowWindow();
		this._addHandlerHideWindow();
	}

	_addHandlerShowWindow() {
		this._buttonOpen.addEventListener(
			"click",
			this.toggleWindow.bind(this),
		);
	}

	_addHandlerHideWindow() {
		this._buttonClose.addEventListener(
			"click",
			this.toggleWindow.bind(this),
		);
	}

	toggleWindow() {
		this._overlay.classList.toggle("hidden");
		this._window.classList.toggle("hidden");
	}

	addHandlerUpload(handler) {
		this._parentElement.addEventListener("submit", function (event) {
			event.preventDefault();
			const dataArray = [...new FormData(this)];
			const data = Object.fromEntries(dataArray);
			handler(data);
		});
	}

	_generateMarkup() {
		//
	}
}

export default new addRecipeViews();
