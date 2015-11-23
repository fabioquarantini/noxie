'use strict';

jQuery.noConflict();

jQuery( document ).ready( function( $ ) {

	var siteInit = {

		DOMready: function() {

			if ( $('[href$=".jpg"], [href$=".png"], [href$=".gif"]').length > 0 ) {
				siteInit.modal();
			}

		},

		// Modal
		modal: function() {

			$('[href$=".jpg"], [href$=".png"], [href$=".gif"]').colorbox({
				transition: 'elastic',
				speed: 400,
				opacity: 0.8,
				slideshow: true,
				slideshowSpeed: 4000,
				itemsnitialWidth: 50,
				initialHeight: 50,
				maxWidth: '90%',
				maxHeight: '90%',
			});

		},

	};

	siteInit.DOMready();

});
