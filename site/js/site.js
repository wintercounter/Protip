$(document).ready(function() {
    $('.js-loading-overlay').fadeOut(1000, function(){
        $(this).remove();
        $.protip();
        riot.mount('*', {
            api: {
                form: new Form().init()
            }
        });
    });
});