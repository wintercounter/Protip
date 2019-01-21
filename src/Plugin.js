(function (root, factory) {

    'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Class',
			'./Buffer',
			'./Constants'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery'),
			require('./Class'),
			require('./Buffer'),
			require('./Constants')
		);
	} else {
		factory(
			root.jQuery,
			root.ProtipClass,
			root.ProtipBuffer,
			root.ProtipContants
		);
	}
}(this, function ($, ProtipClass, ProtipBuffer, C) {

    'use strict';

	// Extend the jQuery object with singleton members
	$ = $.extend($, {
		_protipClassInstance: undefined,
		_protipBuffer: new ProtipBuffer(),
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
		 * Destroys protip
		 */
		protipDestroy: function() {
			if ($._protipBuffer.isReady()) {
				return this.each(function (index, el) {
					el = $(el);
					$._protipClassInstance.getItemInstance(el).destroy();
				});
			}
			return this;
		},
		
		/**
		 * Simply sets tooltip to the element but it won't show.
		 *
		 * @returns {*}
		 */
		protipSet: function(override) {
			if ($._protipBuffer.isReady()) {
				return this.each(function (index, el) {
					el = $(el);
					$._protipClassInstance.getItemInstance(el).destroy();
					$._protipClassInstance.getItemInstance(el, override);
				});
			}
			$._protipBuffer.add('protipSet', this, arguments);
			return this;
		},

		/**
		 * Shows the protip on an element.
		 *
		 * @returns {*}
		 */
		protipShow: function(override) {
			if ($._protipBuffer.isReady()) {
				return this.each(function (index, el) {
					el = $(el);
					$._protipClassInstance.getItemInstance(el).destroy();
					$._protipClassInstance.getItemInstance(el, override).show(true);
				});
			}
			$._protipBuffer.add('protipShow', this, arguments);
			return this;
		},

		/**
		 * Hides a protip on an element.
		 *
		 * @returns {*}
		 */
		protipHide: function() {
			if ($._protipBuffer.isReady()) {
				return this.each(function (index, el) {
					$._protipClassInstance.getItemInstance($(el)).hide(true);
				});
			}
			$._protipBuffer.add('protipHide', this, arguments);
			return this;
		},

		/**
		 * Toggles protip on an element.
		 *
		 * @returns {*}
		 */
		protipToggle: function() {
			if ($._protipBuffer.isReady()) {
				var instance;
				return this.each(function (index, el) {
					instance = $._protipClassInstance.getItemInstance($(el));
					instance = instance.isVisible() ? instance.hide(true) : instance.show(true);
				}.bind(this));
			}
			$._protipBuffer.add('protipToggle', this, arguments);
			return this;
		},

		/**
		 * Hides protips inside another element.
		 *
		 * @returns {*}
		 */
		protipHideInside: function(){
			if ($._protipBuffer.isReady()) {
				return this.each(function (index, el) {
					$(el).find($._protipClassInstance.settings.selector).each(function (index, el2) {
						$._protipClassInstance.getItemInstance($(el2)).hide(true);
					});
				});
			}
			$._protipBuffer.add('protipHideInside', this, arguments);
			return this;
		},

		/**
		 * Shows protips inside another element.
		 *
		 * @returns {*}
		 */
		protipShowInside: function(){
			if ($._protipBuffer.isReady()) {
				return this.each(function (index, el) {
					$(el).find($._protipClassInstance.settings.selector).each(function (index, el2) {
						$._protipClassInstance.getItemInstance($(el2)).show(true);
					});
				});
			}
			$._protipBuffer.add('protipShowInside', this, arguments);
			return this;
		},

		/**
		 * Toggles protips inside another element.
		 *
		 * @returns {*}
		 */
		protipToggleInside: function(){
			if ($._protipBuffer.isReady()) {
				var instance;

				return this.each(function (index, el) {
					$(el).find($._protipClassInstance.settings.selector).each(function (index, el2) {
						instance = $._protipClassInstance.getItemInstance($(el2));
						instance = instance.isVisible() ? instance.hide(true) : instance.show(true);
					});
				});
			}
			$._protipBuffer.add('protipToggleInside', this, arguments);
			return this;
		}
	});

}));
