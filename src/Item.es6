/**
 * The class represents on tooltip's instance.
 */

import * as C from 'Constants'
import GravityTester from 'GravityTester'
import PositionCalculator from 'PositionCalculator'
import Observer from 'Observer'
import Util from 'Util'

export default class extends Observer {

	/* jshint ignore:start */
	Override = undefined
	/** @type {object}    Object storing some DOM elements */
	El = {}
	/** @type {object}    All the data-* properties gathered from the source element. */
	Data = {}
	/** @type {boolean}   Tells us of our protip is currently visible or not. */
	IsVisible = false
	/** @type {object}    Object storing setTimeout tasks */
	Task = {
		delayIn: undefined,
		delayOut: undefined
	}
	Observer = undefined
	Global = undefined
	/* jshint ignore:end */

	/**
	 * Constructor
	 * @param id            {String}      Identifier of the protip.
	 * @param el            {Element}     Source element we are creating the instance for.
	 * @param global        {Object}      Global settings from the class instance.
	 * @param override      [Object]      Override data-pt-* values.
	 * @returns {Item}
	 */
	constructor(id, el, global, override) {

		// Attaches observer event handlers
		super.constructor(el)

		this.Global = global

		/** @type {object} Override pt-* values. */
		this.Override = override || {}
		this.Override.identifier = id

		/** @type {jQuery}    The source element. */
		this.$source = el

		// Prepare class
		this._setData()
		this._prepareInternals()
		this._appendProtip()
		this._initSticky()
		this._initAutoShow()
		this._bind()

		// Add protip class if it didn't have.
		this.$source.classList.add(this.Global.selector.replace('.', ''))
		// Tell the source that we are ready to go
		this.set(C.PROP_INITED, true)
	}


	get(key) {
		return this.$source.protip.get(key)
	}

	/**
	 * Data value setter. This is called through the element API
	 * @param key
	 * @param value
	 */
	set(key, value) {
		return this.$source.protip.set(key, value)
	}

	get $source() {
		return this.El.source
	}

	set $source(el) {
		this.El.source = el
	}

	get $protip() {
		return this.El.source
	}

	set $protip(el) {
		this.El.protip = el
	}

	get $arrow() {
		return this.El.arrow
	}

	set $arrow(el) {
		this.El.arrow = el
	}

	get $target() {
		return this.El.target
	}

	set $target(el) {
		this.El.target = el
	}

	get isVisible() {
		return this.IsVisible
	}

	set isVisible(v) {
		this.IsVisible = v
	}

	/**
	 * Common handler for every mouse event.
	 *
	 * @param eventType {string} Type of the event.
	 */
	actionHandler(eventType) {
		let trigger = this.get(C.PROP_TRIGGER)

		if (this.get(C.PROP_TRIGGER) === C.TRIGGER_STICKY) { /* jshint ignore:line */
			// No handler needed for sticky
		}
		// Handling clicky protips
		else if (
			eventType === C.EVENT_CLICK
			&& (trigger === C.TRIGGER_CLICK || trigger === C.TRIGGER_CLICK2)
		) {
			this.toggle()
		}
		// Handling mouseover protips
		else if (
			trigger !== C.TRIGGER_CLICK
			&& trigger !== C.TRIGGER_CLICK2
		) {
			switch(eventType) {
				case C.EVENT_MOUSEOUT:
					this.hide()
					break
				case C.EVENT_MOUSEOVER:
					this.show()
					break
				default: break
			}
		}
	}

	/**
	 * Destroys the current intance.
	 * Reset data, hide, unbind, remove.
	 */
	destroy() {
		this.hide(true)
		this._unbind()
		this.fire(C.ITEM_EVENT_DESTROY, this.$source.get(C.PROP_IDENTIFIER))
		this.$protip.parentNode.removeChild(this.$protip)
		this.set(C.PROP_INITED, false)
			.set(C.PROP_IDENTIFIER, false)
		Object.keys(this.Task).forEach((k, task) => clearTimeout(task))
	}

	/**
	 * Toggles the tooltip visibility state.
	 */
	toggle() {
		this.isVisible && this.hide()
		!this.isVisible && this.show()
	}

	/**
	 * Make a tooltip visible.
	 *
	 * @param force          [boolean]  If 'true' there will be no timeouts.
	 * @param preventTrigger [boolean]  If 'true' protipShow won't be triggered.
	 */
	show(force, preventTrigger) {

		// No title? Why tooltip?
		if (!this.get(C.PROP_TITLE)) return

		// Clear timeouts
		clearTimeout(this.Task.delayOut)
		clearTimeout(this.Task.delayIn)
		clearTimeout(this.Task.autoHide)

		// Set new timeout task if needed
		let delayIn = this.get(C.PROP_DELAY_IN)
		if (!force && delayIn) {
			this.Task.delayIn = setTimeout(() => this.show(true), delayIn)
			// Return, our timeout will call again later...
			return
		}

		// Auto hide
		let autoHide = this.get(C.PROP_AUTOHIDE)
		if (autoHide !== false) {
			this.Task.autoHide = setTimeout(() => this.hide(true), this.data.autoHide)
		}

		let style;

		// Handle gravity/non-gravity based position calculations
		if (this.get(C.PROP_GRAVITY)) {
			style = new GravityTester(this)
			delete style.position
		}
		else {
			style = new PositionCalculator(this)
		}

		// Fire show event and add open class
		this.$source.classList.add(C.SELECTOR_OPEN)
		!preventTrigger && this.fire(C.EVENT_PROTIP_SHOW, this)

		// Apply styles, classes
		Util.extend(this.$protip.style, style)
		this.$protip.classList.add(C.SELECTOR_SHOW)

		// If we need animation
		let animate = this.get(C.PROP_ANIMATE)
		animate
		&& this.$protip.classList.add(C.SELECTOR_ANIMATE)
		&& this.$protip.classList.add(animate)

		// Set visibility
		this.isVisible = true
	}

	/**
	 * Apply a position to the tooltip.
	 *
	 * @param position
	 */
	applyPosition (position) {
		this.$protip.setAttribute(C.DEFAULT_NAMESPACE + '-' + C.PROP_POSITION, position)
	}

	/**
	 * Make a tooltip invisible.
	 *
	 * @param force          [boolean]  If 'true' there will be no timeouts.
	 * @param preventTrigger [boolean]  If 'true' protipHide event won't be triggered.
	 */
	hide (force, preventTrigger) {

		clearTimeout(this.Task.delayOut);
		clearTimeout(this.Task.delayIn);
		clearTimeout(this.Task.autoHide);

		// Set new timeout task if needed
		let delayOut = this.get(C.PROP_DELAY_OUT)
		if (!force && delayOut) {
			this._task.delayOut = setTimeout(() => this.hide(true), delayOut)
			// Return, our timeout will call again later...
			return
		}

		// Fire show event and remove open class
		this.$source.classList.remove(C.SELECTOR_OPEN)
		!preventTrigger && this.fire(C.EVENT_PROTIP_HIDE, this)

		// Remove classes and set visibility
		this.$protip.classList.remove(C.SELECTOR_SHOW)
		this.$protip.classList.remove(C.SELECTOR_ANIMATE)
		this.$protip.classList.remove(this.get(C.PROP_ANIMATE))

		this._isVisible = false
	}

	/**
	 * Returns arrow offset (width/height)
	 *
	 * @returns {{width: number, height: number}}
	 */
	getArrowOffset() {
		return {
			width : this.$arrow.offsetWidth,
			height: this.$arrow.offsetHeight
		}
	}

	/**
	 * Fetches every data-* properties from the source element.
	 * It extends the defaults, then it applies back to the element.
	 *
	 * @private
	 */
	_setData() {
		// 1. Default settings
		let data = this.Global.settings.defaults
		// 2. Attribute settings
		this.$source.attributes.forEach((attr) => {
			(attr.indexOf(C.DEFAULT_NAMESPACE) === 0)
			&& (data[attr.replace(C.DEFAULT_NAMESPACE + '-')] = this.$source.getAttribute(attr))
		})
		// 3. Overrided settings
		data = Util.extend(data, this.Override)
		// 4. Set on element
		Object.keys(data).forEach(this.set, this)
	}

	/**
	 * A package function to call several setup procedures.
	 *
	 * @private
	 */
	_prepareInternals() {
		this._setTarget()
		this._detectTitle()
		this._checkInteractive()
	}

	/**
	 * Checks if the tooltip should be interactive and applies delayout according to it.
	 *
	 * @private
	 */
	_checkInteractive() {
		this.get(C.PROP_INTERACTIVE)
		&& this.set(C.PROP_DELAY_OUT, this.get(C.PROP_DELAY_OUT) || C.DEFAULT_DELAY_OUT)

	}

	/**
	 * Initializes sticky protips.
	 *
	 * @private
	 */
	_initSticky() {
		(this.get(C.PROP_TRIGGER) === C.TRIGGER_STICKY) && this.show()
	}

	/**
	 * Initializes autoShow protips.
	 *
	 * @private
	 */
	_initAutoShow() {
		this.get(C.PROP_AUTOSHOW) && this.show()
	}

	/**
	 * Generates the output HTML for the tooltip from the template.
	 * Also appends it to the proper place.
	 *
	 * @private
	 */
	_appendProtip() {

		// Generate HTML from template
		let html = Util.nano(this.Global.protipTemplate, {
			classes: this._getClassList(),
			widthType: this._getWidthType(),
			width: this._getWidth(),
			content: this.get(C.PROP_TITLE),
			icon: this._getIconTemplate(),
			arrow: this.get(C.PROP_ARROW) ? C.TEMPLATE_ARROW : '',
			identifier: this.get(C.PROP_IDENTIFIER)
		})

		this.$target.insertAdjacentHTML('beforeend', html)
		this.$protip = this.$target.querySelector('.' + C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER)
		this.$arrow = this.$protip.querySelector('.' + C.SELECTOR_PREFIX + C.SELECTOR_ARROW)
	}

	/**
	 * Generate a space separated class list based on the settings.
	 *
	 * @returns {string} The final class list.
	 * @private
	 */
	_getClassList() {
		let classList = []
		let skin      = this.get(C.PROP_SKIN)
		let size      = this.get(C.PROP_SIZE)
		let scheme    = this.get(C.PROP_SCHEME)

		// Main container class
		classList.push(C.SELECTOR_PREFIX + C.SELECTOR_CONTAINER)
		// Skin class
		classList.push(C.SELECTOR_SKIN_PREFIX + skin)
		// Size class
		classList.push(C.SELECTOR_SKIN_PREFIX + skin + C.SELECTOR_SIZE_PREFIX + size)
		// Scheme class
		classList.push(C.SELECTOR_SKIN_PREFIX + skin + C.SELECTOR_SCHEME_PREFIX + scheme)
		// Custom classes
		this.get(C.PROP_CLASS) && classList.push(this.data.classes)
		// Mixin classes
		this.get(C.PROP_MIXIN) && classList.push(this._parseMixins())

		return classList.join(' ')
	}


	_parseMixins() {
		let mixin = []
		let mixins = this.get(C.PROP_MIXIN)

		mixins && mixins.split(' ').forEach((val) => {
			val && mixin.push(C.SELECTOR_MIXIN_PREFIX + val);
		})

		return mixin.join(' ');
	}

	/**
	 * Determines the type of width.
	 *
	 * @returns {C.ATTR_MAX_WIDTH || C.ATTR_WIDTH}
	 * @private
	 */
	_getWidthType() {
		return !isNaN(this.get(C.PROP_WIDTH)) ? C.ATTR_MAX_WIDTH : C.ATTR_WIDTH;
	}

	/**
	 * Width getter
	 *
	 * @returns {Number}
	 * @private
	 */
	_getWidth() {
		return parseInt(this.get(C.PROP_WIDTH), 10);
	}

	/**
	 * Compiles the icon template.
	 *
	 * @returns {string}  HTML string
	 * @private
	 */
	_getIconTemplate() {
		let icon = this.get(C.PROP_ICON)
		return icon ? Util.nano(this.Global.iconTemplate, {
			icon: icon
		}) : ''
	}

	/**
	 * Detects where to get the title from.
	 *
	 * @private
	 */
	_detectTitle() {
		let title = this.get(C.PROP_TITLE)

		// Selector based
		if (title && (title.charAt(0) === '#' || title.charAt(0) === '.')) {
			title = document.querySelector(title)
		}
		// Pseudo based
		else if (title && title.charAt(0) === ':') {
			let which = title.substring(1)
			switch (which) {
				case C.PSEUDO_NEXT:
					title = this.$source.nextElementSibling.innerHTML
					break;
				case C.PSEUDO_PREV:
					title = this.$source.previousElementSibling.innerHTML
					break;
				case C.PSEUDO_THIS:
					title = this.$source.innerHTML
					break;
				default: break;
			}
		}

		// Save final title (maybe the original, haha)
		this.set(C.PROP_TITLE, title)

		// Set to interactive if detects link
		if (title && title.indexOf('<a ')+1) {
			this.set(C.PROP_INTERACTIVE, true)
		}
	}

	/**
	 * Set the target element where the protip should be appended to.
	 *
	 * @private
	 */
	_setTarget() {
		let target = this.get(C.PROP_TARGET);

		// Target is itself
		if (target === true) {
			target = this.$source
		}
		// If has target container
		else if (target === C.SELECTOR_BODY && this.$source.closest(C.SELECTOR_TARGET)) {
			target = this.$source.closest(C.SELECTOR_TARGET)
		}
		// Target is a selector
		else if (target) {
			target = document.querySelector(target)
		}
		// No target, use body
		else {
			target = document.body
		}

		// We need proper position
		if (target.style.position === 'static' && target !== document.body) {
			target.style.position = 'relative'
		}

		this.$target = target
	}

	/**
	 * When the tooltip itself is hovered.
	 *
	 * @private
	 */
	_onProtipMouseenter() {
		clearTimeout(this.get(C.PROP_DELAY_OUT));
	}

	/**
	 * When the tooltip itself is left.
	 *
	 * @private
	 */
	_onProtipMouseleave() {
		(this.get(C.PROP_TRIGGER) === C.TRIGGER_HOVER) && this.hide()
	}

	/**
	 * Attaches event handlers.
	 *
	 * @private
	 */
	_bind() {
		if (this.get(C.PROP_INTERACTIVE)) {
			this.$protip.addEventListener(C.EVENT_MOUSEENTER, this._onProtipMouseenter.bind(this))
			this.$protip.addEventListener(C.EVENT_MOUSELEAVE, this._onProtipMouseleave.bind(this))
		}

		if (this.get(C.PROP_OBSERVER)) {
			this.Observer = new MutationObserver(() => {
				this.classInstance.reloadItemInstance(this.El.source)
			})

			this.Observer.observe(this.$source, {
				attributes: true,
				childList: false,
				characterData: false,
				subtree: false
			})
		}
	}

	/**
	 * Removes event handlers.
	 *
	 * @private
	 */
	_unbind() {
		this.off()
		if (this.get(C.PROP_INTERACTIVE)) {
			this.$protip.removeEventListener(C.EVENT_MOUSEENTER, this._onProtipMouseenter.bind(this))
			this.$protip.removeEventListener(C.EVENT_MOUSELEAVE, this._onProtipMouseleave.bind(this))
		}
		this.Observer && this.Observer.disconnect()
	}
}