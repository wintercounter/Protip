$(document).ready(function() {
    $.protip();
    riot.mount('*', {
        api: {
            form: new Form().init()
        }
    });
    setTimeout(function(){
        $(window).resize()
    }, 100);
    $('.js-loading-overlay').fadeOut(1000, function(){
        $(this).remove()
    });
});