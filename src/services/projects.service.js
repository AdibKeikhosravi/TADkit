(function() {
	'use strict';
	angular
		.module('TADkit')
		.factory('Projects', Projects);

	function Projects($q, $http, uuid4) {
		var projects = {
			loaded : [],
			current : {index:0}
		};

		return {
			load: function() {
				var deferral = $q.defer();
				var dataUrl = "assets/defaults/tk-defaults-projects.json";
				if( projects.loaded.length > 0 ) {
					deferral.resolve(projects);
				} else {
					$http.get(dataUrl)
					.then( function(data) {
						projects.loaded = data.data;
						console.log("Projects (" + data.data.length + ") loaded from " + dataUrl);
						deferral.resolve(projects);
					});
				}
				return deferral.promise;
			},
			add: function(details) {
				var newProject = {
					metadata : {
						version : 1.0,
						type : "project",
						generator : "TADkit"
					},
					object : {
						uuid : uuid4.generate(),
						id : details[0],
						title : details[1],
						description : details[2],
						group : details[3],
						state : details[4]
					},
					datasets : details[5],
					overlays : details[6],
					storyboards : details[7]
				};
				projects.loaded.push(newProject);
				projects.current = projects.loaded.length - 1;
				return projects;
			},
			remove: function(index) {
				if (index === undefined || index === false) index = users.current.index;
				var project = projects.loaded.indexOf(index);
				projects.loaded.splice(project, 1);
				return projects;
			},
			set: function(index) {
				if (index !== undefined || index !== false) projects.current.index = index;
				var current = projects.loaded[projects.current.index];
				return current;
			},
			get: function() {
				return projects;
			},
			getProject: function(index) {
				if (index === undefined || index === false) index = projects.current.index;
				var project = projects.loaded[index];
				return project;
			},
			getState: function(index) {
				if (index === undefined || index === false) index = projects.current.index;
				var state = projects.loaded[index].object.state;
				return state;
			}
		};
	}
})();