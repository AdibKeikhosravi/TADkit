(function() {
	'use strict';
	/**
	 * @ngdoc service
	 * @name generic.service:Files
	 * @module generic
	 *
	 * @description
	 * File utilities.
	 *
	 */
	angular
		.module('generic')
		.factory('Files', Files);

	function Files() {
		return {
			/**
			 * @ngdoc function
			 * @name generic.service:Files#appendToHTML
			 * @methodOf generic.service:Files
			 * @kind function
			 *
			 * @description
			 * A function that appends files to HTML
			 *
			 * @param {string} filename to append to HTML
			 * @returns {string} result of file appended
			 * [ null | undefined | String | Array | Object | don't know ].
			 */
			appendToHTML: function(filename) {
					var deferred = $q.defer();

					var filetype = filename.substr(filename.lastIndexOf('.')+1);
					var resource = {
						"filename" : filename,
						"filetype" : filetype
					};
					if (filetype == "css") {
						resource.nodeName = "link";
					} else if (filetype == "js") {
						resource.nodeName = "script";
					} else {
						$log.warn("FilesService: \"" + filetype + "\" is not a valid filetype!");
						// return deferred.resolve();
					}

					function onLoad() {
						$rootScope.$apply(function() {
							$log.debug("Loaded: " + resource.filename);
							deferred.resolve(resource);
						});
					}

					function appendResource(resource) {
						var node = $document[0].createElement(resource.nodeName);
							if (resource.nodeName == "link") {
								node.type = "text/css";
								node.href = resource.filename;
								node.rel = "stylesheet";
							} else if (resource.nodeName == "script") {
								node.type = "text/javascript";
								node.src = resource.filename;
								node.async = true;
								// node.text = config;
							}
							node.onreadystatechange = function () { if (this.readyState == "complete") onLoad(); };
							node.onload = onLoad;

						var parent = $document[0].getElementsByTagName("body")[0];
							parent.appendChild(node);
					}

					appendResource(resource);
					return deferred.promise;
			},

			loadConfig: function(configFile) {
				var deferred = $q.defer();
				if (!configFile) {
					// no file...
				} else {
					$http({
						url : configFile,
						method : 'GET',
						transformResponse : undefined,
						responseType : 'text'
					})
					.success( function(configText) {
						console.log(configText);
						config = configText;
						$log.debug("Genoverse default config loaded from " + configFile);
						deferred.resolve(config);
					});
					console.log("Genoverse default config loaded.");
				}
				return deferred.promise;
			}

		};
	}
})();