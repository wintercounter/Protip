export const PLACEMENT_CENTER  = 'center'
export const PLACEMENT_INSIDE  = 'inside'
export const PLACEMENT_OUTSIDE = 'outside'
export const PLACEMENT_BORDER  = 'border'

export const POSITION_TOP_LEFT            = 'top-left'
export const POSITION_TOP                 = 'top'
export const POSITION_TOP_RIGHT           = 'top-right'
export const POSITION_RIGHT_TOP           = 'right-top'
export const POSITION_RIGHT               = 'right'
export const POSITION_RIGHT_BOTTOM        = 'right-bottom'
export const POSITION_BOTTOM_LEFT         = 'bottom-left'
export const POSITION_BOTTOM              = 'bottom'
export const POSITION_BOTTOM_RIGHT        = 'bottom-right'
export const POSITION_LEFT_TOP            = 'left-top'
export const POSITION_LEFT                = 'left'
export const POSITION_LEFT_BOTTOM         = 'left-bottom'
export const POSITION_CORNER_LEFT_TOP     = 'top-left-corner'
export const POSITION_CORNER_RIGHT_TOP    = 'top-right-corner'
export const POSITION_CORNER_LEFT_BOTTOM  = 'bottom-left-corner'
export const POSITION_CORNER_RIGHT_BOTTOM = 'bottom-right-corner'

export const TRIGGER_CLICK  = 'click'
export const TRIGGER_CLICK2 = 'click2'
export const TRIGGER_HOVER  = 'hover'
export const TRIGGER_STICKY = 'sticky'

export const PROP_TRIGGER     = 'trigger'
export const PROP_TITLE       = 'title'
export const PROP_STICKY      = 'sticky'
export const PROP_INITED      = 'inited'
export const PROP_DELAY_IN    = 'delayIn'
export const PROP_DELAY_OUT   = 'delayOut'
export const PROP_GRAVITY     = 'gravity'
export const PROP_OFFSET      = 'offset'
export const PROP_OFFSET_TOP  = 'offsetTop'
export const PROP_OFFSET_LEFT = 'offsetLeft'
export const PROP_POSITION    = 'position'
export const PROP_CLASS       = 'class'
export const PROP_ARROW       = 'arrow'
export const PROP_WIDTH       = 'width'
export const PROP_IDENTIFIER  = 'identifier'
export const PROP_ICON        = 'icon'
export const PROP_AUTOSHOW    = 'autoShow'
export const PROP_AUTOHIDE    = 'autoHide'
export const PROP_TARGET      = 'target'
export const PROP_ANIMATE     = 'animate'

export const EVENT_MOUSEOVER   = 'mouseover'
export const EVENT_MOUSEOUT    = 'mouseout'
export const EVENT_MOUSEENTER  = 'mouseenter'
export const EVENT_MOUSELEAVE  = 'mouseleave'
export const EVENT_CLICK       = 'click'
export const EVENT_RESIZE      = 'resize'
export const EVENT_PROTIP_SHOW = 'protipshow'
export const EVENT_PROTIP_HIDE = 'protiphide'

export const ITEM_EVENT_DESTROY = 'item-destroy'

export const DEFAULT_SELECTOR  = '.protip'
export const DEFAULT_NAMESPACE = 'pt'
export const DEFAULT_DELAY_OUT = 100

export const SELECTOR_PREFIX        = 'protip-'
export const SELECTOR_BODY          = 'body'
export const SELECTOR_ARROW         = 'arrow'
export const SELECTOR_CONTAINER     = 'container'
export const SELECTOR_SHOW          = 'protip-show'
export const SELECTOR_CLOSE         = '.protip-close'
export const SELECTOR_SKIN_PREFIX   = 'protip-skin-'
export const SELECTOR_SIZE_PREFIX   = '--size-'
export const SELECTOR_SCHEME_PREFIX = '--scheme-'
export const SELECTOR_ANIMATE       = 'animated'
export const SELECTOR_TARGET        = '.protip-target'
export const SELECTOR_MIXIN_PREFIX  = 'protip-mixin--'
export const SELECTOR_OPEN          = 'protip-open'

export const TEMPLATE_PROTIP = `<div class="{classes}" data-pt-identifier="{identifier}" style="{widthType}:{width}px">
									{arrow}
									{icon}
									<div class="protip-content">
										{content}
									</div>
								</div>`
export const TEMPLATE_ICON   = `<i class="icon-{icon}"></i>`
export const TEMPLATE_ARROW  = `<span class="${SELECTOR_PREFIX}${SELECTOR_ARROW}"></span>`

export const ATTR_WIDTH     = 'width'
export const ATTR_MAX_WIDTH = 'max-width'

export const SKIN_DEFAULT   = 'default'
export const SIZE_DEFAULT   = 'normal'
export const SCHEME_DEFAULT = 'pro'

export const PSEUDO_NEXT = 'next'
export const PSEUDO_PREV = 'prev'
export const PSEUDO_THIS = 'this'
