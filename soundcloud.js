// For overriding Audio, we must be in the page script, not content script
var script = document.createElement('script');
var js = [
	'var a = Audio;',
	'Audio = function() {',
		'var rv = new a;',
		'document.body.appendChild(rv);',
		'setTimeout(function() {',
			'if (rv.id == "html5AudioObject_Single") {',
				'window.dispatchEvent(e = new CustomEvent("audiocreated", {detail: rv.id}));',
			'}',
		'}, 1);',
		'return rv;',
	'};'
];
script.text = js.join("\n");
script.dataset.origin = 'soundcloudrepeat';
document.documentElement.appendChild(script);

// The content script can listen for the page script event and handle the rest
window.addEventListener('audiocreated', function(e) {
	var el = document.querySelector('#' + e.detail);
	el.addEventListener('timeupdate', function(e) {
		var repeating = document.body.classList.contains('repeating');
		if ( repeating ) {
			if ( this.currentTime >= this.duration - 0.5 ) {
				this.currentTime = 0;
			}
		}
	});
});

window.addEventListener('load', function(e) {
	var div = document.createElement('div');
	div.id = 'repeating';
	div.textContent = 'R';
	div.title = 'GREEN MEANS KEEP GOING';
	div.onclick = function(e) {
		document.body.classList.toggle('repeating');
	};
	document.body.appendChild(div);
});
