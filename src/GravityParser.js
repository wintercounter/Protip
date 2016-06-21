/**
 * GravityParser Class
 *
 * It will parse the gravity attribute and
 * generate the position list for gravity testing.
 */

(function (root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Constants'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery'),
			require('./Constants')
		);
	} else {
		root.ProtipGravityParser = factory(
			root.jQuery,
			root.ProtipConstants
		);
	}
}(this, function ($, C) {

	'use strict';

	/**
	 * GravityParser Class
	 *
	 * @param input {string|number} Value of data-pt-gravity
	 * @param position {string}     Default position
	 * @returns {Array}
	 * @constructor
	 */
	var GravityParser = function (input, position) {
		return this._Construct(input, position);
	};

// Define the GravityParser members
	$.extend(true, GravityParser.prototype, {
		/**
		 * Constructor
		 *
		 * @memberOf GravityParser
		 * @param input {string|number} Value of data-pt-gravity
		 * @param position {string}     Default position
		 * @returns {Array}
		 * @private
		 */
		_Construct: function (input, position) {

			/**
			 * List of all positions
			 *
			 * @type {[]}
			 * @private
			 */
			this._positionsList = [
				{lvl: 1, key: position, top: 0, left: 0},
				{lvl: 3, key: C.POSITION_CORNER_LEFT_TOP, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_TOP_LEFT, top: 0, left: 0},
				{lvl: 1, key: C.POSITION_TOP, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_TOP_RIGHT, top: 0, left: 0},
				{lvl: 3, key: C.POSITION_CORNER_RIGHT_TOP, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_RIGHT_TOP, top: 0, left: 0},
				{lvl: 1, key: C.POSITION_RIGHT, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_RIGHT_BOTTOM, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_BOTTOM_LEFT, top: 0, left: 0},
				{lvl: 1, key: C.POSITION_BOTTOM, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_BOTTOM_RIGHT, top: 0, left: 0},
				{lvl: 3, key: C.POSITION_CORNER_RIGHT_BOTTOM, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_LEFT_TOP, top: 0, left: 0},
				{lvl: 1, key: C.POSITION_LEFT, top: 0, left: 0},
				{lvl: 2, key: C.POSITION_LEFT_BOTTOM, top: 0, left: 0},
				{lvl: 3, key: C.POSITION_CORNER_LEFT_BOTTOM, top: 0, left: 0}
			];

			/**
			 * Value of data-pt-gravity
			 *
			 * @type {string|number}
			 * @private
			 */
			this._input = input;

			/**
			 * Final results
			 *
			 * @type {Array}
			 * @private
			 */
			this._finals = [];

			// Do it!
			this._parse();

			return this._finals;
		},

		/**
		 * It'll parse the input.
		 *
		 * @private
		 */
		_parse: function () {

			// Value is true or 3, we need all the positions.
			if (this._input === true || this._input === 3) {
				this._finals = this._positionsList;
			}

			// Other number given, get list based on items level.
			else if (!isNaN(this._input)) {
				this._finals = this._positionsList.filter(function (a) {
					return a.lvl <= this._input;
				}.bind(this));
			}

			// Else parse our syntax.
			else {
				var keys = [],
					hasRest = false;

				// Split at ; and check each values.
				this._finals = this._input.split(';').map(function (a) {
					a = a.trim();

					// Attach all others
					if (a === '...') {
						hasRest = true;
					}

					// Parse position key and value
					else if (a) {
						var value = a.split(' ').map(function (b) {
							return b.trim();
						});
						keys.push(value[0]);

						return {
							lvl:  1, key: value[0],
							left: parseInt(value[1], 10) || 0,
							top:  parseInt(value[2], 10) || 0
						};
					}
				}).filter(function (a) {
					return !!a;
				});

				if (hasRest) {
					this._positionsList.forEach(function (val) {
						if (keys.indexOf(val.key) === -1) {
							this._finals.push(val);
						}
					}.bind(this));
				}
			}
		}
	});

	return GravityParser;

}));