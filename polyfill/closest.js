// https://github.com/jonathantneal/closest
(function (ELEMENT) {
	ELEMENT.matches = ELEMENT.matches || ELEMENT.mozMatchesSelector || ELEMENT.msMatchesSelector || ELEMENT.oMatchesSelector || ELEMENT.webkitMatchesSelector;

	ELEMENT.closest = ELEMENT.closest || function closest(selector) {
			var element = this;

			while (element) {
				if (element.matches(selector)) {
					break;
				}

				element = element.parentElement;
			}

			return element;
		};
}(Element.prototype));