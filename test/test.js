require('../src/Plugin.js');

var assert = require('chai').assert,
	sinon = require('sinon'),
	testContent = require('./testcontent.html');

var protipInstance;

suite('Protip: Initializing', function() {

	setup(function() {
		this.sinon = sinon.sandbox.create();

		if (protipInstance) {
			protipInstance.destroy();
		}
		$('#sandbox').html(testContent);
		protipInstance = $.protip({
			observer: true
		});
	});

	teardown(function(){
		protipInstance._unbind();
		protipInstance._bind();
	});

	test('Extending options', function() {
		assert.strictEqual(!!protipInstance.settings, true);
	});

	test('Fetching elements with protip', function() {
		assert.strictEqual(Object.keys(protipInstance._itemInstances).length, $(protipInstance.settings.selector).size());
	});

	test('Parsing item settings (fetching data attributes)', function() {
		var item1 = protipInstance._itemInstances[Object.keys(protipInstance._itemInstances)[0]],
			item2 = protipInstance._itemInstances[Object.keys(protipInstance._itemInstances)[1]],
			item3 = protipInstance._itemInstances[Object.keys(protipInstance._itemInstances)[2]];

		assert.strictEqual(item1.data.title, item1.el.source.data(item1._namespaced('title')));
		assert.strictEqual(item2.data.title, item2.el.source.data(item2._namespaced('title')));
		assert.strictEqual(item3.data.title, item3.el.source.data(item3._namespaced('title')));
	});

	test('Delegating events', function() {
		this.sinon.spy(protipInstance, '_onAction');
		protipInstance._unbind();
		protipInstance._bind();

		var item =  protipInstance._itemInstances[Object.keys(protipInstance._itemInstances)[0]].el.source;
		item.trigger('mouseover').trigger('click');
		assert.isTrue(protipInstance._onAction.calledTwice);

		this.sinon.restore();
		protipInstance._unbind();
		protipInstance._bind();
	});

	// Render related tests
	if (process.title === 'browser'){

	}
});

suite('Protip: Generating Contents', function() {

	setup(function () {
		this.sinon = sinon.sandbox.create();

		if (protipInstance) {
			protipInstance.destroy();
		}
		$('#sandbox').html(testContent);
		protipInstance = $.protip();
	});

	test('Selecting target', function() {
		assert.isTrue(!!$('.protip-self .protip-container').size(), 'By Self');
		assert.isTrue(!!$('#protip-targeted').find('.protip-container').size(), 'By Selector');
	});

	test('Setting content', function() {
		assert.strictEqual($('.protip-self .protip-container > div').html(), $('#protip-test-content').html());
		assert.strictEqual($('.protip-targeted').data('ptTitle'), $('.protip-targeted .protip-container > div').html());
	});

	test('Appending protips', function() {
		assert.strictEqual($('.protip').size(), $('.protip-container').size());
	});

});

// Custom js
setTimeout(function(){
	$('body').on('click', 'button.add', function(){
		$('.clone').clone(false, false).removeClass('clone').insertBefore($(this));
	});
}, 500);

