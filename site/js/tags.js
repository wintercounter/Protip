riot.tag2('form-range', '<label> <span>{opts.name}</span> <div> <input type="range" name="range" value="{values[0]}" min="{values[1]}" max="{values[2]}" step="1" onchange="{change}" oninput="{change}"> <input type="text" name="input" value="{values[0]}" readonly> </div> </label>', '', '', function(opts) {

    var form = this.opts.api.form
    this.values = form.getDefault(opts.name)
    this.range.name = opts.name
    this.input.defaultValue = this.range.defaultValue = this.values[0]

    this.change = function(ev){
        var target = $(ev.target)
        var val = target.val()
        this.input.value = val
        form.trigger('update', target.attr('name'), val)
    }.bind(this)
}, '{ }');
riot.tag2('form-select', '<label> <span>{opts.name}</span> <div class="padding"> <select name="sel" onchange="{change}"> <option each="{value, i in values}" value="{value}">{value}</option> </select> </div> </label>', '', '', function(opts) {

    var form = this.opts.api.form
    this.values = form.getDefault(opts.name)
    this.sel.name = this.opts.name

    this.change = function(ev){
        var target = $(ev.target)
        form.trigger('update', target.attr('name'), target.val())
    }.bind(this)
}, '{ }');
riot.tag2('md-content', '<div></div>', '', '', function(opts) {

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
});