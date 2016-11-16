/**!
 * Genoverse Angular module implmenting
 * Genoverse http://wtsi-web.github.io/Genoverse/
 * @author  Mike Goodstadt  <mikegoodstadt@gmail.com>
 * @version 0.0.1
 *
 * Module which loads Genoverse as a track
 * install, inject into TADkit.js and then add "browser-genoverse" to Storyboard component list:
 *
 */
(function() {
	'use strict';
	angular
		.module('browsers')
		.factory('GenoverseService', GenoverseService);

	function GenoverseService(ONLINE, $log, $document, $q, $http, $timeout, $rootScope) {

		/*** Example Genoverse Config File
		 *
		 *    "container" is the HTML element to contain the browser.
		 *    "genome" points to a file in '/genomes' containing JSON :
		 *           a) to determine the length of chromosomes (the size property)
		 *           b) to draw the chromosome using the karyotype plugin.
		 *    "chr", "start", "end" define the initial range cordinates.
		 *    "plugins" specifies plugins to initialize on load.
		 *    "tracks" specifies initial tracks to load.
		 *
		 *	{
		 *		"container" : "#browser-genoverse-6",
		 *		"genome" : "grch38",
		 *		"chr" : 13,
		 *		"start" : 32296945,
		 *		"end" : 32370557,
		 *		"plugins" : [ "controlPanel", "karyotype", "trackControls", "resizer", "focusRegion", "fullscreen", "tooltips", "fileDrop" ],
		 *		"tracks" : [ "Genoverse.Track.Scalebar" ]
		 *	}
		 *
		 */

		return {
			/**
			 * @ngdoc function
			 * @name browsers.service:GenoverseService#load
			 * @methodOf browsers.service:GenoverseService
			 * @kind function
			 *
			 * @description
			 * A function that loads the files required to initialize and run Genoverse.
			 * Uses $q.all to ensure all are loaded before returning.
			 *
			 * @returns {Array} results of appending the files.
			 * [ null | undefined | String | Array | Object | don't know ].
			 */
			load: function() {
				$log.log("Genoverse Browser loading...");

				var assetsPath = "assets/js/genoverse/";
				var configFile = "modules/genoverse/genoverse-config.txt";
				var resources = [];
				resources.push("modules/browsers/genoverse-reset.css");
				resources.push(assetsPath + "js/genoverse.combined.js");

				var appendResources = [];
				angular.forEach(resources, function(filename, key) {
					appendResources.push(Files.appendToHTML(filename));
				});
				appendResources.push(Files.loadConfig(configFile));

				return $q.all(appendResources)
				.then(function(results) {
					$log.debug(results);
					$log.log("Genoverse Browser loaded OK!");
					return results;
				});
			}
		};
	}
})();