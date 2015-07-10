/**
 * Just contants
 */

(function (root, factory) {

	'use strict';

	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.ProtipConstants = factory();
	}
}(this, function () {

	'use strict';

	var ProtipConstants = {
		POSITION_TOP_LEFT: 'top-left',
		POSITION_TOP: 'top',
		POSITION_TOP_RIGHT: 'top-right',
		POSITION_RIGHT_TOP: 'right-top',
		POSITION_RIGHT: 'right',
		POSITION_RIGHT_BOTTOM: 'right-bottom',
		POSITION_BOTTOM_LEFT: 'bottom-left',
		POSITION_BOTTOM: 'bottom',
		POSITION_BOTTOM_RIGHT: 'bottom-right',
		POSITION_LEFT_TOP: 'left-top',
		POSITION_LEFT: 'left',
		POSITION_LEFT_BOTTOM: 'left-bottom',
		POSITION_CORNER_LEFT_TOP: 'corner-left-top',
		POSITION_CORNER_RIGHT_TOP: 'corner-right-top',
		POSITION_CORNER_LEFT_BOTTOM: 'corner-left-bottom',
		POSITION_CORNER_RIGHT_BOTTOM: 'corner-right-bottom',

		TRIGGER_CLICK: 'click',
		TRIGGER_HOVER: 'hover',
		TRIGGER_STICKY: 'sticky',

		PROP_ACTION: 'action',
		PROP_TITLE: 'title',
		PROP_STICKY: 'sticky',
		PROP_INITED: 'inited',
		PROP_DELAY_IN: 'delayIn',
		PROP_DELAY_OUT: 'delayOut',
		PROP_GRAVITY: 'gravity',
		PROP_OFFSET: 'offset',
		PROP_OFFSET_TOP: 'offsetTop',
		PROP_OFFSET_LEFT: 'offsetLeft',
		PROP_POSITION: 'position',
		PROP_CLASS: 'class',
		PROP_ARROW: 'arrow',
		PROP_WIDTH: 'width',
		PROP_IDENTIFIER: 'identifier',
		PROP_ICON: 'icon',
		PROP_AUTO: 'auto',
		PROP_TARGET: 'target',

		EVENT_MOUSEOVER: 'mouseover',
		EVENT_MOUSEOUT: 'mouseout',
		EVENT_MOUSEENTER: 'mouseenter',
		EVENT_MOUSELEAVE: 'mouseleave',
		EVENT_CLICK: 'click',
		EVENT_RESIZE: 'resize',

		DEFAULT_SELECTOR: '.protip',
		DEFAULT_NAMESPACE: 'pt',
		DEFAULT_DELAY_OUT: 250,

		SELECTOR_PREFIX: 'protip-',
		SELECTOR_BODY: 'body',
		SELECTOR_ARROW: 'arrow',
		SELECTOR_CONTAINER: 'container',
		SELECTOR_SHOW: 'protip-show',
		SELECTOR_CLOSE: '.protip-close',

		TEMPLATE_PROTIP: '<div id="{id}" class="{classes}" data-pt-identifier="{identifier}" style="{widthType}:{width}px">{arrow}{icon}<div>{content}</div></div>',
		TEMPLATE_ICON: '<i class="icon-{icon}"></i>',

		ATTR_WIDTH: 'width',
		ATTR_MAX_WIDTH: 'max-width'
	};

	ProtipConstants.TEMPLATE_ARROW = '<span class="' + ProtipConstants.SELECTOR_PREFIX + ProtipConstants.SELECTOR_ARROW + '"></span>';

	return ProtipConstants;
}));