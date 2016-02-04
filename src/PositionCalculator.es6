/**
 * PositionCalculator Class
 * Calculates the proper top/left values for a tooltip.
 */

import * as C from './Constants'

export default class {

	/* jshint ignore:start */
	Protip    = undefined
	Source    = undefined
	Target    = undefined
	Item      = undefined
	Position  = undefined
	Placement = undefined
	Offset    = undefined
	/* jshint ignore:end */

	/**
	 * Constructor.
	 *
	 * @memberOf PositionCalculator
	 * @param itemInstance {Element}                     ProtipItem instance.
	 * @param position     {string}                      Position to calculate for.
	 * @param offset       {{top: number, left: number}} X/Y offset of the tooltip.
	 * @returns {*}
	 * @private
	 */
	constructor ($, position, offset) {
		/**
		 * ProtipItem instance.
		 *
		 * @type {ProtipItemClass}
		 * @private
		 */
		this.Item = $.protip.getInstance($)

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
		this.Target = this._getProto(this.Item.$target)

		/**
		 * Initial values of of the target element.
		 *
		 * @type {object}
		 * @private
		 */
		this.Arrow = this._getProto(this.Item.$arrow)

		/**
		 * Position.
		 *
		 * @type {string}
		 * @private
		 */
		this.Position = position || this.Protip.$.protip.get(C.PROP_POSITION)

		/**
		 * Placement.
		 *
		 * @type {string}
		 * @private
		 */
		this.Placement = this.Protip.$.protip.get(C.PROP_PLACEMENT)

		/**
		 * Offset of the tooltip.
		 *
		 * @type {{top: number, left: number}}
		 * @private
		 */
		this.Offset = offset || {
			top : this.Source.$.protip.get(C.PROP_OFFSET_TOP),
			left: this.Source.$.protip.get(C.PROP_OFFSET_LEFT)
		}

		return this._getPosition()
	}

	/**
	 * Fetches some initial values for an element.
	 * width, height, offset
	 *
	 * @param el {Element} Element we want to get the values for.
	 * @returns {object}
	 * @private
	 */
	_getProto ($) {
		if ($) {
			let rect = $.getBoundingClientRect()
			return {
				$: $,
				width: $.offsetWidth,
				height: $.offsetHeight,
				offset: {
					top: rect.top + document.body.scrollTop,
					left: rect.left + document.body.scrollLeft
				}
			}
		}
		else {
			return {
				width: 0,
				height: 0,
				offset: {
					top: 0,
					left: 0
				}
			}
		}
	}

	/**
	 * Calculates the CSS position.
	 *
	 * @returns {{top: string, left: string}}
	 * @private
	 */
	_getPosition () {
		this.Item.applyPosition(this.Position)

		let left = 0
		let top = 0
		let sourceOffsetLeft = this.Source.offset.left
		let sourceOffsetTop = this.Source.offset.top
		let targetOffsetLeft = this.Target.offset.left
		let targetOffsetTop = this.Target.offset.top
		let offsetLeft = this.Offset.left
		let offsetTop = this.Offset.top
		let arrowOffsetWidth = this.Arrow.width
		let arrowOffsetHeight = this.Arrow.height
		let protipWidth = this.Protip.width
		let protipHeight = this.Protip.height
		let sourceWidth = this.Source.width
		let sourceHeight = this.Source.height
		let globalOffset = Protip.Class.settings.offset
		let placement = this.Placement
		
		let INSIDE = C.PLACEMENT_INSIDE
		let BORDER = C.PLACEMENT_BORDER

		if (placement !== C.PLACEMENT_CENTER) {
			switch (this.Position) {
				case C.POSITION_TOP:
					offsetTop += (globalOffset + arrowOffsetHeight) * -1
					left = ((sourceOffsetLeft + sourceWidth / 2 - protipWidth / 2) - targetOffsetLeft) + offsetLeft
					top = (sourceOffsetTop - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) top += protipHeight
					if (placement === BORDER) top += protipHeight / 2
					break
				case C.POSITION_TOP_LEFT:
					offsetTop += (globalOffset + arrowOffsetHeight) * -1
					left = (sourceOffsetLeft) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) top += protipHeight
					if (placement === BORDER) top += protipHeight / 2
					break
				case C.POSITION_TOP_RIGHT:
					offsetTop += (globalOffset + arrowOffsetHeight) * -1
					left = (sourceOffsetLeft + sourceWidth - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) top += protipHeight
					if (placement === BORDER) top += protipHeight / 2
					break
				case C.POSITION_RIGHT:
					offsetLeft += (globalOffset + arrowOffsetWidth)
					left = (sourceOffsetLeft + sourceWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight / 2 - protipHeight / 2) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left -= protipWidth
					if (placement === BORDER) left -= protipWidth / 2
					break
				case C.POSITION_RIGHT_TOP:
					offsetLeft += (globalOffset + arrowOffsetWidth)
					left = (sourceOffsetLeft + sourceWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left -= protipWidth
					if (placement === BORDER) left -= protipWidth / 2
					break
				case C.POSITION_RIGHT_BOTTOM:
					offsetLeft += (globalOffset + arrowOffsetWidth)
					left = (sourceOffsetLeft + sourceWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left -= protipWidth
					if (placement === BORDER) left -= protipWidth / 2
					break
				case C.POSITION_BOTTOM:
					offsetTop += (globalOffset + arrowOffsetHeight)
					left = (sourceOffsetLeft + sourceWidth / 2 - protipWidth / 2) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) top -= protipHeight
					if (placement === BORDER) top -= protipHeight / 2
					break
				case C.POSITION_BOTTOM_LEFT:
					offsetTop += (globalOffset + arrowOffsetHeight)
					left = (sourceOffsetLeft) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) top -= protipHeight
					if (placement === BORDER) top -= protipHeight / 2
					break
				case C.POSITION_BOTTOM_RIGHT:
					offsetTop += (globalOffset + arrowOffsetHeight)
					left = (sourceOffsetLeft + sourceWidth - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) top -= protipHeight
					if (placement === BORDER) top -= protipHeight / 2
					break
				case C.POSITION_LEFT:
					offsetLeft += (globalOffset + arrowOffsetWidth) * -1
					left = (sourceOffsetLeft - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight / 2 - protipHeight / 2) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left += protipWidth
					if (placement === BORDER) left += protipWidth / 2
					break
				case C.POSITION_LEFT_TOP:
					offsetLeft += (globalOffset + arrowOffsetWidth) * -1
					left = (sourceOffsetLeft - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left += protipWidth
					if (placement === BORDER) left += protipWidth / 2
					break
				case C.POSITION_LEFT_BOTTOM:
					offsetLeft += (globalOffset + arrowOffsetWidth) * -1
					left = (sourceOffsetLeft - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left += protipWidth
					if (placement === BORDER) left += protipWidth / 2
					break
				case C.POSITION_CORNER_LEFT_TOP:
					offsetTop += (globalOffset + arrowOffsetHeight) * -1
					left = (sourceOffsetLeft - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left += protipWidth
					if (placement === INSIDE) top += protipHeight
					if (placement === BORDER) left += protipWidth / 2
					if (placement === BORDER) top += protipHeight / 2
					break
				case C.POSITION_CORNER_LEFT_BOTTOM:
					offsetTop += (globalOffset + arrowOffsetHeight)
					left = (sourceOffsetLeft - protipWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left += protipWidth
					if (placement === INSIDE) top -= protipHeight
					if (placement === BORDER) left += protipWidth / 2
					if (placement === BORDER) top -= protipHeight / 2
					break
				case C.POSITION_CORNER_RIGHT_BOTTOM:
					offsetTop += (globalOffset + arrowOffsetHeight)
					left = (sourceOffsetLeft + sourceWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop + sourceHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left -= protipWidth
					if (placement === INSIDE) top -= protipHeight
					if (placement === BORDER) left -= protipWidth / 2
					if (placement === BORDER) top -= protipHeight / 2
					break;
				case C.POSITION_CORNER_RIGHT_TOP:
					offsetTop += (globalOffset + arrowOffsetHeight) * -1
					left = (sourceOffsetLeft + sourceWidth) - targetOffsetLeft + offsetLeft
					top = (sourceOffsetTop - protipHeight) - targetOffsetTop + offsetTop
					if (placement === INSIDE) left -= protipWidth
					if (placement === INSIDE) top += protipHeight
					if (placement === BORDER) left -= protipWidth / 2
					if (placement === BORDER) top += protipHeight / 2
					break
				default: break
			}
		}
		// Center Placement
		else {
			left = (sourceOffsetLeft + sourceWidth / 2 - protipWidth / 2) - targetOffsetLeft + offsetLeft
			top = (sourceOffsetTop + sourceHeight / 2 - protipHeight / 2) - targetOffsetTop + offsetTop
		}

		return {
			left: left + 'px',
			top : top + 'px'
		}
	}
}