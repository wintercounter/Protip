var Form = function(){

    var defaults = {
        trigger:     {tag: 'select', value: ['sticky', 'hover', 'click'], help: 'When to show the tooltip? <br> Sticky will be shown on pageload.'},
        title:       {tag: 'select', value: ['Hi there! I\'m a Protip!'], help: 'Sorry mate. There is only one option.'},
        delayIn:     {tag: 'range',  value: [0, 0, 10000], help: 'Showing the tooltip will be delayed.'},
        delayOut:    {tag: 'range',  value: [0, 0, 10000], help: 'Hiding the tooltip will be delayed.'},
        interactive: {tag: 'select', value: [false, true], help: 'Interactive will let the user to show the tooltip as long as the user\'s mouse is over it.'},
        gravity:     {tag: 'select', value: [false, true, 'left; right', 1, 2, 3, 'left -20; right 20'], help: 'If your tooltip does not fit into the users viewport, it will try to find a place where it can be fully visible.'},
        offsetTop:   {tag: 'range',  value: [0, -50, 50], help: 'You may adjust the Y position of the tooltip. (Only has effect if gravity is turned off.)'},
        offsetLeft:  {tag: 'range',  value: [0, -100, 100], help: 'You may adjust the X position of the tooltip. (Only has effect if gravity is turned off.)'},
        position:    {tag: 'select', value: ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'left-top', 'left-bottom', 'bottom-right', 'bottom-left', 'right-bottom', 'right-top', 'top-left-corner', 'top-right-corner', 'bottom-left-corner', 'bottom-right-corner'], help: 'The default position the tooltip. (Gravity may override.)'},
        placement:   {tag: 'select', value: ['outside', 'inside', 'border', 'center'], help: 'Placement of the tooltip inside the element. Probably you will want to disable arrow for other than outside.'},
        //classes:     {tag: 'select', value: ['', 'additional-class'], help: 'Just in case you need additional class(es) on your tooltip for example for styling with CSS or attaching custom events to it. Check in the DOM if you added.'},
        arrow:       {tag: 'select', value: [true, false], help: 'You want to show the arrow or not?'},
        width:       {tag: 'range',  value: [300, 0, 300], help: 'The max-width of the tooltip. You may use fixed value (300!) but not in the sandbox.'},
        icon:        {tag: 'select', value: [false, 'info-circled', 'help-circled', 'ok-circled', 'trash-empty', 'tree'], help: 'Adds icon template to the tooltip with the selected icon.'},
        observer:    {tag: 'select', value: [false, true], help: 'Observ the element for changes. To try, there is an empty data-pt-title attribute in the developer tools. Change it\'s value and you should see your tooltip is updated with the new title instantly. Also note that this feature is only useful if you control your tooltip from attributes.'},
        target:      {tag: 'select', value: ['body', '.demo__tooltip', true], help: 'Protip will place the tooltip into this selector. With the value of \'true\', it will place inside the element itself. Check in the DOM.'},
        skin:        {tag: 'select', value: ['square', 'default'], help: 'The skin to use for the tooltip.'},
        size:        {tag: 'select', value: ['normal', 'tiny', 'small', 'big', 'large'], help: 'Size of the tooltip. (This has to be supported by the skin.)'},
        scheme:      {tag: 'select', value: ['pro', 'blue', 'red', 'aqua', 'black', 'leaf', 'purple', 'pink', 'orange'], help: 'Scheme of the tooltip. (This has to be supported by the skin.)'},
        animate:     {tag: 'select', value: [false, 'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown', 'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft', 'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig', 'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flip', 'flipInX', 'flipInY', 'flipOutX', 'flipOutY', 'lightSpeedIn', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight', 'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft', 'rotateOutUpRight', 'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'zoomIn', 'zoomInDown', 'zoomInLeft', 'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'hinge', 'rollIn', 'rollOut'], help: 'Protip has built-in support for <a href="https://daneden.github.io/animate.css/" target="_blank">Animate.css</a>'},
        autoHide:    {tag: 'select', value: [false, 3000], help: 'In case you need automatic hiding.'},
        mixin:       {tag: 'select', value: ['css-no-transition', 'css-bold', 'css-italic'], help: 'With mixins you are able to apply new functionalities to you tooltip. There are CSS based only now, But JavaScript mixins will be supported soon (they are like plugins).'}
    };

    var el  = {
        form: $('.js-demo-form'),
        tip: $('.js-demo-tip')
    };

    var options;

    this.init = function(){
        riot.observable(this);
        this._setOptions();
        this._generateForm();
        this._setProtip();
        this.bind();
        return this;
    };

    this._setOptions = function(){
        options = $.extend({}, defaults);
        $.each(options, function(k, v){
            options[k] = v.value[0];
        });
    };

    this._generateForm = function(){
        var html;

        this.getDefault = function(name) {
            return defaults[name].value;
        };

        $.each(defaults, function(name, obj){
            html = '<form-' + obj.tag + ' name="' + name + '"></form-' + obj.tag + '>';
            html = $(html);
            html.protipShow({
                title: obj.help,
                size: 'small',
                position: 'left',
                mixin: 'css-no-transition',
                scheme: 'purple',
                classes: 'form-helper-tooltip'
            }).protipHide();
            el.form.append(html);
        });

        el.form.append('<button type="reset">Reset to Defaults</button>');
    };

    this._cleanValue = function(val){
        val = val === "false"   ? false             : val;
        val = val === "true"    ? true              : val;
        val = /^[-+]?\d+$/.test(val) ? parseInt(val, 10) : val;

        return val;
    };

    this._setProtip = function(){
        el.tip.protipShow(options);
    };

    this._onUpdate = function(name, value) {
        options[name] = this._cleanValue(value);
        name === 'placement' && this._setElemByPlacement(value);
        this._setProtip();
    };

    this._setElemByPlacement = function(value){
        switch (value) {
            case 'inside': el.tip.css({width: '500px', height: '250px', lineHeight: '250px'}); break;
            case 'border': el.tip.css({width: '400px', height: '175px', lineHeight: '175px'}); break;
            default      : el.tip.css({width: '300px', height: '100px', lineHeight: '100px'}); break;
        }
    };

    this._onReset = function(){
        this._setOptions();
        this._setElemByPlacement();
        this._setProtip();
    };

    this.bind = function(){
        this.on('update', this._onUpdate.bind(this));
        el.form.on('reset', this._onReset.bind(this));
        $(window).resize();
    };
};