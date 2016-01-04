import * as C from './Constants'
import Buffer from './Buffer'

export default class {

	/* jshint ignore:start */
	$ = undefined
	Buffer = undefined
	Protip = undefined
	Prop = {}

	/* jshint ignore:end */

	constructor ($) {
		this.$ = $
		this.Buffer = new Buffer(this)
	}

	/**
	 * Simply sets tooltip to the element but it won't show.
	 *
	 * @param override [String] Pass custom settings to this tooltip.
	 * @returns {String|Object}
	 */
	get (prop) {
		return prop ? this.Prop[prop] : this.Prop
	}
	/**
	 * Simply sets tooltip to the element but it won't show.
	 *
	 * @param override [Object] Pass custom settings to this tooltip.
	 * @returns {Element}
	 */
	set (prop, val) {
		this.Prop[prop] = val
		return this
	}

	getInstance () {
		return Protip.get(this.$)
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
			this.getInstance(this.$).show(true)
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
			this.getInstance(this.$).hide(true)
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
			let instance = this.getInstance(this.$)
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
			this.$.querySelectorAll(Protip.Class.settings.selector),
			callback.bind(this.$)
		)
	}
}