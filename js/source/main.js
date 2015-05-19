'use strict';

jQuery.noConflict();

jQuery( document ).ready( function( $ ) {

	var siteInit = {

		DOMready: function() {

			if ($('.selector').length > 0) {
				siteInit.demoFunction();
			}

		},


		// Demo function

		demoFunction: function() {

		}



	};

	siteInit.DOMready();

});
