/**
 * Main Class of the tooltip plugin.
 * Initalizes and handles the the Item Instances.
 */

import Defaults from 'Defaults'
import * as C from 'Constants'
import Util from 'Util'
import Item from 'Item'

// Lower the interval time, we don't need that much accuracy.
try {
	window.MutationObserver._period = 100
} catch(e) {
	console.warn("Protip: MutationObserver is not supported! Please load the Polyfill if you need it.")
	// "Polyfill" for MutationObserver so Protip won't break if the real polyfill not included
	window.MutationObserver = window.MutationObserver || function(){this.disconnect=this.observe=function(){}}
}

export default class {
	/**
	 * @memberOf ProtipClass
	 * @param settings [Object] Overridable configuration options
	 * @returns {ProtipClass}
	 * @private
	 */
	constructor(settings) {

		/**
		 * Default configuration options ovverriden by customs.
		 *
		 * @type Object
		 * @private
		 */
		this.settings = Util.extend(Defaults, settings)

		/**
		 * Object storing the Item Class Instances
		 *
		 * @type {Object.<Number>.<ProtipItemClass>}
		 * @private
		 */
		this._itemInstances = {}

		/**
		 * Object storing the MutationObserver instance
		 *
		 * @type MutationObserver
		 * @private
		 */
		this._observerInstance = undefined

		/**
		 * Array storing the the Item Instances which were visible
		 * before window resize.
		 *
		 * @type {Array.<ProtipItemInstance>}
		 * @private
		 */
		this._visibleBeforeResize = []

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
		}

		// Do some initial things
		this._fetchElements()
		this._bind()
	}

	/**
	 * Method to destroy a class instance.
	 * Calls each item classes destroy method.
	 * Does unbind.
	 * Makes some local references empty.
	 */
	destroy() {
		this._unbind()

		Object.keys(this._itemInstances).forEach((key) => {
			this.destroyItemInstance(key)
		})

		this._itemInstances = undefined
		this.settings       = undefined
		window.Protip       = undefined
	}

	/**
	 * Deletes the locally stored instance
	 * and calls the item's destroy method.
	 *
	 * @param key {string} Item instance identifier.
	 */
	destroyItemInstance(key) {
		this._itemInstances[key].destroy()
	}

	/**
	 * Called after item destory has been done.
	 *
	 * @param key
	 */
	onItemDestroyed(key) {
		delete this._itemInstances[key]
	}

	/**
	 * Creates a ProtipItemClass instance
	 * and stores locally the instance.
	 *
	 * @param el {Element} Source element which has the tooltip.
	 * @param override {Object} data-pt-* overrides
	 * @returns {ProtipItemClass}
	 */
	createItemInstance(el, override) {
		let id = this._generateId()
		this._itemInstances[id] = new Item(id, el, this, override)
		// TODO: replace data
		el.protip.set(C.PROP_IDENTIFIER, id)
		return this._itemInstances[id]
	}

	/**
	 * Fully reloads an ItemClass instance.
	 * Destroy + Create
	 *
	 * @param el {Element} Element we reload on.
	 */
	reloadItemInstance(el) {
		let key = el.protip.get(C.PROP_IDENTIFIER)
		this.destroyItemInstance(key)
		this.createItemInstance(el)
	}

	/**
	 * Getter for retriving an ItemClass instance based on the passwed element.
	 * In case this element doesn't have ItemClass yet this method will also create a new one.
	 *
	 * @param el       {Element} The element we're searching it's instance for.
	 * @param override [Object]  Settings overridables
	 * @returns {Item}
	 */
	getItemInstance (el, override){
		return el.protip.get(C.PROP_INITED)
				? this._itemInstances[el.protip.get(C.PROP_IDENTIFIER)]
				: this.createItemInstance(el, override)
	}

	/**
	 * Fetches DOM elements with the specified protip selector
	 * and creates an ItemClass instance for them.
	 *
	 * @private
	 */
	_fetchElements() {
		// Prevent early fetches
		setTimeout(() => {
			let elements = document.querySelectorAll(this.settings.selector)
			Array.prototype.forEach.call(elements, (el) => this.getItemInstance(el))
		});
	}

	/**
	 * Generates a unique ID to be used as identfier.
	 *
	 * @returns {string}
	 * @private
	 */
	_generateId() {
		return new Date().valueOf() + Math.floor(Math.random() * 10000).toString();
	}

	/**
	 * Method to hide all protips.
	 * @param force          [boolean] Force hide?
	 * @param preventTrigger [boolean] Prevent hide event from triggering?
	 * @private
	 */
	_hideAll(force, preventTrigger) {
		Object.keys(this._itemInstances).forEach((key) => {
			let item = this._itemInstances[key]
			item.isVisible()
			&& this._visibleBeforeResize.push(item)
			&& item.hide(force, preventTrigger)
		})
	}

	/**
	 * Method to show all protips.
	 * @param force          [boolean] Force show?
	 * @param preventTrigger [boolean] Prevent show event from triggering?
	 * @private
	 */
	_showAll(force, preventTrigger) {
		// TODO Change to chack last visible time
		this._visibleBeforeResize.forEach(function(item){
			item.show(force, preventTrigger)
		})
	}

	/**
	 * Common event handler to every action.
	 *
	 * @param ev {Event} Event object.
	 * @private
	 */
	_onAction(ev) {
		for (let target = ev.target; target && target !== document.body; target = target.parentNode) {
			if (target.matches(this.settings.selector)) {
				let el = target
				let item = this.getItemInstance(el)

				ev.type === C.EVENT_CLICK
				&& el.protip.get(C.PROP_TRIGGER) === C.TRIGGER_CLICK
				&& ev.preventDefault()

				item.actionHandler(ev.type)
			}
		}
	}

	/**
	 * OnResize event callback handler.
	 *
	 * @private
	 */
	_onResize() {
		!this._task.resize && this._hideAll(true, true)
		this._task.resize && clearTimeout(this._task.resize)
		this._task.resize = setTimeout(() => {
			this._showAll(true, true)
			this._task.resize = undefined
			this._visibleBeforeResize = []
		}, this.settings.delayResize);
	}

	/**
	 * OnBodyClick event callback handler.
	 *
	 * @param ev {Event} Event object.
	 * @private
	 */
	_onBodyClick(ev) {
		let el                = ev.target;
		let container         = el.closest('.' + C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER) || false
		let source            = el.closest(C.DEFAULT_SELECTOR)
		let containerInstance = container.protip.get(C.PROP_INITED) ? this.getItemInstance(container) : false

		if (!containerInstance || containerInstance && container.protip.get(C.PROP_TRIGGER) !== C.TRIGGER_CLICK) {
			Object.keys(this._itemInstances).forEach((key) => {
				let item = this._itemInstances[key]
				item.isVisible()
				&& item.el.protip.get(C.PROP_TRIGGER) === C.TRIGGER_CLICK
				&& (!container || item.el.protip !== container)
				&& (!source || item.el.source !== source)
				&& item.hide()
			})
		}
	}

	/**
	 *  Click event callback handler for closing elements.
	 *
	 * @param ev {Event} Event object.
	 * @private
	 */
	_onCloseClick(ev) {
		for (let target = ev.target; target && target !== document.body; target = target.parentNode) {
			if (target.matches(C.SELECTOR_CLOSE)) {
				let identifier = target.closest('.' + C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER).protip.get(C.PROP_IDENTIFIER)
				this._itemInstances[identifier] && this._itemInstances[identifier].hide()
			}
		}
	}

	/**
	 * Handles add/removed nodes.
	 *
	 * @param mutations {<Array>MutationRecord}
	 * @private
	 */
	_mutationObserverCallback(mutations) {
		mutations.forEach((mutation) => {
			// Nodes added
			for (let i = 0; i < mutation.addedNodes.length; i++) {
				let node = mutation.addedNodes[i]
				if (!node.classList.contains(C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER)) {
					Array.prototype.forEach.call(node.parentNode.querySelectorAll(this.settings.selector), (el) => {
						if (el.protip.get(C.PROP_INITED)) {
							return
						}
						this.getItemInstance(el) // Init pls
						if (el.protip.get(C.PROP_TRIGGER) === C.TRIGGER_STICKY) {
							el.protip.show()
						}
					})
				}
			}
			// Nodes removed
			for (let i = 0; i < mutation.removedNodes.length; i++) {
				let node = mutation.removedNodes[i]
				Array.prototype.forEach.call(node.querySelectorAll(this.settings.selector), (el) => el.protip.destroy())
				node.classList.contains(this.settings.selector.replace('.', ''))
				&& node.protip.destroy
			}
		})
	}

	/**
	 * Binds up all events.
	 *
	 * @private
	 */
	_bind() {
		document
			.addEventListener(C.EVENT_CLICK, this._onBodyClick.bind(this))
			.addEventListener(C.EVENT_MOUSEOVER, this._onAction.bind(this))
			.addEventListener(C.EVENT_MOUSEOUT, this._onAction.bind(this))
			.addEventListener(C.EVENT_CLICK, this._onAction.bind(this))
			.addEventListener(C.EVENT_CLICK, this._onCloseClick.bind(this))

		window.addEventListener(C.EVENT_RESIZE, this._onResize.bind(this))


		if (this.settings.observer) {
			this._observerInstance = new MutationObserver(this._mutationObserverCallback.bind(this))

			this._observerInstance.observe(document.body, {
				childList: true,
				attributes: false,
				characterData: false,
				subtree: true
			})
		}
	}

	/**
	 * Unbinds all events.
	 *
	 * @private
	 */
	_unbind() {
		document
			.removeEventListener(C.EVENT_CLICK, this._onBodyClick.bind(this))
			.removeEventListener(C.EVENT_MOUSEOVER, this._onAction.bind(this))
			.removeEventListener(C.EVENT_MOUSEOUT, this._onAction.bind(this))
			.removeEventListener(C.EVENT_CLICK, this._onAction.bind(this))
			.removeEventListener(C.EVENT_CLICK, this._onCloseClick.bind(this))

		window.removeEventListener(C.EVENT_RESIZE, this._onResize.bind(this))

		if (this.settings.observer) {
			this._observerInstance.disconnect()
		}
	}
}
