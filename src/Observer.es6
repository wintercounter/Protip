export default class {

	construct(element) {
		this.element = element
	}

	get element() {
		return this._element
	}

	set element(element) {
		this._element = element
	}

	get callback() {
		return this._callback
	}

	set callback(callable) {
		this._callback = callable
	}

	get data() {
		return this._data
	}

	set data(callable) {
		this._callback = callable
	}

	get events() {
		this._events = this._events || {}
		return this._events
	}

	on(events, callable) {
		this.callable = callable
		events.split(' ').forEach(this._on, this)
	}

	_on(event) {
		this.events[event] = this.events[event] || []
		this.events[event].push(this.callback)
		this.element.addEventListener(event, this.callback)
	}

	off(events, callable) {
		this.callback = callable
		events && events.split(' ').forEach(this._off, this)
		!events && this._off
	}

	_off(event) {
		// No param, delete all events
		if (!event) {
			Object.keys(this.events).forEach((key) =>{
				this.events[key].forEach((callback) => {
					this.element.removeEventListener(key, callback)
				})
			})
			delete this.events
		}
		// Event name and specific callback to remove
		else if (this.callback) {
			let index = this.events[event].indexOf(this.callback)
			let callback = this.events[event][index]
			callback && (this.events[event].splice(0, index) && this.element.removeEventListener(event, callback))
		}
		// Remove all callback associated with this event name
		else {
			this.events[event].forEach((callback) => {
				this.element.removeEventListener(event, callback)
			})
			delete this.events[event]
		}
	}

	fire(events, data) {
		this.data = data
		events.split(' ').forEach(this._fire, this)
	}

	_fire(event) {
		this.events[event].forEach((callback) => {
			callback.call(this, this.data)
			this.element.dispatchEvent(
				new CustomEvent(event, {
					detail: this.data,
					bubbles: true,
					cancelable: true
				})
			)
		})
	}
}