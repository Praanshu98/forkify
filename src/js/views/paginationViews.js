import icons from "../../img/icons.svg";
import View from "./Views";

class PaginationView extends View {
	//
	_parentElement = document.querySelector(".pagination");

	addHandlerClick(handler) {
		this._parentElement.addEventListener("click", (event) => {
			const button = event.target.closest(".btn--inline");
			if (!button) return;

			handler(+button.dataset.goto);
		});
	}

	_generateMarkup() {
		const currentPage = this._data.page;
		const numberPages = Math.ceil(
			this._data.result.length / this._data.resultsPerPage,
		);
		// Page 1, and there are other pages
		if (currentPage === 1 && numberPages > 1) {
			return `
            <button data-goto=${
				currentPage + 1
			} class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
		}

		// Last Page
		if (currentPage === numberPages && numberPages > 1) {
			return `
            <button data-goto=${
				currentPage - 1
			} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            `;
		}

		// Other page
		if (currentPage < numberPages) {
			return `
            <button data-goto=${
				currentPage - 1
			} class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${currentPage - 1}</span>
            </button>
            <button data-goto=${
				currentPage + 1
			} class="btn--inline pagination__btn--next">
                <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
            `;
		}

		// Page 1, and there are no other pages
		return "";
	}
}

export default new PaginationView();
