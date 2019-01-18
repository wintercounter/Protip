/**
 * Main Class of the tooltip plugin.
 * Initalizes and handles the the Item Instances.
 */

(function (root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Constants',
			'./Item'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			require('jquery'),
			require('./Constants'),
			require('./Item')
		);
	} else {
		root.ProtipClass = factory(
			root.jQuery,
			root.ProtipConstants,
			root.ProtipItemClass
		);
	}
}(this, function ($, C, ProtipItemClass) {

	'use strict';

	// Lower the interval time, we don't need that much accuracy.
	try {
		window.MutationObserver._period = 100;
	} catch(e) {
		console.warn("Protip: MutationObserver polyfill haven't been loaded!");
		// "Polyfill" for MutationObserver so Protip won't break if the real polyfill not included
		window.MutationObserver = window.MutationObserver || function(){this.disconnect=this.observe=function(){}};
	}

	/**
	 * The Protip main class
	 *
	 * @param settings [Object] Overridable configuration options
	 * @returns {ProtipClass}
	 * @constructor
	 */
	var ProtipClass = function(settings){
		return this._Construct(settings);
	};

// Define the ProtipClass members
	$.extend(true, ProtipClass.prototype, {

		/**
		 * Default configuration options
		 *
		 * @memberOf ProtipClass
		 * @type Object
		 * @private
		 */
		_defaults: {
			/** @type String    Selector for protips */
			selector:           C.DEFAULT_SELECTOR,
			/** @type String    Namespace of the data attributes */
			namespace:          C.DEFAULT_NAMESPACE,
			/** @type String    Template of protip element */
			protipTemplate:     C.TEMPLATE_PROTIP,
			/** @type String    Template of the arrow element */
			arrowTemplate:      C.TEMPLATE_ARROW,
			/** @type String    Template of protip icon */
			iconTemplate:       C.TEMPLATE_ICON,
			/** @type Boolean   Should we observe whole document for assertions and removals */
			observer:           true,
			/** @type Number    Global offset of all tooltips. */
			offset:             0,
			/** @type Boolean   Forces the tooltip to have min-width by it's width calculation. */
			forceMinWidth:      true,
			/** @type Number    Default time for OnResize event Timeout. */
			delayResize:        100,
			/** @type Object    Default data-pt-* values for a tooltip */
			defaults: {
				trigger:     C.TRIGGER_HOVER,
				title:       null,
				inited:      false,
				delayIn:     0,
				delayOut:    0,
				interactive: false,
				gravity:     true,
				offsetTop:   0,
				offsetLeft:  0,
				position:    C.POSITION_RIGHT,
				placement: 	 C.PLACEMENT_OUTSIDE,
				classes:     null,
				arrow:       true,
				width:       300,
				identifier:  false,
				icon:        false,
				observer:    false,
				target:      C.SELECTOR_BODY,
				skin:        C.SKIN_DEFAULT,
				size:        C.SIZE_DEFAULT,
				scheme:      C.SCHEME_DEFAULT,
				animate:     false,
				autoHide:    false,
				autoShow:    false,
				mixin:       null
			}
		},

		/**
		 * @memberOf ProtipClass
		 * @param settings
		 * @returns {ProtipClass}
		 * @private
		 */
		_Construct: function(settings){
			/**
			 * Overridden configuration options (extends defaults)
			 *
			 * @type Object
			 */
			this.settings = $.extend(true, {}, this._defaults, settings);

			/**
			 * Object storing the Item Class Instances
			 *
			 * @type {Object.<Number>.<ProtipItemClass>}
			 * @private
			 */
			this._itemInstances = {};

			/**
			 * Object storing the MutationObserver instance
			 *
			 * @type MutationObserver
			 * @private
			 */
			this._observerInstance = undefined;

			/**
			 * Array storing the the Item Instances which were visible
			 * before window resize.
			 *
			 * @type {Array.<ProtipItemInstance>}
			 * @private
			 */
			this._visibleBeforeResize = [];

			/**
			 * Object storing timeout tasks.
			 *
			 * @type {Object}
			 * @private
			 */
			this._task = {
				delayIn:  undefined,
				delayOut: undefined,
				resize:   undefined
			};

			// Do some initial things
			this._fetchElements();
			this._bind();

			return this;
		},

		/**
		 * Method to destroy a class instance.
		 * Calls each item classes destroy method.
		 * Does unbind.
		 * Makes some local references empty.
		 */
		destroy: function(){
			this._unbind();

			$.each(this._itemInstances, $.proxy(function(key){
				this.destroyItemInstance(key);
			}, this));

			this._itemInstances    = undefined;
			this.settings          = undefined;
			$._protipClassInstance = undefined;
		},

		/**
		 * Return a namespaced version of a data property's name.
		 *
		 * @param string {string} The input string. eq: action
		 * @returns {string} eg: ptAction
		 */
		namespaced: function(string){
			return this.settings.namespace + string.charAt(0).toUpperCase() + string.slice(1);
		},

		/**
		 * Deletes the locally stored instance
		 * and calls the item's destroy method.
		 *
		 * @param key {string} Item instance identifier.
		 */
		destroyItemInstance: function(key){
			this._itemInstances[key].destroy();
		},

		/**
		 * Called after item destroy has been done.
		 *
		 * @param key
		 */
		onItemDestroyed: function(key){
			delete this._itemInstances[key];
		},

		/**
		 * Creates a ProtipItemClass instance
		 * and stores locally the instance.
		 *
		 * @param el {jQuery} Source element which has the tooltip.
		 * @param override {object} data-pt-* overrides
		 * @returns {ProtipItemClass}
		 */
		createItemInstance: function(el, override){
			var id = this._generateId();
			this._itemInstances[id] = new ProtipItemClass(id, el, this, override);
			el.data(this.namespaced(C.PROP_IDENTIFIER), id);
			return this._itemInstances[id];
		},

		/**
		 * Fully reloads an ItemClass instance.
		 * Destroy + Create
		 *
		 * @param el {jQuery} Element we reload on.
		 */
		reloadItemInstance: function(el){
			var key = el.data(this.namespaced(C.PROP_IDENTIFIER));
			this.destroyItemInstance(key);
			this.createItemInstance(el);
		},

		/**
		 * Getter for retriving an ItemClass instance based on the passwed element.
		 * In case this element doesn't have ItemClass yet this method will also create a new one.
		 *
		 * @param el       {jQuery} The element we're searching it's instance for.
		 * @param override [object] data-pt-* overridables
		 * @returns {ProtipItemClass}
		 */
		getItemInstance: function(el, override){
			var identifier = el.data(this.namespaced(C.PROP_IDENTIFIER));
			return this._isInited(el) ? this._itemInstances[identifier] : this.createItemInstance(el, override);
		},

		/**
		 * Fetches DOM elements with the specified protip selector
		 * and creates an ItemClass instance for them.
		 *
		 * @private
		 */
		_fetchElements: function(){
			// Prevent early fetches
			setTimeout(function(){
				$(this.settings.selector).each($.proxy(function(index, el){
					this.getItemInstance($(el));
				}, this));
			}.bind(this));
		},

		/**
		 * Generates a unique ID to be used as identfier.
		 *
		 * @returns {string}
		 * @private
		 */
		_generateId: function(){
			return new Date().valueOf() + Math.floor(Math.random() * 10000).toString();
		},

		/**
		 * Tells us if the passed element already has an ItemClass instance or not.
		 *
		 * @param el
		 * @returns {boolean}
		 * @private
		 */
		_isInited: function(el){
			return !!el.data(this.namespaced(C.PROP_INITED));
		},

		/**
		 * Method to hide all protips.
		 * @param force          [boolean] Force hide?
		 * @param preventTrigger [boolean] Prevent hide event from triggering?
		 * @private
		 */
		_hideAll: function(force, preventTrigger){
			$.each(this._itemInstances, $.proxy(function(index, item){
				item.isVisible() && this._visibleBeforeResize.push(item) && item.hide(force, preventTrigger);
			}, this));
		},

		/**
		 * Method to show all protips.
		 * @param force          [boolean] Force show?
		 * @param preventTrigger [boolean] Prevent show event from triggering?
		 * @private
		 */
		_showAll: function(force, preventTrigger){
			this._visibleBeforeResize.forEach(function(item){
				item.show(force, preventTrigger);
			});
		},

		/**
		 * Common event handler to every action.
		 *
		 * @param ev {Event} Event object.
		 * @private
		 */
		_onAction: function(ev){
			var el = $(ev.currentTarget);
			var item = this.getItemInstance(el);

			ev.type === C.EVENT_CLICK && item.data.trigger === C.TRIGGER_CLICK && ev.preventDefault();

			item.actionHandler(ev.type);
		},

		/**
		 * OnResize event callback handler.
		 *
		 * @private
		 */
		_onResize: function(){
			!this._task.resize && this._hideAll(true, true);
			this._task.resize && clearTimeout(this._task.resize);
			this._task.resize = setTimeout(function () {
				this._showAll(true, true);
				this._task.resize = undefined;
				this._visibleBeforeResize = [];
			}.bind(this), this.settings.delayResize);
		},

		/**
		 * OnBodyClick event callback handler.
		 *
		 * @param ev {Event} Event object.
		 * @private
		 */
		_onBodyClick: function(ev){
			var el                = $(ev.target);
			var container         = el.closest('.' + C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER) || false;
			var source            = el.closest(C.DEFAULT_SELECTOR);
			var sourceInstance    = this._isInited(source) ? this.getItemInstance(source) : false;
			var containerInstance = this._isInited(container) ? this.getItemInstance(container) : false;

			if (!containerInstance || containerInstance && containerInstance.data.trigger !== C.TRIGGER_CLICK) {
				$.each(this._itemInstances, function (index, item) {
					item.isVisible()
					&& item.data.trigger === C.TRIGGER_CLICK
					&& (!container || item.el.protip.get(0) !== container.get(0))
					&& (!source || item.el.source.get(0) !== source.get(0))
					&& item.hide();
				});
			}
		},

		/**
		 *  Click event callback handler for closing elements.
		 *
		 * @param ev {Event} Event object.
		 * @private
		 */
		_onCloseClick: function(ev){
			var identifier = $(ev.currentTarget).parents('.' + C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER).data(this.namespaced(C.PROP_IDENTIFIER));
			this._itemInstances[identifier] && this._itemInstances[identifier].hide();
		},

		/**
		 * Handles add/removed nodes.
		 *
		 * @param mutations {<Array>MutationRecord}
		 * @private
		 */
		_mutationObserverCallback: function(mutations) {
			mutations.forEach(function(mutation) {
				var node;
				for (var i = 0; i < mutation.addedNodes.length; i++) {
					node = $(mutation.addedNodes[i]);
					if (!node.hasClass(C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER)) {
						var els = node.parent().find(this.settings.selector);
						els.each(function (index, el) {
							el = $(el);
							if (this._isInited(el)) {
								return;
							}
							var instance = this.getItemInstance(el);
							if (instance.data.trigger === C.TRIGGER_STICKY) {
								this.getItemInstance(el).show();
							}
						}.bind(this));
					}
				}

				for (var i = 0; i < mutation.removedNodes.length; i++) {
					var el = $(mutation.removedNodes[i]);
					el.find(this.settings.selector).each(function(index, item){
						this.getItemInstance($(item)).destroy();
					}.bind(this));

					if (el.hasClass(this.settings.selector.replace('.', ''))) {
						this.getItemInstance(el).destroy();
					}
				}
			}.bind(this));
		},

		/**
		 * Binds up all events.
		 *
		 * @private
		 */
		_bind: function(){
			var body = $(C.SELECTOR_BODY);

			body.on(C.EVENT_CLICK, $.proxy(this._onBodyClick, this))
				.on(C.EVENT_MOUSEOVER, this.settings.selector, $.proxy(this._onAction, this))
				.on(C.EVENT_MOUSEOUT, this.settings.selector, $.proxy(this._onAction, this))
				.on(C.EVENT_CLICK, this.settings.selector, $.proxy(this._onAction, this))
				.on(C.EVENT_CLICK, C.SELECTOR_CLOSE, $.proxy(this._onCloseClick, this));

			$(window).on(C.EVENT_RESIZE, $.proxy(this._onResize, this));


			if (this.settings.observer) {
				this._observerInstance = new MutationObserver(this._mutationObserverCallback.bind(this));

				this._observerInstance.observe(body.get(0), {
					attributes: false,
					childList: true,
					characterData: false,
					subtree: true
				});
			}
		},

		/**
		 * Unbinds all events.
		 *
		 * @private
		 */
		_unbind: function(){
			$(C.SELECTOR_BODY)
				.off(C.EVENT_CLICK, $.proxy(this._onBodyClick, this))
				.off(C.EVENT_MOUSEOVER, this.settings.selector, $.proxy(this._onAction, this))
				.off(C.EVENT_MOUSEOUT, this.settings.selector, $.proxy(this._onAction, this))
				.off(C.EVENT_CLICK, this.settings.selector, $.proxy(this._onAction, this))
				.off(C.EVENT_CLICK, C.SELECTOR_CLOSE, $.proxy(this._onCloseClick, this));

			$(window).off(C.EVENT_RESIZE, $.proxy(this._onResize, this));

			if (this.settings.observer) {
				this._observerInstance.disconnect();
			}
		}
	});

	return ProtipClass;

}));
