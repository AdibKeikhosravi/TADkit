(function() {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name TADkit.directive:tkComponentBrowserGenoverse
	 * @restrict EA
	 *
	 * @description
	 * Genoverse browser directive that is replaced on complie
	 * by real component directive from supplied object type.
	 * e.g. from a array of components objects
	 *
	 * @example
	 * `<div tk-component-track-biodalliance ng-repeat='component in components'></div>`
	 *
	 */
	angular
		.module('TADkit')
		.directive('tkComponentBrowserGenoverse', tkComponentBrowserGenoverse);

	function tkComponentBrowserGenoverse(VERBOSE, $window, $log, GenoverseService) {
		return {
			restrict: 'E',
			templateUrl: 'assets/templates/browser.html',
			link: function(scope, element, attrs) {
				var genome = "grch38";
				var chromosomeSize = 249250621; // chromosome 1, human
				var config = "{container:'#" + scope.component.object.idIndex + "',";
				if (genome === null) {
					config += "chromosomeSize:" + chromosomeSize + ",";
				} else {
					config += "genome:'" + genome + "',";
				}
				config += "chr:'" + scope.component.view.viewpoint.chrom + "',";
				config += "start:" + scope.component.view.viewpoint.chromStart + ",";
				config += "end:" + scope.component.view.viewpoint.chromEnd + ",";
				config += "plugins:['fileDrop']" + ",";
				config += "tracks:[";
					config += "Genoverse.Track.Scalebar,";
					config += "Genoverse.Track.extend({name:'Sequence',controller:Genoverse.Track.Controller.Sequence,model:Genoverse.Track.Model.Sequence.Ensembl,view:Genoverse.Track.View.Sequence,100000:false,resizable:'auto'}),";
					config += "Genoverse.Track.Gene,";
					config += "Genoverse.Track.extend({name:'RegulatoryFeatures',url:'http://rest.ensembl.org/overlap/region/human/__CHR__:__START__-__END__?feature=regulatory;content-type=application/json',resizable:'auto',model:Genoverse.Track.Model.extend({dataRequestLimit:5000000}),setFeatureColor:function(f){f.color='#AAA';}}),";
					config += "Genoverse.Track.dbSNP";
					config += "]}";

				GenoverseService.load(config).then(function() {
					$log.info($window.Genoverse);
				});

			}
		};
	}
})();