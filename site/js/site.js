$(document).ready(function() {
    $.protip();

    riot.mount('*', {
        api: {
            form: new Form().init()
        }
    });

    $('.js-loading-overlay').fadeOut(1000, function(){
        $(this).remove();
    });
});