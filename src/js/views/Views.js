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

	update(data) {
		// Update element
		if (!data || (Array.isArray(data) && data.length === 0))
			return this.renderError();

		this._data = data;
		const newMarkup = this._generateMarkup();

		const newDOM = document
			.createRange()
			.createContextualFragment(newMarkup);
		const newElements = Array.from(newDOM.querySelectorAll("*"));
		const currentElements = Array.from(
			this._parentElement.querySelectorAll("*"),
		);
		newElements.forEach((newElement, index) => {
			const currentElement = currentElements[index];

			// Update (render) servings and ingredients numbers
			if (
				!newElement.isEqualNode(currentElement) &&
				newElement.firstChild?.nodeValue.trim() !== ""
			) {
				currentElement.textContent = newElement.textContent;
			}

			// Update data value of servings number in element
			if (!newElement.isEqualNode(currentElement)) {
				Array.from(newElement.attributes).forEach((attribute) => {
					currentElement.setAttribute(
						attribute.name,
						attribute.value,
					);
				});
			}
		});
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
