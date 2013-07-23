/*  ==========================================================================
	Author: Fabio Quarantini - @febba
	==========================================================================  */

var siteInit = {

	DOMready: function() {

		if ($('.modal-iframe').length > 0) {
			siteInit.modalIframe();
		}

		if ($('.modal-gallery').length > 0) {
			siteInit.modalGallery();
		}

		if ($('.flexslider').length > 0) {
			siteInit.slider();
		}

	},


	/* Colorbox iframe */

	modalIframe: function() {

		$(".modal-iframe").colorbox({
			iframe: true,
			transition: "elastic",
			speed: 400,
			opacity: 0.6,
			initialWidth: 50,
			initialHeight: 50,
			width: "80%",
			height: "80%"
		});

	},


	/* Colorbox image gallery */

	modalGallery: function() {

		$(".modal-gallery").colorbox({
			transition: "elastic",
			speed: 400,
			opacity: 0.6,
			slideshow: true,
			slideshowSpeed: 4000,
			initialWidth: 50,
			initialHeight: 50,
			className: "colorbox-gallery"
		});

	},


	/* FlexSlider */

	slider: function() {

		$('.flexslider').flexslider({
			animation: "slide",
			slideshow: true,
			slideshowSpeed: 7000,
			controlNav: true,
			directionNav: true,
			animationSpeed: 600
		});

	}

};


/*  ==========================================================================
	Document ready
	==========================================================================  */

$(document).ready(function() {
	siteInit.DOMready();	
});