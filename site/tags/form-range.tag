<form-range>
    <label>
        <span>{ opts.name }</span>
        <div>
            <input type=range name=range value={ values[0] } min={ values[1] } max={ values[2] } step=1 onchange={ change } oninput={ change }>
            <input type=text name=input value={ values[0] } readonly>
        </div>
    </label>

    var form = this.opts.api.form
    this.values = form.getDefault(opts.name)
    this.range.name = opts.name
    this.input.defaultValue = this.range.defaultValue = this.values[0]

    change(ev){
        var target = $(ev.target)
        var val = target.val()
        this.input.value = val
        form.trigger('update', target.attr('name'), val)
    }
</form-range>