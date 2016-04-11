$(function () {

	$("body").removeClass("no-js"); // JavaScript detection

	var trialButton = $("#trial-btn");

	$('[data-toggle="tooltip"]').tooltip();

	$("#jumbotron-picture").delay(500).fadeIn(2000, function() {
		$("#headings").animate({
			opacity: 1,
			left: "-=200px"
		}, 2000);
	});

})