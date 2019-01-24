/**
 * Custom JS
 */

var scene = $('.scene'),
	school = $('.school'),
	touch = false,
	instructions = $('.instructions'),
	playing = $('.playing'),
	done = $('.done'),
	count = 0,
	totalFish;

var svgs = {
	'svg/bottom-opt.svg': '5',
	'svg/waves-opt.svg': '5',
    'svg/submarine-opt.svg': '1',
    'svg/fish-opt.svg': '10'
};


function fixViewport() {

	// only in iOS7
	if (navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i)) {
		
		// force scene width to have 4/3 scene height
		scene.width( scene.height() * 4 / 3 );
		// same on window resize
		$(window).resize(function() {
			scene.width( scene.height() * 4 / 3 );
		});
	}
}

function loadSvgs() {
	$.each(svgs, function(url, total) {
		$.get(url, function(data) {
			var svg = $(data).find("svg").first(),
				svgClass = svg.attr('class');

			for (var i = 0; i < total; i++) {

				if (svgClass == 'fish') {
					svg.attr('class', svgClass + " " + svgClass + '-' +  (i+1)).clone().appendTo(school);

					if (i == total-1) {
						totalFish = total;
						catchFish();
					}

				} else {
					svg.attr('class', svgClass + " " + svgClass + '-' +  (i+1)).clone().appendTo(scene);
				}
			}
		})
	});
}

function catchFish() {

	var fish = $('.fish');

	fish.on('touchstart', function(e) {
		touch = true;

		var myFish = $(this);

		fishHandler(myFish);

		e.preventDefault();
	});

	fish.on('mousedown', function(e) {
		if ( touch == false) {
			var myFish = $(this);

			fishHandler(myFish);
		} 

		e.preventDefault();		
	});
}

function fishHandler(myFish) {

	count = count + 1;

	if (count == 1) start = new Date();

	if (count < totalFish) {
		playing.find('.up').text(count);
		playing.find('.down').text(totalFish - count);
		if (instructions.hasClass('visible')) instructions.removeClass('visible');
		if (!playing.hasClass('visible')) playing.addClass('visible');
		playing.addClass('shake');
		setTimeout(function(){ playing.removeClass('shake'); }, 500);
	} else {
		var expended = (new Date() - start) / 1000;
		done.find('.down').text(Math.round(expended));
		playing.removeClass('visible');
		done.addClass('visible');
	}

	setTimeout(function(){
		myFish.remove();
	}, 100);
}

$(document).ready(function() {

	PointerEventsPolyfill.initialize({});

	fixViewport();

	loadSvgs();
});