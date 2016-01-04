import Class from './Class'
import Prototype from './Prototype'

export class Api {

	/* jshint ignore:start */
	static Ready = false
	Class = undefined
	/* jshint ignore:end */

	constructor (settings) {
		window.Protip = this
		this.applyPrototype()
		this.Class = new Class(settings)
		this.Ready = true
	}

	applyPrototype () {
		Object.defineProperty(Element.prototype, 'protip', {
			get: function() {
				this._protipProto = this._protipProto || new Prototype(this)
				return this._protipProto
			},
			configurable: true,
			writeable: false
		})
	}

	get ($) {
		return this.Class.getItem($)
	}
}

window.Protip = Api