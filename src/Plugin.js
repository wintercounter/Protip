(function (root, factory) {

    'use strict'

	if (typeof define === 'function' && define.amd) {
		define([
			root,
			'./Class',
			'./Class',
			'./Constants'
		], factory)
	} else if (typeof exports === 'object') {
		module.exports = factory(
			root,
			require('./Class'),
			require('./Buffer'),
			require('./Constants')
		)
	} else {
		factory(
			root,
			root.ProtipClass,
			root.ProtipBuffer,
			root.ProtipContants
		)
	}
}(this, function (window, ProtipClass, ProtipBuffer, C) {

    'use strict'

	var Protip = function(settings){
		var classInstance = undefined
		var buffer        = undefined
		Protip.Instance = new ProtipClass(settings)
	}

	// Buffer instance
	Protip.Buffer = new ProtipBuffer()

	// Shorthand for constants
	Protip.C = C

	// API constructor
	Protip.API = function(el){
		this.el = el
	}

	// API methods
	Protip.API.prototype = {
		/**
		 * Simply sets tooltip to the element but it won't show.
		 *
		 * @param override [Object] Pass custom settings to this tooltip.
		 * @returns {Element}
		 */
		set: function(override) {
			if (Protip.Buffer.isReady()) {
				this.el.protip.destroy()
				Protip.Instance.get(this.el, override)
			}
			else {
				Protip.Buffer.add('set', this.el, arguments)
			}
			return this.el
		},

		/**
		 * Shows the protip on an element.
		 *
		 * @param override [Object] Pass custom settings to this tooltip.
		 * @returns {Element}
		 */
		show: function(override) {
			if (Protip.Buffer.isReady()) {
				this.el.protip.destroy()
				Protip.Instance.get(this.el, override).show(true)
			}
			else {
				Protip.Buffer.add('show', this.el, arguments)
			}
			return this.el
		},

		/**
		 * Hides a protip on an element.
		 *
		 * @returns {Element}
		 */
		hide: function() {
			if (Protip.Buffer.isReady()) {
				Protip.Instance.get(this.el).hide(true)
			}
			else {
				Protip.Buffer.add('hide', this.el, arguments)
			}
			return this.el
		},

		/**
		 * Toggles protip on an element.
		 *
		 * @returns {Element}
		 */
		toggle: function() {
			if (Protip.Buffer.isReady()) {
				var instance = Protip.Instance.get(this.el)
				instance.isVisible()
					? instance.hide(true)
					: instance.show(true)
			}
			else {
				Protip.Buffer.add('toggle', this.el, arguments)
			}
			return this.el
		},

		/**
		 * Hides all tooltips inside this element.
		 *
		 * @returns {Element}
		 */
		hideInside: function(){
			if (Protip.Buffer.isReady()) {
				this._findAll(this.hide);
			}
			else {
				Protip.Buffer.add('hideInside', this.el, arguments)
			}
			return this.el
		},

		/**
		 * Shows all tooltips inside this element.
		 *
		 * @returns {Element}
		 */
		showInside: function(){
			if (Protip.Buffer.isReady()) {
				this._findAll(this.show);
			}
			else {
				Protip.Buffer.add('showInside', this.el, arguments)
			}
			return this.el
		},

		/**
		 * Toggles protips inside another element.
		 *
		 * @returns {*}
		 */
		toggleInside: function(){
			if (Protip.Buffer.isReady()) {
				this._findAll(this.toggle)
			}
			else {
				Protip.Buffer.add('toggleInside', this, arguments)
			}
			return this.el
		},

		/**
		 * Finds all tooltips inside an element and applies a callback to them.
		 * @private
		 */
		_findAll: function(callback){
			[].forEach.call(
				this.el.querySelectorAll(Protip.Instance.settings.selector),
				callback.bind(this.el)
			)
		}
	}

	// Apply Protip on Element.prototype
	Object.defineProperty(window.Element.prototype, 'protip', {
		get: function () {
			return Protip.API(this)
		},
		configurable: true,
		writeable: false
	})

	return Protip

}))