/**
 * GravityTester Class
 *
 * Class to handle gravity cases.
 * Gets positions, does viewport tests.
 */

import * as C from './Constants'
import GravityParser from './GravityParser'
import PositionCalculator from './PositionCalculator'
import Util from './Util'

export default class {

	/* jshint ignore:start */
	/**
	 * ItemClass instance.
	 *
	 * @type {ProtipItemClass}
	 * @private
	 */
	$ = undefined
	Result = undefined
	PositionList = undefined
	/* jshint ignore:end */

	/**
	 * Constructor.
	 * @param protipItemInstance {ProtipItemClass} The ProtipItem Instance.
	 * @returns {<top>:<string>, <left>:<string>}
	 * @private
	 */
	constructor($source, $protip) {

		this.$source = $source
		this.$protip = $protip

		// Set some initial values.
		this._setWindowDimensions()

		/**
		 * List of positions to check.
		 *
		 * @type {array}
		 * @private
		 */
		this.PositionList = new GravityParser(
			this.$source.protip.get(C.PROP_GRAVITY),
			this.$source.protip.get(C.PROP_POSITION)
		)

		// Iterate through each position and do a check.
		for (let i = 0; i < this.PositionList.length; i++) {
			// We had a successful test, break the loop.
			if (this._test(this.PositionList[i])) break
		}

		// Set first for prior
		//this._item.data.position = this._positionList[0].key

		// Return the result if we had one. Return values for the default position if not.
		return this._result || new PositionCalculator(this.$protip)
	}

	/**
	 * Does position test based on the position given in the parameter.
	 * It'll do a position calculation and tries the protip from every side.
	 *
	 * @param position {object} Position of the element.
	 * @returns {boolean}
	 * @private
	 */
	_test(position) {
		this._setProtipMinWidth()
		let result = new PositionCalculator(
			this.$protip,
			position.key,
			position
		)
		Util.extend(this.$protip.style, result)
		this._setProtipDimensions()

		if (this._topOk() && this._rightOk() && this._bottomOk() && this._leftOk()) {
			result.position = position.key
			this._result = result
			return true
		}
		return false
	}

	/**
	 * Check protip overflow from the top.
	 *
	 * @returns {boolean}
	 * @private
	 */
	_topOk() {
		return ((this._dimensions.offset.top - this._windowDimensions.scrollTop) > 0)
	}

	/**
	 * Check protip overflow from the right.
	 *
	 * @returns {boolean}
	 * @private
	 */
	_rightOk() {
		return ((this._dimensions.offset.left + this._dimensions.width) < this._windowDimensions.width)
	}

	/**
	 * Check protip overflow from the bottom
	 *
	 * @returns {boolean}
	 * @private
	 */
	_bottomOk() {
		return (((this._dimensions.offset.top - this._windowDimensions.scrollTop) + this._dimensions.height) < this._windowDimensions.height)
	}

	/**
	 * Check protip overflow from the left
	 *
	 * @returns {boolean}
	 * @private
	 */
	_leftOk() {
		return (this._dimensions.offset.left > 0)
	}

	/**
	 * Sets the min width of the tooltip.
	 *
	 * @private
	 */
	_setProtipMinWidth() {
		if (Protip.Class.settings.forceMinWidth) {

			Util.extend(this.$protip.style, {
				position: 'fixed',
				left: 0,
				top: 0,
				minWidth: 0
			})

			Util.extend(this.$protip.style, {
				position: '',
				left: '',
				top: '',
				minWidth: `${this.$protip.offsetWidth+1}px`
			})
		}
	}

	/**
	 * Gets/sets initial protip dimensions to caclulate with.
	 *
	 * @private
	 */
	_setProtipDimensions() {
		this._dimensions = {
			width:  this.$protip.offsetWidth,
			height: this.$protip.offsetHeight,
			offset: {
				top: this.$protip.offsetTop,
				left: this.$protip.offsetLeft
			}
		}
	}

	/**
	 * Get some window dimension values
	 *
	 * @private
	 */
	_setWindowDimensions() {
		let w = window
		let d = document
		let e = d.documentElement
		let g = d.getElementsByTagName('body')[0]
		let x = w.innerWidth || e.clientWidth || g.clientWidth
		let y = w.innerHeight|| e.clientHeight|| g.clientHeight

		this._windowDimensions = {
			width: parseInt(x, 10),
			height: parseInt(y, 10),
			scrollTop : (window.pageYOffset || document.documentElement.scrollTop || document.getElementsByTagName('body')[0].scrollTop || 0)
		}
	}
}