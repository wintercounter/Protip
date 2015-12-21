/**
 * Buffer Class
 *
 * It will create a buffer of called element methods
 * and recalls them after protip initialization is done.
 */

export default class Buffer {

	/* jshint ignore:start */
	$ = undefined
	/** @type {[]} List of commands called. */
	CommandList = []
	/** @type {boolean} Tells if Protip is ready. */
	IsReady = false
	/** @type {number} Starts interval timer for checks. */
	Timer
	/* jshint ignore:end */

	constructor($) {
		this.Timer = setInterval(this._check.bind(this), 10)
	}

	/**
	 * Add cmd to buffer
	 *
	 * @param {cmd}     cmd     The command called.
	 * @param {Element} el      The HTML Element the item is called on.
	 * @param {cmdArgs} cmdArgs The arguments the command was called with.
	 */
	add(cmd, cmdArgs) {
		this.CommandList.push({
			cmd: cmd,
			cmdArgs: cmdArgs
		})
	}

	/**
	 * Check interval callback.
	 * @private
	 */
	_check() {
		window.Protip.Ready
		&& (this.IsReady = true)
		&& (!this.CommandList.length || this._run())
		&& clearInterval(this.Timer)
	}

	/**
	 * Run buffered command.
	 * @returns {boolean}
	 * @private
	 */
	_run() {
		var call = this._commandList.shift()
		call.el[call.cmd].apply(call.el, call.cmdArgs)
		this._commandList.length && this._run()
		return true
	}
}