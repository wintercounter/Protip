/**
 * Buffer Class
 *
 * It will create a buffer of called protip jQuery helper methods
 * and recalls them after protip initialization is done.
 */

(function (root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery')
		);
	} else {
		factory(
			root.jQuery
		);
	}
}(this, function ($) {

	'use strict';

	/**
	 * Buffer Class
	 *
	 * @returns {Buffer}
	 * @constructor
	 */
	var Buffer = function () {
		return this._Construct();
	};

	// Define the GravityParser members
	Buffer.prototype = {
		/**
		 * Constructor
		 *
		 * @memberOf Buffer
		 * @returns {Buffer}
		 * @private
		 */
		_Construct: function () {

			/**
			 * List of commands called.
			 *
			 * @type {[]}
			 * @private
			 */
			this._commandList = [];

			/**
			 * Tells if Protip is ready.
			 *
			 * @type {boolean}
			 * @private
			 */
			this._isReady = false;

			/**
			 * Starts interval timer for checks.
			 *
			 * @type {number}
			 * @private
			 */
			this._timer = setInterval(this._check.bind(this), 10);

			return this;
		},

		/**
		 * Add cmd to buffer
		 *
		 * @param {cmd}     cmd     The command called.
		 * @param {jQuery}  el      The jQuery element the item is called on.
		 * @param {cmdArgs} cmdArgs The arguments the command was called with.
		 */
		add: function (cmd, el, cmdArgs) {
			this._commandList.push({
				cmd: cmd,
				el: el,
				cmdArgs: cmdArgs
			});
		},

		/**
		 * Public getter for isReady.
		 *
		 * @returns {boolean}
		 */
		isReady: function(){
			return this._isReady;
		},

		/**
		 * Check interval callback.
		 *
		 * @private
		 */
		_check: function(){
			$._protipClassInstance
			&& (this._isReady = true)
			&& (!this._commandList.length || this._run())
			&& clearInterval(this._timer);
		},

		/**
		 * Add cmd to buffer.
		 *
		 * @private
		 */
		_run: function () {
			var call = this._commandList.shift();
			call.el[call.cmd].apply(call.el, call.cmdArgs);
			this._commandList.length && this._run();
			return true;
		}
	};

	return Buffer;
}));