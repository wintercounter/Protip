/**
 * PositionCalculator Class
 * Calculates the proper top/left values for a tooltip.
 */

import * as C from 'Constants'

export default class {

	/* jshint ignore:start */
	Item      = undefined
	Protip    = undefined
	Source    = undefined
	Target    = undefined
	Position  = undefined
	Placement = undefined
	Offset    = undefined
	/* jshint ignore:end */

	/**
	 * Constructor.
	 *
	 * @memberOf PositionCalculator
	 * @param itemInstance {ProtipItemClass}             ProtipItem instance.
	 * @param position     {string}                      Position to calculate for.
	 * @param offset       {{top: number, left: number}} X/Y offset of the tooltip.
	 * @returns {*}
	 * @private
	 */
	constructor (item, position, offset) {
		/**
		 * ProtipItem instance.
		 *
		 * @type {ProtipItemClass}
		 * @private
		 */
		this.Item = item

		/**
		 * Initial values of of the protip element.
		 *
		 * @type {object}
		 * @private
		 */
		this.Protip = this._getProto(this.Item.$protip)

		/**
		 * Initial values of of the source element.
		 *
		 * @type {object}
		 * @private
		 */
		this.Source = this._getProto(this.Item.$source)

		/**
		 * Initial values of of the target element.
		 *
		 * @type {object}
		 * @private
		 */
		this.Target = this._getProto(this.Item.$target);

		/**
		 * Position.
		 *
		 * @type {string}
		 * @private
		 */
		this.Position = position || this.Item.get(C.PROP_POSITION);

		/**
		 * Placement.
		 *
		 * @type {string}
		 * @private
		 */
		this.Placement = this.Item.get(C.PROP_PLACEMENT);

		/**
		 * Offset of the tooltip.
		 *
		 * @type {{top: number, left: number}}
		 * @private
		 */
		this.Offset = offset || {
			top: this._itemInstance.data.offsetTop,
			left: this._itemInstance.data.offsetLeft
		}

		return this._getPosition()
	}

	/**
	 * Fetches some initial values for an element.
	 * width, height, offset
	 *
	 * @param el {jQuery} Element we want to get the values for.
	 * @returns {object}
	 * @private
	 */
	_getProto:

	function(el) {
		var proto = {
			el: undefined,
			width: undefined,
			height: undefined,
			offset: undefined
		};
		proto.el = el;
		proto.width = el.outerWidth();
		proto.height = el.outerHeight();
		proto.offset = el.offset();
		return proto;
	}

,

	/**
	 * Calculates the CSS position.
	 *
	 * @returns {{top: number, left: number}}
	 * @private
	 */
	_getPosition:

	function() {
		this._itemInstance.applyPosition(this._position);

		var position = {left: 0, top: 0};
		var arrowOffset = this._itemInstance.getArrowOffset();
		var globalOffset = this._itemInstance.classInstance.settings.offset;

		if (this._placement !== C.PLACEMENT_CENTER) {
			switch (this._position) {
				case C.POSITION_TOP:
					this._offset.top += (globalOffset + arrowOffset.height) * -1;
					position.left = ((this._source.offset.left + this._source.width / 2 - this._protip.width / 2) - this._target.offset.left) + this._offset.left;
					position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
					break;
				case C.POSITION_TOP_LEFT:
					this._offset.top += (globalOffset + arrowOffset.height) * -1;
					position.left = (this._source.offset.left) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
					break;
				case C.POSITION_TOP_RIGHT:
					this._offset.top += (globalOffset + arrowOffset.height) * -1;
					position.left = (this._source.offset.left + this._source.width - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
					break;
				case C.POSITION_RIGHT:
					this._offset.left += (globalOffset + arrowOffset.width);
					position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height / 2 - this._protip.height / 2) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
					if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
					break;
				case C.POSITION_RIGHT_TOP:
					this._offset.left += (globalOffset + arrowOffset.width);
					position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
					if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
					break;
				case C.POSITION_RIGHT_BOTTOM:
					this._offset.left += (globalOffset + arrowOffset.width);
					position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
					if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
					break;
				case C.POSITION_BOTTOM:
					this._offset.top += (globalOffset + arrowOffset.height);
					position.left = (this._source.offset.left + this._source.width / 2 - this._protip.width / 2) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
					break;
				case C.POSITION_BOTTOM_LEFT:
					this._offset.top += (globalOffset + arrowOffset.height);
					position.left = (this._source.offset.left) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
					break;
				case C.POSITION_BOTTOM_RIGHT:
					this._offset.top += (globalOffset + arrowOffset.height);
					position.left = (this._source.offset.left + this._source.width - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
					break;
				case C.POSITION_LEFT:
					this._offset.left += (globalOffset + arrowOffset.width) * -1;
					position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height / 2 - this._protip.height / 2) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
					if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
					break;
				case C.POSITION_LEFT_TOP:
					this._offset.left += (globalOffset + arrowOffset.width) * -1;
					position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
					if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
					break;
				case C.POSITION_LEFT_BOTTOM:
					this._offset.left += (globalOffset + arrowOffset.width) * -1;
					position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
					if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
					break;
				case C.POSITION_CORNER_LEFT_TOP:
					this._offset.top += (globalOffset + arrowOffset.height) * -1;
					position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
					if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
					if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
					break;
				case C.POSITION_CORNER_LEFT_BOTTOM:
					this._offset.top += (globalOffset + arrowOffset.height);
					position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
					if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
					if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
					break;
				case C.POSITION_CORNER_RIGHT_BOTTOM:
					this._offset.top += (globalOffset + arrowOffset.height);
					position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
					if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
					if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
					break;
				case C.POSITION_CORNER_RIGHT_TOP:
					this._offset.top += (globalOffset + arrowOffset.height) * -1;
					position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
					position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
					if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
					if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
					if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
					if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
					break;
				default:
					break;
			}
		}

		// Center Placement
		else {
			position.left = (this._source.offset.left + this._source.width / 2 - this._protip.width / 2) - this._target.offset.left + this._offset.left;
			position.top = (this._source.offset.top + this._source.height / 2 - this._protip.height / 2) - this._target.offset.top + this._offset.top;
		}

		position.left = position.left + 'px';
		position.top = position.top + 'px';

		return position;
	}

}