/**!
 * Genome Maps https://genomemaps.org
 * Jsorolla genome-viewer https://github.com/opencb/jsorolla
 * @author  Mike Goodstadt  <mikegoodstadt@gmail.com>
 * @version 0.0.1
 */
(function() {
	'use strict';
	angular
		.module('browsers')
		.factory('JsorollaService', JsorollaService);

	function JsorollaService($rootScope, $log, $document, $q, $timeout, Files) {
		return {
			/**
			 * @ngdoc function
			 * @name browsers.service:JsorollaService#load
			 * @methodOf browsers.service:JsorollaService
			 * @kind function
			 *
			 * @description
			 * A function that loads the files required to initialize and run OpenCB Jsorolla API.
			 * Uses $q.all to ensure all are loaded before returning.
			 * Currently only loads the Genome Viewer component.
			 *
			 * @returns {Array} results of appending the files.
			 * [ null | undefined | String | Array | Object | don't know ].
			 */
			load: function() {
				$log.log("OpenCB Jsorolla Genome Viewer loading...");

				var assetsPath = "assets/js/genome-viewer/";

				var resources = [];
				resources.push(assetsPath + "vendor/fontawesome/css/font-awesome.min.css");
				resources.push(assetsPath + "vendor/qtip2/jquery.qtip.min.css");
				resources.push(assetsPath + "styles/css/style.css");
				resources.push(assetsPath + "vendor/underscore/underscore-min.js");
				resources.push(assetsPath + "vendor/backbone/backbone.js");
				resources.push(assetsPath + "vendor/jquery/dist/jquery.min.js");
				resources.push(assetsPath + "vendor/qtip2/jquery.qtip.min.js");
				resources.push(assetsPath + "vendor/uri.js/src/URI.min.js");
				resources.push(assetsPath + "gv-config.js");
				resources.push(assetsPath + "genome-viewer.js");

				var appendResources = [];
				angular.forEach(resources, function(filename, key) {
					appendResources.push(Files.appendToHTML(filename));
				});

				return $q.all(appendResources)
				.then(function(results) {
					$log.debug(results);
					$log.log("OpenCB Jsorolla Genome Viewer loaded OK!");
					return results;
				});
			}
		};
	}
})();