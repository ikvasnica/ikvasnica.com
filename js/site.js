$(function () {

	// JavaScript detection
	$("body").removeClass("no-js");

	// jQuery objects cache
	var trialButton = $("#trial-btn");
	var projectThumbnails = $('.thumbnail');
	var socialIcons = $('.social-link');

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
	})
	// projects thumbnails effects
				.on ('mouseenter', '.thumbnail-picture', function() {
		if (isSmallScreen()) { return; }

		$(this).slideUp(300, function() {
			$(this).siblings('.caption').show().animate({opacity: 1});
			$(this).siblings('.thumbnail-buttons').show().animate({opacity: 1});
		});
	})
				.on('mouseleave', '.thumbnail', function() {
		if (isSmallScreen()) { return; }

		$(this).children('.caption').animate({opacity: 0}, function() {
			$(this).siblings('.thumbnail-picture').slideDown(300);
			$(this).siblings('.thumbnail-buttons').hide().css('opacity', 0);
			$(this).hide();
		});
	});

	// lazy loading - social icons
	$('#contact').onScreen({
	   container: window,
	   direction: 'vertical',
	   doIn: function() {
	   		var delay = 300;

	   		setTimeout(function() {
	   			setEachAnimation(delay, 1, socialIcons);
	   		}, delay);

	   },
	   tolerance: 150,
	   throttle: 50
	})

	// resets visibility when window resizing
	$(window).resize(function () {
		if (isSmallScreen()) {
			$('.thumbnail-buttons').show().css('opacity', 1);
			$('.caption').show().css('opacity', 1);
		} else {
			$('.thumbnail-buttons').hide().css('opacity', 0);
			$('.caption').hide().css('opacity', 0);
		}
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