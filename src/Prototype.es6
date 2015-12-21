import Buffer from './Buffer'

let Protip = window.Protip

export default class {

	/* jshint ignore:start */
	$ = undefined
	Buffer = undefined
	Protip = undefined
	/* jshint ignore:end */

	constructor (el) {
		this.$ = el
		this.Buffer = new Buffer(el)
	}
	/**
	 * Simply sets tooltip to the element but it won't show.
	 *
	 * @param override [Object] Pass custom settings to this tooltip.
	 * @returns {Element}
	 */
	set (override) {
		if (this.Buffer.isReady()) {
			this.$.protip.destroy()
			Protip.getItem(this.$, override)
		}
		else {
			this.Buffer.add('set', arguments)
		}
		return this.$
	}

	/**
	 * Shows the protip on an element.
	 *
	 * @param override [Object] Pass custom settings to this tooltip.
	 * @returns {Element}
	 */
	show (override) {
		if (this.Buffer.isReady()) {
			this.el.protip.destroy()
			Protip.getItem(this.$, override).show(true)
		}
		else {
			this.Buffer.add('show', arguments)
		}
		return this.$
	}

	/**
	 * Hides a protip on an element.
	 *
	 * @returns {Element}
	 */
	hide () {
		if (this.Buffer.isReady()) {
			Protip.getItem(this.$).hide(true)
		}
		else {
			this.Buffer.add('hide', arguments)
		}
		return this.$
	}

	/**
	 * Toggles protip on an element.
	 *
	 * @returns {Element}
	 */
	toggle () {
		if (this.Buffer.isReady()) {
			let instance = Protip.getItem(this.$)
			instance.isVisible()
				? instance.hide(true)
				: instance.show(true)
		}
		else {
			this.Buffer.add('toggle', this.$, arguments)
		}
		return this.$
	}

	/**
	 * Hides all tooltips inside this element.
	 *
	 * @returns {Element}
	 */
	hideInside (){
		if (this.Buffer.isReady()) {
			this._findAll(this.hide);
		}
		else {
			this.Buffer.add('hideInside', this.$, arguments)
		}
		return this.$
	}

	/**
	 * Shows all tooltips inside this element.
	 *
	 * @returns {Element}
	 */
	showInside (){
		if (this.Buffer.isReady()) {
			this._findAll(this.show);
		}
		else {
			this.Buffer.add('showInside', this.$, arguments)
		}
		return this.$
	}

	/**
	 * Toggles protips inside another element.
	 *
	 * @returns {Element}
	 */
	toggleInside (){
		if (this.Buffer.isReady()) {
			this._findAll(this.toggle)
		}
		else {
			this.Buffer.add('toggleInside', arguments)
		}
		return this.$
	}

	/**
	 * Finds all tooltips inside an element and applies a callback to them.
	 * @private
	 */
	_findAll (callback){
		[].forEach.call(
			this.el.querySelectorAll(Protip.Instance.settings.selector),
			callback.bind(this.el)
		)
	}
}