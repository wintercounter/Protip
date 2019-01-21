/**
 * Item Class.
 * Each protip item has it's own ItemClass instance
 * so they can have their handler methods.
 */

(function (root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Constants',
			'./GravityTester',
			'./PositionCalculator'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery'),
			require('./Constants'),
			require('./GravityTester'),
			require('./PositionCalculator')
		);
	} else {
		root.ProtipItemClass = factory(
			root.jQuery,
			root.ProtipConstants,
			root.ProtipGravityTester,
			root.ProtipPositionCalculator
		);
	}
}(this, function ($, C, GravityTester, PositionCalculator) {

	"use strict";

	/**
	 * ProtipItem Class
	 *
	 * @param id            {string}      Identifier of the protip.
	 * @param el            {jQuery}      Source element we are creating the instance for.
	 * @param classInstance {ProtipClass} The main protip class instance.
	 * @param override      [object]      Override data-pt-* values.
	 *
	 * @returns {ProtipItemClass}
	 * @constructor
	 */
	var ProtipItemClass = function(id, el, classInstance, override){
		return this._Construct(id, el, classInstance, override);
	};

	// Define the ProtipItemClass members
	$.extend(true, ProtipItemClass.prototype, {

		/**
		 * Constructor of the class
		 *
		 * @memberOf ProtipItemClass
		 * @param id            {string}      Identifier of the protip.
		 * @param el            {jQuery}      Source element we are creating the instance for.
		 * @param classInstance {ProtipClass} The main protip class instance.
		 * @param override      [object]      Override data-pt-* values.
		 *
		 * @returns {ProtipItemClass}
		 * @private
		 */
		_Construct: function(id, el, classInstance, override){

			/** @type {object} Override data-pt-* values. */
			this._override = override || {};
			this._override.identifier = id;

			/** @type {object}    Object storing jQuery elements */
			this.el               = {};

			/** @type {jQuery}    The source element. */
			this.el.source        = el;

			/** @type {object}    All the data-* properties gathered from the source element. */
			this.data             = {};

			/** @type {ProtipClass} Saving the ProtipClass instance. */
			this.classInstance    = classInstance;

			/** @type {boolean}   Tells us of our protip is currently visible or not. */
			this._isVisible       = false;

			/** @type {object}    Object storing setTimeout tasks */
			this._task            = {
				delayIn: undefined,
				delayOut: undefined
			};

			// Prepare class
			this._fetchData();
			this._prepareInternals();
			this._appendProtip();
			this._initSticky();
			this._initAutoShow();
			this._bind();

			// Tell the source that we are ready to go and add protip class if it didn't have.
			this.el.source
				.addClass(this.classInstance.settings.selector.replace('.', ''))
				.data(this._namespaced(C.PROP_INITED), true);

			// Fire ready with some timeout so any script can catch up.
			setTimeout(function(){
				this.el.source.trigger(C.EVENT_PROTIP_READY, this)
			}.bind(this), 10);

			return this;
		},

		/**
		 * Common handler for every mouse event.
		 *
		 * @param eventType {string} Type of the event.
		 */
		actionHandler: function(eventType){

			if (this.data.trigger === C.TRIGGER_STICKY) {
				// No handler needed for sticky
			}
			// Handling clicky protips
			else if (
					eventType === C.EVENT_CLICK
					&& (this.data.trigger === C.TRIGGER_CLICK || this.data.trigger === C.TRIGGER_CLICK2)
			) {
				this.toggle();
			}
			// Handling mouseover protips
			else if (this.data.trigger !== C.TRIGGER_CLICK && this.data.trigger !== C.TRIGGER_CLICK2) {
				switch(eventType){
					case C.EVENT_MOUSEOUT:
						this.hide();
						break;
					case C.EVENT_MOUSEOVER:
						this.show();
						break;
					default: break;
				}
			}
		},

		/**
		 * Destroys the current intance.
		 * Reset data, hide, unbind, remove.
		 */
		destroy: function(){
			this.hide(true);
			this._unbind();
			this.el.protip.remove();
			this.el.source
				.data(this._namespaced(C.PROP_INITED), false)
				.data(this._namespaced(C.PROP_IDENTIFIER), false)
				.removeData();
			this.classInstance.onItemDestroyed(this.data.identifier);
			$.each(this._task, function(k, task){
				clearTimeout(task);
			});
		},

		/**
		 * Tells us if the our tooltip is visible or not.
		 *
		 * @returns {boolean}
		 */
		isVisible: function(){
			return this._isVisible;
		},

		/**
		 * Toggles the tooltip visibility state.
		 */
		toggle: function(){
			if (this._isVisible) {
				this.hide();
			}
			else {
				this.show();
			}
		},

		/**
		 * Make a tooltip visible.
		 *
		 * @param force          [boolean]  If 'true' there will be no timeouts.
		 * @param preventTrigger [boolean]  If 'true' protipShow won't be triggered.
		 */
		show: function(force, preventTrigger){

			// No title? Why tooltip?
			if (!this.data.title) {
				return;
			}

			// Clear timeouts
			this._task.delayOut && clearTimeout(this._task.delayOut);
			this._task.delayIn && clearTimeout(this._task.delayIn);
			this._task.autoHide && clearTimeout(this._task.autoHide);

			// Set new timeout task if needed
			if (!force && this.data.delayIn) {
				this._task.delayIn = setTimeout(function(){
					this.show(true);
				}.bind(this), this.data.delayIn);

				// Return, our timeout will again later...
				return;
			}

			// Auto hide
			if (this.data.autoHide !== false) {
				this._task.autoHide = setTimeout(function(){
					this.hide(true);
				}.bind(this), this.data.autoHide);
			}

			var style;

			// Handle gravity/non-gravity based position calculations
			if (this.data.gravity) {
				style = new GravityTester(this);
				delete style.position;
			}
			else {
				style = new PositionCalculator(this);
			}

			// Fire show event and add open class
			this.el.source.addClass(C.SELECTOR_OPEN);
			!preventTrigger && this.el.source.trigger(C.EVENT_PROTIP_SHOW, this);

			// Apply styles, classes
			this.el.protip
				.css(style)
				.addClass(C.SELECTOR_SHOW);

			// If we need animation
			this.data.animate &&
				this.el.protip
					.addClass(C.SELECTOR_ANIMATE)
					.addClass(this.data.animate || this.classInstance.settings.animate);

			// Set visibility
			this._isVisible = true;
		},

		/**
		 * Apply a position to the tooltip.
		 *
		 * @param position
		 */
		applyPosition: function(position){
			this.el.protip.attr('data-' + C.DEFAULT_NAMESPACE + '-' + C.PROP_POSITION, position);
		},

		/**
		 * Make a tooltip invisible.
		 *
		 * @param force          [boolean]  If 'true' there will be no timeouts.
		 * @param preventTrigger [boolean]  If 'true' protipHide event won't be triggered.
		 */
		hide: function(force, preventTrigger) {

			this._task.delayOut && clearTimeout(this._task.delayOut);
			this._task.delayIn && clearTimeout(this._task.delayIn);
			this._task.autoHide && clearTimeout(this._task.autoHide);

			// Set new timeout task if needed
			if (!force && this.data.delayOut) {
				this._task.delayOut = setTimeout(function(){
					this.hide(true);
				}.bind(this), this.data.delayOut);

				// Return, our timeout will call again later...
				return;
			}

			// Fire show event and remove open class
			this.el.source.removeClass(C.SELECTOR_OPEN);
			!preventTrigger && this.el.source.trigger(C.EVENT_PROTIP_HIDE, this);

			// Remove classes and set visibility
			this.el.protip
				.removeClass(C.SELECTOR_SHOW)
				.removeClass(C.SELECTOR_ANIMATE)
				.removeClass(this.data.animate);

			this._isVisible = false;
		},

		/**
		 * Returns arrow offset (width/height)
		 *
		 * @returns {{width: number, height: number}}
		 */
		getArrowOffset: function(){
			return {
				width:  this.el.protipArrow.outerWidth() || 0,
				height: this.el.protipArrow.outerHeight() || 0
			};
		},

		/**
		 * Fetches every data-* properties from the source element.
		 * It extends the defaults, then it applies back to the element.
		 *
		 * @private
		 */
		_fetchData: function(){

			// Fetch
			$.each(this.classInstance.settings.defaults, $.proxy(function(key){
				this.data[key] = this.el.source.data(this._namespaced(key));
			}, this));

			// Merge/Extend
			this.data = $.extend({}, this.classInstance.settings.defaults, this.data);
			this.data = $.extend({}, this.data, this._override);

			// Now apply back to the element
			$.each(this.data, $.proxy(function(key, value){
				this.el.source.data(this._namespaced(key), value);
			}, this));
		},

		/**
		 * A package function to call several setup procedures.
		 *
		 * @private
		 */
		_prepareInternals: function(){
			this._setTarget();
			this._detectTitle();
			this._checkInteractive();
		},

		/**
		 * Checks if the tooltip should be interactive and applies delayout according to it.
		 *
		 * @private
		 */
		_checkInteractive: function(){
			if (this.data.interactive) {
				this.data.delayOut = this.data.delayOut || C.DEFAULT_DELAY_OUT;
			}
		},

		/**
		 * Initializes sticky protips.
		 *
		 * @private
		 */
		_initSticky: function(){
			(this.data.trigger === C.TRIGGER_STICKY) && this.show();
		},

		/**
		 * Initializes autoShow protips.
		 *
		 * @private
		 */
		_initAutoShow: function(){
			this.data.autoShow && this.show();
		},

		/**
		 * Generates the output HTML for the tooltip from the template.
		 * Also appends it to the proper place.
		 *
		 * @private
		 */
		_appendProtip: function(){

			// Generate HTML from template
			this.el.protip = nano(this.classInstance.settings.protipTemplate, {
				classes: this._getClassList(),
				widthType: this._getWidthType(),
				width: this._getWidth(),
				content: this.data.title,
				icon: this._getIconTemplate(),
				arrow: this.data.arrow ? C.TEMPLATE_ARROW : '',
				identifier: this.data.identifier
			});

			// Convert to jQuery object and append
			this.el.protip = $(this.el.protip);
			this.el.protipArrow = this.el.protip.find('.' + C.SELECTOR_PREFIX + C.SELECTOR_ARROW);
			this.el.target.append(this.el.protip);
		},

		/**
		 * Generate a space separated class list based on the settings.
		 *
		 * @returns {string} The final class list.
		 * @private
		 */
		_getClassList: function(){
			var classList = [];
			var skin      = this.data.skin;
			var size      = this.data.size;
			var scheme    = this.data.scheme;

			// Main container class
			classList.push(C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER);
			// Skin class
			classList.push(C.SELECTOR_SKIN_PREFIX + skin);
			// Size class
			classList.push(C.SELECTOR_SKIN_PREFIX + skin + C.SELECTOR_SIZE_PREFIX + size);
			// Scheme class
			classList.push(C.SELECTOR_SKIN_PREFIX + skin + C.SELECTOR_SCHEME_PREFIX + scheme);
			// Custom classes
			this.data.classes && classList.push(this.data.classes);
			// Mixin classes
			this.data.mixin && classList.push(this._parseMixins());

			return classList.join(' ');
		},


		_parseMixins: function(){
			var mixin = [];

			this.data.mixin && this.data.mixin.split(' ').forEach(function(val){
				val && mixin.push(C.SELECTOR_MIXIN_PREFIX + val);
			}, this);

			return mixin.join(' ');
		},

		/**
		 * Determines the type of width.
		 *
		 * @returns {C.ATTR_MAX_WIDTH || C.ATTR_WIDTH}
		 * @private
		 */
		_getWidthType: function(){
			return !isNaN(this.data.width) ? C.ATTR_MAX_WIDTH : C.ATTR_WIDTH;
		},

		/**
		 * Width getter
		 *
		 * @returns {Number}
		 * @private
		 */
		_getWidth: function(){
			return parseInt(this.data.width, 10);
		},

		/**
		 * Compiles the icon template.
		 *
		 * @returns {string}  HTML string
		 * @private
		 */
		_getIconTemplate: function(){
			return this.data.icon ?
				nano(this.classInstance.settings.iconTemplate, {
					icon: this.data.icon
				})
				: '';
		},

		/**
		 * Detects where to get the title from.
		 *
		 * @private
		 */
		_detectTitle: function(){
			if (this.data.title && (this.data.title.charAt(0) === '#' || this.data.title.charAt(0) === '.')) {
				this.data.titleSource = this.data.titleSource || this.data.title;
				this.data.title = $(this.data.title).html();
			}
			else if (this.data.title && this.data.title.charAt(0) === ':') {
				var which = this.data.title.substring(1);
				switch (which) {
					case C.PSEUDO_NEXT:
						this.data.title = this.el.source.next().html();
						break;
					case C.PSEUDO_PREV:
						this.data.title = this.el.source.prev().html();
						break;
					case C.PSEUDO_THIS:
						this.data.title = this.el.source.html();
						break;
					default: break;
				}
			}

			// Set to interactive if detects link
			if (this.data.title && this.data.title.indexOf('<a ')+1) {
				this.data.interactive = true;
			}
		},

		/**
		 * Set the target element where the protip should be appended to.
		 *
		 * @private
		 */
		_setTarget: function(){
			var target = this._getData(C.PROP_TARGET);

			// Target is itself
			if (target === true) {
				target = this.el.source;
			}

			// If has target container
			else if (target === C.SELECTOR_BODY && this.el.source.closest(C.SELECTOR_TARGET).length) {
				target = this.el.source.closest(C.SELECTOR_TARGET);
			}

			// Target is a selector
			else if (target) {
				target = $(target);
			}

			// No target, use body
			else {
				target = $(C.SELECTOR_BODY);
			}

			// We need proper position
			if (target.css('position') === 'static') {
				target.css({position: 'relative'});
			}

			this.el.target = target;
		},

		/**
		 * Data-* property getter. Attaches namespace.
		 *
		 * @param key       Data attribute key.
		 * @returns {*}
		 * @private
		 */
		_getData: function(key){
			return this.el.source.data(this._namespaced(key));
		},

		/**
		 * Returns the namespaced version of a data-* property.
		 *
		 * @param string {string}
		 * @returns {string}
		 * @private
		 */
		_namespaced: function(string){
			return this.classInstance.namespaced(string);
		},

		/**
		 * Mouseenter event handler.
		 *
		 * @private
		 */
		_onProtipMouseenter: function(){
			clearTimeout(this._task.delayOut);
		},

		/**
		 * Mouseleave event handler.
		 *
		 * @private
		 */
		_onProtipMouseleave: function(){
			(this.data.trigger === C.TRIGGER_HOVER) && this.hide();
		},

		/**
		 * Attaches event handlers.
		 *
		 * @private
		 */
		_bind: function(){
			if (this.data.interactive) {
				this.el.protip
					.on(C.EVENT_MOUSEENTER, $.proxy(this._onProtipMouseenter, this))
					.on(C.EVENT_MOUSELEAVE, $.proxy(this._onProtipMouseleave, this));
			}

			if (this.data.observer) {
				this._observerInstance = new MutationObserver(function() {
					this.classInstance.reloadItemInstance(this.el.source);
				}.bind(this));

				this._observerInstance.observe(this.el.source.get(0), {
					attributes: true,
					childList: false,
					characterData: false,
					subtree: false
				});
			}
		},

		/**
		 * Removes event handlers.
		 *
		 * @private
		 */
		_unbind: function(){
			if (this.data.interactive) {
				this.el.protip
					.off(C.EVENT_MOUSEENTER, $.proxy(this._onProtipMouseenter, this))
					.off(C.EVENT_MOUSELEAVE, $.proxy(this._onProtipMouseleave, this));
			}

			if (this.data.observer) {
				this._observerInstance.disconnect();
			}
		}
	});

	/* Nano Templates - https://github.com/trix/nano */
	function nano(template, data) {
		return template.replace(/\{([\w\.]*)}/g, function(str, key) {
			var keys = key.split("."), v = data[keys.shift()];
			for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
			return (typeof v !== "undefined" && v !== null) ? v : "";
		});
	}

	return ProtipItemClass;
}));
