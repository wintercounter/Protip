$(document).ready(function() {
    $.protip();
    riot.mount('*', {
        api: {
            form: new Form().init()
        }
    });
    $(window).resize();
    $('.js-loading-overlay').fadeOut(1000, function(){
        $(this).remove();
    });
});