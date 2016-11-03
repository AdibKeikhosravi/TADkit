(function() {
	'use strict';
	angular
		.module('TADkit')
		.directive('tkComponentSceneFloatingtad', tkComponentSceneFloatingtad);

	function tkComponentSceneFloatingtad() {
		return {
			restrict: 'EA',
			link: function(scope, element, attrs) {
<<<<<<< HEAD
				var viewport, viewsize, camera, scene, renderer, geometry, material, network, controls;
				init();
				animate();
				function init() {
					viewport =  element[0];
					viewsize = viewport.clientWidth;

					scene = new THREE.Scene();

					camera = new THREE.PerspectiveCamera( 50, 1, 150, 650 );
					camera.position.z = 500;
					scene.add(camera);

					geometry = new THREE.TorusKnotGeometry( 100, 30, 100, 16 );

					// GENERATE TEST GEOMETRY
					// var torusgeom = new THREE.TorusKnotGeometry( 100, 10, 36, 1 );
					// var testgeom = torusgeom.vertices;
					// for (var i = testgeom.length - 1; i >= 0; i--) {
					// 	testgeom[i].x = parseInt(testgeom[i].x.toFixed(2));
					// 	testgeom[i].y = parseInt(testgeom[i].y.toFixed(2));
					// 	testgeom[i].z = parseInt(testgeom[i].z.toFixed(2));
					// };
					// console.log(JSON.stringify(testgeom));

					material = new THREE.MeshDepthMaterial({
						wireframe: true,
						wireframeLinewidth: 1
					});

					network = new THREE.Mesh( geometry, material );
					network.name = "Floating TAD";
					scene.add(network);

					if (window.WebGLRenderingContext)
 						renderer = new THREE.WebGLRenderer({alpha: true});
 					else
						renderer = new THREE.CanvasRenderer({alpha: true});
						
					renderer.setSize( viewsize, viewsize );
					viewport.appendChild( renderer.domElement );

					controls = new THREE.TrackballControls( camera, renderer.domElement );
					controls.minDistance = 450;
					controls.maxDistance = 550;

				}
				function animate() {
					requestAnimationFrame(animate);
				controls.update();
					render();
				}
				function render() {
					network.rotation.x += 0.006;
					network.rotation.y += 0.006;
					renderer.render(scene, camera);
				}
=======
				THREEPlugins.load(["TrackballControls","OrbitControls"]).then(function(THREE) {
					var container, viewsize, camera, scene;
					var geometry, material, network, controls;
					var renderer = THREEService.getRenderer();
					var animation;

					scope.init = function() {
						container =  element[0];
						viewsize = container.clientWidth;

						renderer.setSize( viewsize, viewsize );
						container.appendChild( renderer.domElement );

						scene = new THREE.Scene();

						camera = new THREE.PerspectiveCamera( 50, 1, 300, 900 );
						camera.position.z = 500;
						scene.add(camera);

						geometry = new THREE.TorusKnotGeometry( 100, 30, 100, 16 );

						material = new THREE.MeshDepthMaterial({
 							wireframe: true,
							// wireframeLinewidth: 1
						});

						network = new THREE.Mesh( geometry, material );
						network.name = "Floating TAD";
						scene.add(network);
							
						// controls = new THREE.TrackballControls( camera, renderer.domElement );
						// controls.minDistance = 450;
						// controls.maxDistance = 550;

					};

					// -----------------------------------
					// Event listeners
					// -----------------------------------
					$rootScope.$on('$stateChangeStart', function() {
						cancelAnimationFrame( animation );
					});

					// -----------------------------------
					// Draw and Animate
					// -----------------------------------
					scope.animate = function() {
						animation = requestAnimationFrame( scope.animate );
						// controls.update();
						scope.render();
					};

					scope.render = function() {
						network.rotation.x += 0.006;
						network.rotation.y += 0.006;
						renderer.render( scene, camera, null, true ); // forceClear == true
					};

					scope.init();
					scope.animate();
				});
>>>>>>> upstream/develop
			}
		};
	}
})();