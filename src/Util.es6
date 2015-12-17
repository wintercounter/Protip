/**
 * Util Class
 *
 * It will create a buffer of called protip jQuery helper methods
 * and recalls them after protip initialization is done.
 */

export default class {
	// Deep copy
	extend(out) {
		out = out || {}

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i]) continue

			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key))
					out[key] = arguments[i][key]
			}
		}

		return out
	}

	// Nano Templates - https://github.com/trix/nano
	nano(template, data) {
		return template.replace(/\{([\w\.]*)}/g, (str, key) => {
			let keys = key.split(".")
			let v = data[keys.shift()]
			for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
			return (typeof v !== "undefined" && v !== null) ? v : ""
		})
	}
}