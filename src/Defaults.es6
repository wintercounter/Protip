import * as C from 'Constants'

export default {
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
}