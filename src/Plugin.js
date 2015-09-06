(function (root, factory) {

    'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Class',
			'./Constants'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery'),
			require('./Class'),
			require('./Constants')
		);
	} else {
		factory(
			root.jQuery,
			root.ProtipClass,
			root.ProtipContants
		);
	}
}(this, function ($, ProtipClass, C) {

    'use strict';

	// Extend the jQuery object with singleton members
	$ = $.extend($, {
		_protipClassInstance: undefined,
		protip: function(settings){
			if (!this._protipClassInstance) {
				this._protipClassInstance = new ProtipClass(settings);
				this.protip.C = C;
			}
			return this._protipClassInstance;
		}
	});

	// Public element methods
	$.fn.extend({

		/**
		 * Simply sets tooltip to the element but it won't show.
		 *
		 * @returns {*}
		 */
		protipSet: function(override) {
			return this.each(function(index, el) {
				el = $(el);
				$._protipClassInstance.getItemInstance(el).destroy();
				$._protipClassInstance.getItemInstance(el, override);
			});
		},

		/**
		 * Shows the protip on an element.
		 *
		 * @returns {*}
		 */
		protipShow: function(override) {
			return this.each(function(index, el) {
				el = $(el);
				$._protipClassInstance.getItemInstance(el).destroy();
				$._protipClassInstance.getItemInstance(el, override).show(true);
			});
		},

		/**
		 * Hides a protip on an element.
		 *
		 * @returns {*}
		 */
		protipHide: function() {
			return this.each(function(index, el) {
				$._protipClassInstance.getItemInstance($(el)).hide(true);
			});
		},

		/**
		 * Toggles protip on an element.
		 *
		 * @returns {*}
		 */
		protipToggle: function() {
			var instance;

			return this.each(function(index, el) {
				instance = $._protipClassInstance.getItemInstance($(el));
				instance = instance.isVisible() ? instance.hide(true) : instance.show(true);
			}.bind(this));
		},

		/**
		 * Hides protips inside another element.
		 *
		 * @returns {*}
		 */
		protipHideInside: function(){
			return this.each(function(index, el) {
				$(el).find($._protipClassInstance.settings.selector).each(function(index, el2){
					$._protipClassInstance.getItemInstance($(el2)).hide(true);
				});
			});
		},

		/**
		 * Shows protips inside another element.
		 *
		 * @returns {*}
		 */
		protipShowInside: function(){
			return this.each(function(index, el) {
				$(el).find($._protipClassInstance.settings.selector).each(function(index, el2){
					$._protipClassInstance.getItemInstance($(el2)).show(true);
				});
			});
		},

		/**
		 * Toggles protips inside another element.
		 *
		 * @returns {*}
		 */
		protipToggleInside: function(){
			var instance;

			return this.each(function(index, el) {
				$(el).find($._protipClassInstance.settings.selector).each(function(index, el2){
					instance = $._protipClassInstance.getItemInstance($(el2));
					instance = instance.isVisible() ? instance.hide(true) : instance.show(true);
				});
			});
		}
	});

}));