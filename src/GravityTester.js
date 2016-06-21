/**
 * GravityTester Class
 *
 * Class to handle gravity cases.
 * Gets positions, does viewport tests.
 */

(function (root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Constants',
			'./GravityParser',
			'./PositionCalculator'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery'),
			require('./Constants'),
			require('./GravityParser'),
			require('./PositionCalculator')
		);
	} else {
		root.ProtipGravityTester = factory(
			root.jQuery,
			root.ProtipConstants,
			root.ProtipGravityParser,
			root.ProtipPositionCalculator
		);
	}
}(this, function ($, C, GravityParser, PositionCalculator) {

	'use strict';

	/**
	 * GravityTester class.
	 *
	 * @param protipItem {ProtipItemClass} The ProtipItem Instance.
	 * @returns {<top>:<string>, <left>:<string>}
	 * @constructor
	 */
	var GravityTester = function(protipItem){
		return this._Construct(protipItem);
	};

	// Define the GravityTester members.
	$.extend(true, GravityTester.prototype, {

		/**
		 * Constructor.
		 *
		 * @memberOf GravityTester
		 * @param protipItemInstance {ProtipItemClass} The ProtipItem Instance.
		 * @returns {<top>:<string>, <left>:<string>}
		 * @private
		 */
		_Construct: function(protipItemInstance){
			/**
			 * ItemClass instance.
			 *
			 * @type {ProtipItemClass}
			 * @private
			 */
			this._item = protipItemInstance;

			/**
			 * Results.
			 *
			 * @type {object}
			 * @private
			 */
			this._result = undefined;

			// Set some initial values.
			this._setWindowDimensions();

			/**
			 * List of positions to check.
			 *
			 * @type {array}
			 * @private
			 */
			this._positionList = new GravityParser(this._item.data.gravity, this._item.data.position);

			// Iterate through each position and do a check.
			var i;
			for (i = 0; i < this._positionList.length; i++) {
				// We had a successful test, break the loop.
				if (this._test(this._positionList[i])) {
					break;
				}
			}

			// Set first for prior
			this._item.data.position = this._positionList[0].key;

			// Return the result if we had one. Return values for the default position if not.
			return this._result || new PositionCalculator(this._item);
		},

		/**
		 * Does position test based on the position given in the parameter.
		 * It'll do a position calculation and tries the protip from every side.
		 *
		 * @param position {object} Position of the element.
		 * @returns {boolean}
		 * @private
		 */
		_test: function(position){
			this._setProtipMinWidth();
			var result = new PositionCalculator(this._item, position.key, position);
			this._item.el.protip.css(result);
			this._setProtipDimensions();

			if (this._topOk() && this._rightOk() && this._bottomOk() && this._leftOk()) {
				result.position = position.key;
				this._result = result;
				return true;
			}
			return false;
		},

		/**
		 * Check protip overflow from the top.
		 *
		 * @returns {boolean}
		 * @private
		 */
		_topOk: function(){
			return ((this._dimensions.offset.top - this._windowDimensions.scrollTop) > 0);
		},

		/**
		 * Check protip overflow from the right.
		 *
		 * @returns {boolean}
		 * @private
		 */
		_rightOk: function(){
			return ((this._dimensions.offset.left + this._dimensions.width) < this._windowDimensions.width);
		},

		/**
		 * Check protip overflow from the bottom
		 *
		 * @returns {boolean}
		 * @private
		 */
		_bottomOk: function(){
			return (((this._dimensions.offset.top - this._windowDimensions.scrollTop) + this._dimensions.height) < this._windowDimensions.height);
		},

		/**
		 * Check protip overflow from the left
		 *
		 * @returns {boolean}
		 * @private
		 */
		_leftOk: function(){
			return (this._dimensions.offset.left > 0);
		},

		/**
		 * Sets the min width of the tooltip.
		 *
		 * @private
		 */
		_setProtipMinWidth: function() {
			if (this._item.classInstance.settings.forceMinWidth) {
				this._item.el.protip.css({
					position: 'fixed',
					left: 0,
					top: 0,
					minWidth: 0
				});

				var minWidth = this._item.el.protip.outerWidth() + 1; // Thanks Firefox
				this._item.el.protip.css({
					position: '',
					left: '',
					top: '',
					minWidth: minWidth + 'px'
				});
			}
		},

		/**
		 * Gets/sets initial protip dimensions to caclulate with.
		 *
		 * @private
		 */
		_setProtipDimensions: function(){
			this._dimensions = {
				width:  this._item.el.protip.outerWidth() || 0,
				height: this._item.el.protip.outerHeight() || 0,
				offset: this._item.el.protip.offset()
			};
		},

		/**
		 * Get some window dimension values
		 *
		 * @private
		 */
		_setWindowDimensions: function(){
			var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				x = w.innerWidth || e.clientWidth || g.clientWidth,
				y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			this._windowDimensions = {
				width: parseInt(x),
				height: parseInt(y),
				scrollTop : (window.pageYOffset || document.documentElement.scrollTop || document.getElementsByTagName('body')[0].scrollTop || 0)
			};
		}
	});

	return GravityTester;

}));