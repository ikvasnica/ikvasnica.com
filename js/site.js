$(function () {

	// JavaScript detection
	$("body").removeClass("no-js");

	// jQuery objects cache
	var trialButton = $("#trial-btn");
	var projectThumbnails = $('.thumbnail');

	// tooltip plugin
	$('[data-toggle="tooltip"]').tooltip();

	// Photo and headings animation on pageload
	$("#jumbotron-picture").delay(500).fadeIn((isSmallScreen() ? 0 : 2000), function() {
		$("#headings").css("left", "200px").animate({
			opacity: 1,
			left: "-=200px"
		}, 2000);
	});

	// lazy loading - projects thumbnails
	$('#projects').onScreen({
	   container: window,
	   direction: 'vertical',
	   doIn: function() {

	   		var delay = 500;

	   		setTimeout(function() {
	   			setEachAnimation(delay, 1, projectThumbnails);
	   		}, delay);

	   },
	   tolerance: 300,
	   throttle: 50
	});


	function isSmallScreen() {
		if ($(window).width() < 600) { return true; } else { return false; }
	}

	function setEachAnimation(startDelay, opacityLevel, elements) {

		var noOfIterations = 1;

		elements.each(function() {
			var _this = $(this);

			setTimeout(function() {
				_this.animate({opacity: opacityLevel}, startDelay);
			}, startDelay * noOfIterations);

			noOfIterations += 1;
		});
	}

})