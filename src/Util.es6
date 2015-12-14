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
}