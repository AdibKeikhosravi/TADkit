(function() {
	'use strict';
	angular
		.module('TADkit')
		.factory('Datasets', Datasets);

	function Datasets($q, $http, uuid4, Settings, Proximities, Restraints, Overlays) {
		var datasets = {
			loaded : [],
			current : {
				index : 0,
				cluster : 1,
				centroid : 1
			}
		};
		return {
			load: function(filename, clear) {
				filename = filename || "chrX_1559_1660"; //"tk-defaults-dataset";
				clear = clear || false;

				var self = this;
				if (clear) self.clear();

				var datapath = "defaults";
				if (filename != "tk-defaults-dataset") datapath = "examples";

				var deferral = $q.defer();
				var dataUrl = "assets/" + datapath + "/" + filename + ".json";
				$http.get(dataUrl)
				.success( function(dataset) {
					// TADkit defaults and examples are already validated
					dataset.object.filename = filename;
					self.add(dataset);
					deferral.resolve(datasets);
				});
				return deferral.promise;
			},
			validate: function(data) {
				var validation = true;
				var validJSON = JSON.parse(data);
				// ADD LOGIC...
				// check structure
				// check content type
				var validDataset = validJSON;
				if (validation) {
					return validDataset;
				} else {
					// give error message
					// return to Project Loader page
				}
			},
			add: function(dataset) { // rename import?
				/* CHECK DATASET IS VALID */
				var self = this;
				// var uuid = dataObj.uuid || uuid4.generate(),
				// if (!projects.default.datasets[uuid]) {
					datasets.loaded.push(dataset);
					datasets.current.index = datasets.loaded.length - 1;
					self.setSpeciesUrl();
					self.setRegion();
					self.init(dataset);
					console.log("Dataset " + dataset.object.species + " " + dataset.object.region + " loaded from file.");
				// }
				return datasets;
			},
			init: function(dataset) {
				var self = this;
				// var dataset = self.getDataset();
				var data = self.getModel().data;
				Settings.set(dataset);
				Proximities.set(data);
				Restraints.set(data, dataset.restraints);
				Overlays.update(Proximities.get().distances, dataset.restraints);
				Overlays.import(dataset.object.filename, "tsv", true);
				console.log("Settings, Proximities, Restraints & Overlays updated.");
			},
			clear: function() {
				while (datasets.loaded.length > 0) {
					datasets.loaded.shift();
				}
			},
			remove: function(index) {
				if (index === undefined || index === false) index = datasets.current.index;
				var dataset = datasets.loaded.indexOf(index);
				datasets.loaded.splice(dataset, 1);
				return datasets;
			},
			setSpeciesUrl: function(index) {
				if (index === undefined || index === false) index = datasets.current.index;
				var species = datasets.loaded[index].object.species;
				var speciesUrl = species.replace(/[^a-z0-9]/gi, '_').toLowerCase();
				datasets.loaded[index].object.speciesUrl = speciesUrl;
				return speciesUrl;
			},
			setRegion: function(index) {
				if (index === undefined || index === false) index = datasets.current.index;
				var chromosomeIndex = 0;
				if (datasets.loaded[index].object.chromosomeIndex) {
					chromosomeIndex = datasets.loaded[index].object.chromosomeIndex;	
				}
				var chrom = datasets.loaded[index].object.chrom[chromosomeIndex];
				var chromStart = datasets.loaded[index].object.chromStart[chromosomeIndex];
				var chromEnd = datasets.loaded[index].object.chromEnd[chromosomeIndex];
				var region = chrom + ":" + chromStart + "-" + chromEnd;
				datasets.loaded[index].object.region = region;
				return region;
			},
			set: function(index) {
				if (index !== undefined || index !== false) datasets.current.index = index;
				this.setCluster(datasets.current.cluster); // need to determine which cluster is current?
				var dataset = datasets.loaded[datasets.current.index];
				return dataset;
			},
			setCluster: function(ref) { // from cluster ref
				ref = ref || 1; // from ref or just set as the first cluster
				datasets.current.cluster = ref;
				var clusterCentroid = this.getCentroid(datasets.current.cluster);
				this.setCentroid(clusterCentroid);
				var cluster = this.getCluster();
				return cluster; // array of model indices
			},
			setCentroid: function(ref) { // from model ref
				ref = ref || this.getCentroid(); // from ref or from current cluster
				datasets.current.centroid = ref;
				var centroid = this.setModel(datasets.current.centroid);
				return centroid; // array of vertices
			},
			setModel: function(ref) { // from model ref
				ref = ref || this.getCentroid();
				var model = this.getModel(ref - 1);
				// Store as current model for dataset in datasets.loaded[datasets.current.index].data
				datasets.loaded[datasets.current.index].data = model;
				return model; // array of vertices
			},
			get: function() {
				return datasets;
			},
			getDataset: function(index) {
				if (index === undefined || index === false) index = datasets.current.index;
				var dataset = datasets.loaded[index];
				return dataset;
			},
			getCluster: function(ref) { // from cluster ref
				ref = ref || datasets.current.cluster;
				var cluster = datasets.loaded[datasets.current.index].clusters[ref - 1];
				return cluster; // array of model refs
			},
			getCentroid: function(ref) { // from cluster ref (NOT model ref)
				ref = ref || datasets.current.cluster;
				var centroid = datasets.loaded[datasets.current.index].centroids[ref - 1];
				return centroid; // single model ref
			},
			getModel: function(ref) { // from model ref
				ref = ref || this.getCentroid();
				var model, models = datasets.loaded[datasets.current.index].models;
				for (var i = models.length - 1; i >= 0; i--) {
					if (models[i].ref == ref) model = models[i];
				}
				return model; // array of model vertices
			}
		};
	}
})();