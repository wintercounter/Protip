<form-select>
    <label>
        <span>{ opts.name }</span>
        <div class="padding">
            <select name="sel" onchange={ change }>
                <option each={ value, i in values } value={ value }>{ value }</option>
            </select>
        </div>
    </label>

    var form = this.opts.api.form
    this.values = form.getDefault(opts.name)
    this.sel.name = this.opts.name

    change(ev){
        var target = $(ev.target)
        form.trigger('update', target.attr('name'), target.val())
    }
</form-select>