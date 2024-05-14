import icons from "../../img/icons.svg";

export default class View {
	// Parent Class for all the views
	_data;
	_clear() {
		this._parentElement.innerHTML = "";
	}

	render(data) {
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const markup = this._generateMarkup();
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
	renderSpinner() {
		const html = `
		<div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
	`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", html);
	}

	renderError(message = this._errorMessage) {
		const markup = `
    	<div class="error">
    		<div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}

	renderMessage(message = this._message) {
		const markup = `
    	<div class="message">
    		<div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>`;
		this._clear();
		this._parentElement.insertAdjacentHTML("afterbegin", markup);
	}
}
