var minifier = require('minifier')
var inputJS  = 'bundle.js'
var outputJS  = 'protip.min.js'
var inputCSS = 'css/protip.css'
var outputCSS = 'protip.min.css'

console.log('Minify JS and CSS')

minifier.minify(inputJS, {
	output: outputJS
})

minifier.minify(inputCSS, {
	output: outputCSS
})