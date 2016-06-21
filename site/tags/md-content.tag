<md-content>
    <div></div>

    $.get(this.opts.url, function(data){
        var content = $('<div>' + marked(data) + '</div>' )
        content.find('p:first').remove()
        content.find('hr:first').remove()
        content.find('h1').each(function(){
            var h1 = $(this);
            h1 = h1.add(h1.nextUntil('h1'));
            h1.wrapAll('<div id="content-' + h1.attr('id') + '" />').wrapAll('<div />');
        });
        content.find('#content-credits').remove()
        content.find('#content-bookmarks').remove()
        content.find('#list-of-available-positions + ul')
            .add(content.find('#list-of-available-positions + ul + p'))
            .wrapAll('<div class="row" />')
        this.root.childNodes[0].innerHTML = content.html()
    }.bind(this))
</md-content>