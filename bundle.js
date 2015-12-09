(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./src/Plugin');
},{"./src/Plugin":8}],2:[function(require,module,exports){
(function (global){
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
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null)
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
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
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
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
		 * Called after item destory has been done.
		 *
		 * @param key
		 */
		onItemDestoryed: function(key){
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

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Constants":4,"./Item":7}],4:[function(require,module,exports){
/**
 * Just contants
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.ProtipConstants = factory();
	}
}(this, function () {

	"use strict";

	var ProtipConstants = {
		PLACEMENT_CENTER: 'center',
		PLACEMENT_INSIDE: 'inside',
		PLACEMENT_OUTSIDE: 'outside',
		PLACEMENT_BORDER: 'border',

		POSITION_TOP_LEFT: 'top-left',
		POSITION_TOP: 'top',
		POSITION_TOP_RIGHT: 'top-right',
		POSITION_RIGHT_TOP: 'right-top',
		POSITION_RIGHT: 'right',
		POSITION_RIGHT_BOTTOM: 'right-bottom',
		POSITION_BOTTOM_LEFT: 'bottom-left',
		POSITION_BOTTOM: 'bottom',
		POSITION_BOTTOM_RIGHT: 'bottom-right',
		POSITION_LEFT_TOP: 'left-top',
		POSITION_LEFT: 'left',
		POSITION_LEFT_BOTTOM: 'left-bottom',
		POSITION_CORNER_LEFT_TOP: 'top-left-corner',
		POSITION_CORNER_RIGHT_TOP: 'top-right-corner',
		POSITION_CORNER_LEFT_BOTTOM: 'bottom-left-corner',
		POSITION_CORNER_RIGHT_BOTTOM: 'bottom-right-corner',

		TRIGGER_CLICK: 'click',
		TRIGGER_CLICK2: 'click2',
		TRIGGER_HOVER: 'hover',
		TRIGGER_STICKY: 'sticky',

		PROP_TRIGGER: 'trigger',
		PROP_TITLE: 'title',
		PROP_STICKY: 'sticky',
		PROP_INITED: 'inited',
		PROP_DELAY_IN: 'delayIn',
		PROP_DELAY_OUT: 'delayOut',
		PROP_GRAVITY: 'gravity',
		PROP_OFFSET: 'offset',
		PROP_OFFSET_TOP: 'offsetTop',
		PROP_OFFSET_LEFT: 'offsetLeft',
		PROP_POSITION: 'position',
		PROP_CLASS: 'class',
		PROP_ARROW: 'arrow',
		PROP_WIDTH: 'width',
		PROP_IDENTIFIER: 'identifier',
		PROP_ICON: 'icon',
		PROP_AUTOSHOW: 'autoShow',
		PROP_TARGET: 'target',

		EVENT_MOUSEOVER: 'mouseover',
		EVENT_MOUSEOUT: 'mouseout',
		EVENT_MOUSEENTER: 'mouseenter',
		EVENT_MOUSELEAVE: 'mouseleave',
		EVENT_CLICK: 'click',
		EVENT_RESIZE: 'resize',
		EVENT_PROTIP_SHOW: 'protipshow',
		EVENT_PROTIP_HIDE: 'protiphide',

		DEFAULT_SELECTOR: '.protip',
		DEFAULT_NAMESPACE: 'pt',
		DEFAULT_DELAY_OUT: 100,

		SELECTOR_PREFIX: 'protip-',
		SELECTOR_BODY: 'body',
		SELECTOR_ARROW: 'arrow',
		SELECTOR_CONTAINER: 'container',
		SELECTOR_SHOW: 'protip-show',
		SELECTOR_CLOSE: '.protip-close',
        SELECTOR_SKIN_PREFIX: 'protip-skin-',
        SELECTOR_SIZE_PREFIX: '--size-',
        SELECTOR_SCHEME_PREFIX: '--scheme-',
        SELECTOR_ANIMATE: 'animated',
		SELECTOR_TARGET: '.protip-target',
		SELECTOR_MIXIN_PREFIX: 'protip-mixin--',
		SELECTOR_OPEN: 'protip-open',

		TEMPLATE_PROTIP: '<div class="{classes}" data-pt-identifier="{identifier}" style="{widthType}:{width}px">{arrow}{icon}<div class="protip-content">{content}</div></div>',
		TEMPLATE_ICON: '<i class="icon-{icon}"></i>',

		ATTR_WIDTH: 'width',
		ATTR_MAX_WIDTH: 'max-width',

        SKIN_DEFAULT: 'default',
        SIZE_DEFAULT: 'normal',
        SCHEME_DEFAULT: 'pro',

		PSEUDO_NEXT: 'next',
		PSEUDO_PREV: 'prev',
		PSEUDO_THIS: 'this'
	};

	ProtipConstants.TEMPLATE_ARROW = '<span class="' + ProtipConstants.SELECTOR_PREFIX + ProtipConstants.SELECTOR_ARROW + '"></span>';

	return ProtipConstants;
}));
},{}],5:[function(require,module,exports){
(function (global){
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
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Constants":4}],6:[function(require,module,exports){
(function (global){
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
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
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
				width:  this._item.el.protip.outerWidth(),
				height: this._item.el.protip.outerHeight(),
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Constants":4,"./GravityParser":5,"./PositionCalculator":9}],7:[function(require,module,exports){
(function (global){
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
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
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
			this.classInstance.onItemDestoryed(this.data.identifier);
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
				width:  this.el.protipArrow.outerWidth(),
				height: this.el.protipArrow.outerHeight()
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Constants":4,"./GravityTester":6,"./PositionCalculator":9}],8:[function(require,module,exports){
(function (global){
(function (root, factory) {

    'use strict';

	if (typeof define === 'function' && define.amd) {
		define([
			'jquery',
			'./Class',
			'./Class',
			'./Constants'
		], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Buffer":2,"./Class":3,"./Constants":4}],9:[function(require,module,exports){
(function (global){
/**
 * PositionCalculator Class
 * Calculates the proper top/left values for a tooltip.
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
			(typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null),
			require('./Constants')
		);
	} else {
		root.ProtipPositionCalculator = factory(
			root.jQuery,
			root.ProtipConstants
		);
	}
}(this, function ($, C) {

	'use strict';

	/**
	 * PositionCalculator Class.
	 *
	 * @param itemInstance {ProtipItemClass}             ProtipItem instance.
	 * @param position     {string}                      Position to calculate for.
	 * @param offset       {{top: number, left: number}} X/Y offset of the tooltip.
	 * @returns {*|Array|ProtipClass|ProtipItemClass}
	 * @constructor
	 */
	var PositionCalculator = function(itemInstance, position, offset){
		return this._Construct(itemInstance, position, offset);
	};

	// Define the ProtipCalculator members
	$.extend(true, PositionCalculator.prototype, {

		/**
		 * Constructor.
		 *
		 * @memberOf PositionCalculator
		 * @param itemInstance {ProtipItemClass}             ProtipItem instance.
		 * @param position     {string}                      Position to calculate for.
		 * @param offset       {{top: number, left: number}} X/Y offset of the tooltip.
		 * @returns {*}
		 * @private
		 */
		_Construct: function(itemInstance, position, offset){
			/**
			 * ProtipItem instance.
			 *
			 * @type {ProtipItemClass}
			 * @private
			 */
			this._itemInstance = itemInstance;

			/**
			 * Initial values of of the protip element.
			 *
			 * @type {object}
			 * @private
			 */
			this._protip       = this._getProto(this._itemInstance.el.protip);

			/**
			 * Initial values of of the source element.
			 *
			 * @type {object}
			 * @private
			 */
			this._source       = this._getProto(this._itemInstance.el.source);

			/**
			 * Initial values of of the target element.
			 *
			 * @type {object}
			 * @private
			 */
			this._target       = this._getProto(this._itemInstance.el.target);

			/**
			 * Position.
			 *
			 * @type {string}
			 * @private
			 */
			this._position     = position || this._itemInstance.data.position;

			/**
			 * Placement.
			 *
			 * @type {string}
			 * @private
			 */
			this._placement    = this._itemInstance.data.placement;

			/**
			 * Offset of the tooltip.
			 *
			 * @type {{top: number, left: number}}
			 * @private
			 */
			this._offset       = offset || {
				top: this._itemInstance.data.offsetTop,
				left: this._itemInstance.data.offsetLeft
			};

			return this._getPosition();
		},

		/**
		 * Fetches some initial values for an element.
		 * width, height, offset
		 *
		 * @param el {jQuery} Element we want to get the values for.
		 * @returns {object}
		 * @private
		 */
		_getProto: function(el){
			var proto = {
				el:     undefined,
				width:  undefined,
				height: undefined,
				offset: undefined
			};
			proto.el = el;
			proto.width = el.outerWidth();
			proto.height = el.outerHeight();
			proto.offset = el.offset();
			return proto;
		},

		/**
		 * Calculates the CSS position.
		 *
		 * @returns {{top: number, left: number}}
		 * @private
		 */
		_getPosition: function(){
            this._itemInstance.applyPosition(this._position);

			var position = {left: 0, top: 0};
			var arrowOffset = this._itemInstance.getArrowOffset();
			var globalOffset = this._itemInstance.classInstance.settings.offset;

			if (this._placement !== C.PLACEMENT_CENTER) {
				switch (this._position) {
					case C.POSITION_TOP:
						this._offset.top += (globalOffset + arrowOffset.height) * -1;
						position.left = ((this._source.offset.left + this._source.width / 2 - this._protip.width / 2) - this._target.offset.left) + this._offset.left;
						position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
						break;
					case C.POSITION_TOP_LEFT:
						this._offset.top += (globalOffset + arrowOffset.height) * -1;
						position.left = (this._source.offset.left) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
						break;
					case C.POSITION_TOP_RIGHT:
						this._offset.top += (globalOffset + arrowOffset.height) * -1;
						position.left = (this._source.offset.left + this._source.width - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.top += this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.top += this._protip.height / 2;
						break;
					case C.POSITION_RIGHT:
						this._offset.left += (globalOffset + arrowOffset.width);
						position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height / 2 - this._protip.height / 2) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
						if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
						break;
					case C.POSITION_RIGHT_TOP:
						this._offset.left += (globalOffset + arrowOffset.width);
						position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
						if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
						break;
					case C.POSITION_RIGHT_BOTTOM:
						this._offset.left += (globalOffset + arrowOffset.width);
						position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
						if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
						break;
					case C.POSITION_BOTTOM:
						this._offset.top += (globalOffset + arrowOffset.height);
						position.left = (this._source.offset.left + this._source.width / 2 - this._protip.width / 2) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
						break;
					case C.POSITION_BOTTOM_LEFT:
						this._offset.top += (globalOffset + arrowOffset.height);
						position.left = (this._source.offset.left) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
						break;
					case C.POSITION_BOTTOM_RIGHT:
						this._offset.top += (globalOffset + arrowOffset.height);
						position.left = (this._source.offset.left + this._source.width - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.top -= this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.top -= this._protip.height / 2;
						break;
					case C.POSITION_LEFT:
						this._offset.left += (globalOffset + arrowOffset.width) * -1;
						position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height / 2 - this._protip.height / 2) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
						if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
						break;
					case C.POSITION_LEFT_TOP:
						this._offset.left += (globalOffset + arrowOffset.width) * -1;
						position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
						if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
						break;
					case C.POSITION_LEFT_BOTTOM:
						this._offset.left += (globalOffset + arrowOffset.width) * -1;
						position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
						if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
						break;
					case C.POSITION_CORNER_LEFT_TOP:
						this._offset.top += (globalOffset + arrowOffset.height) * -1;
						position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
						if (this._placement === C.PLACEMENT_INSIDE) position.top  += this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
						if (this._placement === C.PLACEMENT_BORDER) position.top  += this._protip.height / 2;
						break;
					case C.POSITION_CORNER_LEFT_BOTTOM:
						this._offset.top += (globalOffset + arrowOffset.height);
						position.left = (this._source.offset.left - this._protip.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left += this._protip.width;
						if (this._placement === C.PLACEMENT_INSIDE) position.top  -= this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.left += this._protip.width / 2;
						if (this._placement === C.PLACEMENT_BORDER) position.top  -= this._protip.height / 2;
						break;
					case C.POSITION_CORNER_RIGHT_BOTTOM:
						this._offset.top += (globalOffset + arrowOffset.height);
						position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top + this._source.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
						if (this._placement === C.PLACEMENT_INSIDE) position.top  -= this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
						if (this._placement === C.PLACEMENT_BORDER) position.top  -= this._protip.height / 2;
						break;
					case C.POSITION_CORNER_RIGHT_TOP:
						this._offset.top += (globalOffset + arrowOffset.height) * -1;
						position.left = (this._source.offset.left + this._source.width) - this._target.offset.left + this._offset.left;
						position.top = (this._source.offset.top - this._protip.height) - this._target.offset.top + this._offset.top;
						if (this._placement === C.PLACEMENT_INSIDE) position.left -= this._protip.width;
						if (this._placement === C.PLACEMENT_INSIDE) position.top  += this._protip.height;
						if (this._placement === C.PLACEMENT_BORDER) position.left -= this._protip.width / 2;
						if (this._placement === C.PLACEMENT_BORDER) position.top  += this._protip.height / 2;
						break;
					default:
						break;
				}
			}

			// Center Placement
			else {
				position.left = (this._source.offset.left + this._source.width / 2 - this._protip.width / 2) - this._target.offset.left + this._offset.left;
				position.top = (this._source.offset.top + this._source.height / 2 - this._protip.height / 2) - this._target.offset.top + this._offset.top;
			}

			position.left = position.left + 'px';
			position.top  = position.top + 'px';

			return position;
		}
	});

	return PositionCalculator;

}));
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Constants":4}]},{},[1])