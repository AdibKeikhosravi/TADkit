(function() {
	'use strict';
	angular
		.module('TADkit')
		.directive('tkComponentScene', tkComponentScene);

<<<<<<< HEAD
	function tkComponentScene(Particles, Chromatin, Network, Settings, Networks, ColorConvert) {
=======
	function tkComponentScene($log, $rootScope, THREEService, THREEPlugins, Particles, Chromatin, Network) {
>>>>>>> upstream/develop
		return {
			restrict: 'EA',
			scope: { 
				type: '=',
				title: '@',
				settings: '=',
				view: '=',
				data: '=',
				layer: '=',
				state: '=',
				currentmodel: '=',
				proximities: '=',
				currentlayer: '='
			},
			templateUrl: 'assets/templates/scene.html',
			link: function postLink(scope, element, attrs) {
<<<<<<< HEAD
				// threeService.three().then(function(THREE) {
					// console.log(scope);

					var scene, component, viewport;
					var camera, cameraPosition, cameraTarget, cameraTranslate;
					var ambientLight, pointLight;
					var playback, controls, renderer;
					var particles, chromatin, network, spheres, ring;
					var particlesObj, chromatinObj, networkObj, sphereObj;
					//var raycaster, mouse;
					var width, height, contW, contH, windowHalfX, windowHalfY;

					var particleOriginalColor = new THREE.Color();
					var positionOriginalColor = new THREE.Color();
					var highlightColor = new THREE.Color("rgb(0,0,0)"); // add to scene component
					
					var cu;
					
					scope.init = function () {

						scope.complete_scene = function() {
							// GEOMETRY: PARTICLES
							scope.view.settings.particles.size = scope.settings.current.particleSize;
							particles = new Particles(scope.currentmodel.data, scope.currentoverlay.colors.particles, scope.view.settings.particles);
							// particles = new Particles(scope.model.data, scope.overlay.colors.particles, scope.view.settings.particles);
							particles.visible = scope.view.settings.particles.visible;
							scene.add(particles);

							//GEOMETRY: CHROMATIN
							scope.view.settings.chromatin.particleSegments = scope.settings.current.particleSegments;
							chromatin = new Chromatin(scope.currentmodel.data, scope.currentoverlay.colors.chromatin, scope.view.settings.chromatin);
							// chromatin = new Chromatin(scope.model.data, scope.overlay.colors.chromatin, scope.view.settings.chromatin);
							chromatin.visible = scope.view.settings.chromatin.visible;
							scene.add(chromatin);
							scope.view.settings.chromatin.radius = chromatin.boundingSphere.radius;

							if(scope.view.settings.chromatin.tubed) {

								var ringGeometry = new THREE.RingGeometry(6, 10, 50);
								//ringGeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
								ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color: 0x32cd32, side: THREE.DoubleSide}));
								ring.position.x = particles.geometry.vertices[0].x;
								ring.position.y = particles.geometry.vertices[0].y;
								ring.position.z = particles.geometry.vertices[0].z;
							
								scene.add(ring);

								spheres = new THREE.Object3D();
								var resolution = scope.settings.current.segmentLength*scope.settings.current.particleSegments; // base pairs
								var start_tad, end_tad, radius_cloud, centre_of_mass;
								for (var i = 0; i < scope.data.tad_data.tads.length; i++) {
									start_tad = Math.round(((scope.data.tad_data.tads[i][1])-scope.settings.current.chromStart)/resolution);
			                		end_tad = Math.round((scope.data.tad_data.tads[i][2]-scope.settings.current.chromStart)/resolution);
			                 		
			                 		centre_of_mass = new THREE.Vector3();
									for (var j = start_tad; j <= end_tad; j++) {
										centre_of_mass.add(particles.geometry.vertices[j]);
									}
									centre_of_mass.divideScalar(end_tad - start_tad + 1);
									radius_cloud = 0;
									for (j = start_tad; j <= end_tad; j++) {
										if(centre_of_mass.distanceTo(particles.geometry.vertices[j])>radius_cloud) 
											radius_cloud = centre_of_mass.distanceTo(particles.geometry.vertices[j]);
									}
									
									var sphereGeom =  new THREE.SphereGeometry( radius_cloud-10, 32, 16 );									
									var blueMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.3 } );									
									var sphere = new THREE.Mesh( sphereGeom, blueMaterial );
									sphere.material.emissive = new THREE.Color(0x000000);
								
									sphere.position.x = centre_of_mass.x;
									sphere.position.y = centre_of_mass.y;
									sphere.position.z = centre_of_mass.z;
									
									
									spheres.add(sphere);
									
									
								}
								spheres.name = "TADs cloud";
								scene.add(spheres);	
								sphereObj = scene.getObjectByName( "TADs cloud" );
								
								//raycaster = new THREE.Raycaster();
								//mouse = new THREE.Vector2();
								
								//viewport.addEventListener( 'click', onDocumentMouseDown, false );
								
							}
							// GEOMETRY: MESH
							// network = new Network(scope.proximities.positions, scope.proximities.distances, scope.view.settings.network);
							network = new Network(scope.data.data, scope.overlay.colors.network, scope.view.settings.network);
							network.visible = scope.view.settings.network.visible;
							scene.add(network);

						};
						// VIEWPORT
						/* component-controller == children[0]
						 * - component-header == children[0]
						 * - component-body == children[3]
						 */
						// component = element[0].parentNode;
						// console.log(component.clientWidth);
						viewport = element[0].children[0].children[3];
						// console.log(viewport.clientWidth);
						// if with controller use line below
						// viewport = element[0].children[0].children[3];

						// width = component.clientWidth; // NEED TO WAIT UNTIL DOM LOADED
						width = parseInt(scope.state.width); // USE UNTIL DOM CHECK AVAILBLE
						if(window.innerWidth <= 1280) width = 600;
						// height = component.clientHeight;
						height = parseInt(scope.state.height); // USE UNTIL DOM CHECK AVAILBLE
						// OJO! DOM NOT READY
						// console.log(element[0].firstChild.children[2].clientWidth);

						if (window.WebGLRenderingContext)
							renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
						else
							renderer = new THREE.CanvasRenderer({alpha: true});					
						var background = scope.view.settings.background;
						var clearColor = "0x" + background.substring(1);
						renderer.setClearColor( parseInt(clearColor) );
						renderer.setSize( width, height );
						renderer.autoClear = false; // To allow render overlay on top of sprited sphere
=======
				THREEPlugins.load(["TrackballControls","OrbitControls"]).then(function(THREE) {
					// DOM variables
					var component, viewport;
					var width, height, contW, contH, windowHalfX, windowHalfY;

					// THREE variables
					var renderer = THREEService.getRenderer();
					var animation;

					var scene;
					var camera, cameraPosition, cameraTarget, cameraTranslate;
					var ambientLight, pointLight;
					var autoplay, controls;

					// TADkit variables
					var particles, chromatin, network;
					var particleOriginalColor = new THREE.Color();
					var positionOriginalColor = new THREE.Color();
					var highlightColor = new THREE.Color("rgb(0,0,0)"); // add to scene component

					scope.init = function () {

						// VIEWPORT
						/* component = element[0].parentNode
						 * component-controller == element[0].children[0]
						 * - component-header == element[0].children[0].children[0]
						 * - component-body == element[0].children[0].children[3]
						 */
						
						viewport = element[0].children[0].children[3];

						// width = component.clientWidth; // NEED TO WAIT UNTIL DOM LOADED
						width = parseInt(scope.state.width); // USE UNTIL DOM CHECK AVAILBLE
						// height = component.clientHeight;
						height = parseInt(scope.state.height); // USE UNTIL DOM CHECK AVAILBLE
				
						var background = scope.view.settings.background;
						// var clearColor = "0x" + background.substring(1);
						// renderer.setClearColor( clearColor );
						renderer.setSize( width, height );
>>>>>>> upstream/develop
						viewport.appendChild( renderer.domElement );

						// SCENE
						scene = new THREE.Scene();

						// CAMERA
						camera = new THREE.PerspectiveCamera( scope.view.viewpoint.fov, ( width / height) , scope.view.viewpoint.near, scope.view.viewpoint.far );
						camera.position.fromArray(scope.view.viewpoint.camera);
						camera.name = "Scene Camera";
						scene.add(camera);
<<<<<<< HEAD
	
=======

>>>>>>> upstream/develop
						// CONTROLS
						// Use TrackballControls for interaction
						controls = new THREE.TrackballControls(camera, renderer.domElement);
						// Use OrbitControls for autoRotate
<<<<<<< HEAD
						playback = new THREE.OrbitControls(camera, renderer.domElement);
						playback.autoRotate = scope.view.controls.autoRotate;
						playback.autoRotateSpeed = scope.view.controls.autoRotateSpeed;
						// interaction FALSE so as not to conflict with controls
						playback.enableZoom = false;
						playback.enableRotate = false;
						playback.enablePan = false;
						playback.enableKeys = false;
						
=======
						autoplay = new THREE.OrbitControls(camera, renderer.domElement);
						autoplay.autoRotate = scope.view.controls.autoRotate;
						autoplay.autoRotateSpeed = scope.view.controls.autoRotateSpeed;
						// interaction FALSE so as not to conflict with controls
						autoplay.enableZoom = false;
						autoplay.enableRotate = false;
						autoplay.enablePan = false;
						autoplay.enableKeys = false;

>>>>>>> upstream/develop
						// AXIS
						// TODO: Make local axisHelper
						var axisHelper = new THREE.AxisHelper( scope.view.settings.axis.size );
						axisHelper.visible = scope.view.settings.axis.visible;
						axisHelper.name = "Axis";
						scene.add( axisHelper );

						// LIGHTS
						// Ambient
						var ambientColor = scope.view.settings.lighting.ambient;
						ambientLight = new THREE.AmbientLight(ambientColor);
						ambientLight.name = "Scene Ambient Light";
<<<<<<< HEAD
						scene.add(ambientLight);
						
						scope.complete_scene();
=======
						// scene.add(ambientLight);
						
						// GEOMETRY: PARTICLES
						particles = new Particles(scope.currentmodel.data, scope.currentlayer.colors.particles, scope.view.settings.particles);
						// particles = new Particles(scope.model.data, scope.layer.colors.particles, scope.view.settings.particles);
						particles.visible = scope.view.settings.particles.visible;
						scene.add(particles);

						//GEOMETRY: CHROMATIN
						chromatin = new Chromatin(scope.currentmodel.data, scope.currentlayer.colors.chromatin, scope.view.settings.chromatin);
						// chromatin = new Chromatin(scope.model.data, scope.layer.colors.chromatin, scope.view.settings.chromatin);
						chromatin.visible = scope.view.settings.chromatin.visible;
						scene.add(chromatin);
						scope.view.settings.chromatin.radius = chromatin.boundingSphere.radius;

						// GEOMETRY: MESH
						// network = new Network(scope.proximities.positions, scope.proximities.distances, scope.view.settings.network);
						network = new Network(scope.data, scope.layer.colors.network, scope.view.settings.network);
						network.visible = scope.view.settings.network.visible;
						scene.add(network);
>>>>>>> upstream/develop

						// UPDATE CAMERA TARGET
						cameraPosition = chromatin.boundingSphere.center;
						cameraTarget = chromatin.boundingSphere.center;
						cameraTranslate = chromatin.boundingSphere.radius * scope.view.viewpoint.scale;
						scope.lookAtTAD(cameraPosition, cameraTarget, cameraTranslate);

						// Point
						var pointColor = scope.view.settings.lighting.color;
						var pointIntensity = scope.view.settings.lighting.intensity;
						pointLight = new THREE.PointLight(pointColor, pointIntensity);
						pointLight.name = "Scene Light";
						camera.add(pointLight);
<<<<<<< HEAD
						var lightOffset = cameraTranslate * 1.5; // Up and to the left
						pointLight.position.set(lightOffset,lightOffset,(lightOffset * -1.0));
						//pointLight.position.set(lightOffset,lightOffset,(lightOffset * -1.0));
						// Point Light Helper
						var sphereSize = 1000;
						var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
						//scene.add(pointLightHelper);
=======
						var lightOffset = cameraTranslate * 0.5; // Up and to the left
						pointLight.position.set(lightOffset,lightOffset,(lightOffset * -1.0));
						// Point Light Helper
						var sphereSize = 100;
						var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
						// scene.add(pointLightHelper);
>>>>>>> upstream/develop
						
						// FOG SCENE
						var fogNear = cameraTranslate * scope.view.viewpoint.fogNear,
							fogFar = cameraTranslate * scope.view.viewpoint.fogFar;
						if (scope.view.viewpoint.fog) scene.fog = new THREE.Fog(background,fogNear,fogFar);

						// EVENT LISTENERS / SCOPE WATCHERS
						// window.addEventListener( 'resize', scope.onWindowResize, false );

						/* Watch for changes */

						// var componentOptions = [
						// 	 'view.settings.particles.visible',
						// 	 'view.settings.chromatin.visible',
						// 	 'view.controls.autoRotate',
						// 	 'view.settings.axis.visible'
						// 	 ];
						// scope.$watchGroup( componentOptions, function( newValues, oldValues ) {
						// 	angular.forEach( newValues, function(value, index) {
						// 		if ( newValues[index] !== oldValues[index] ) {
<<<<<<< HEAD
						// 			console.log( value );
						// 		}
						// 	});
						// });
						
=======
						// 			$log.debug( value );
						// 		}
						// 	});
						// });
>>>>>>> upstream/develop

					// FIX: NOT REDRAWING SCENE IF THE ONLY VISBLE OBJECT IS TOGGLED OFF
						scope.$watch('view.controls.autoRotate', function( newValue, oldValue ) {
							if ( newValue !== oldValue ) {
<<<<<<< HEAD
								// playback.autoRotate = !playback.autoRotate;
								playback.autoRotate = scope.view.controls.autoRotate;
=======
								// autoplay.autoRotate = !autoplay.autoRotate;
								autoplay.autoRotate = scope.view.controls.autoRotate;
>>>>>>> upstream/develop
							}
						});
						scope.$watch('view.settings.axis.visible', function( newValue, oldValue ) {
							if ( newValue !== oldValue ) {
								axisHelper.visible = !axisHelper.visible;
							}
						});
						scope.$watch('view.settings.particles.visible', function( newValue, oldValue ) {
							if ( newValue !== oldValue ) {
								particles.visible = !particles.visible;
							}
						});
						scope.$watch('view.settings.chromatin.visible', function( newValue, oldValue ) {
							if ( newValue !== oldValue ) {
								chromatin.visible = !chromatin.visible;
							}
						});
						scope.$watch('view.settings.network.visible', function( newValue, oldValue ) {
							if ( newValue !== oldValue ) {
								network.visible = !network.visible;
							}
						});
<<<<<<< HEAD

						particlesObj = scene.getObjectByName( "Particles Cloud" );
						chromatinObj = scene.getObjectByName( "Chromatin Fiber" );
						networkObj = scene.getObjectByName( "Network Graph" );
						

						// /* Watch for Particles colors */
						scope.$watch('currentoverlay.colors.particles', function( newColors, oldColors ) { // cant deep watch as change through set on service
							if ( newColors !== oldColors ) {
								// var particleCount = particlesObj.children.length;
								// for (var i = 0; i < particleCount; i++) {
								// 	var newParticleColor =  new THREE.Color(newOverlay.colors.particles[i]);
								// 	particlesObj.children[i].material.color = newParticleColor;
								// }
							}
						});

						// /* Watch for Chromatin colors */
						scope.$watch('currentoverlay.colors.chromatin', function( newColors, oldColors ) { // cant deep watch as change through set on service
							if ( newColors !== oldColors ) {
//								if(scope.view.settings.chromatin.tubed && scope.currentoverlay.object.state.overlaid) {
//									scope.toggleTubed(false);
//								} 
//								if(!scope.view.settings.chromatin.tubed && !scope.currentoverlay.object.state.overlaid) {
//									scope.toggleTubed(true);
//								}
								var i,j,newChromatinColor;
								var chromatinCount = chromatinObj.children.length;
								if(!scope.view.settings.chromatin.tubed) {
									chromatinCount = chromatinObj.children.length;
									for (i = 0; i < chromatinCount; i++) {
										newChromatinColor =  new THREE.Color(newColors[i]);
										chromatinObj.children[i].material.color = newChromatinColor;
										chromatinObj.children[i].material.ambient = newChromatinColor;
										chromatinObj.children[i].material.emissive = newChromatinColor;
									}
								} else {
									for (i = 0; i < newColors.length; i++) {
										if(ColorConvert.testIfHex(newColors[i]) || newColors[i].indexOf('#')===0) {
											newChromatinColor =  new THREE.Color(newColors[i]);	 
										} else {
											newChromatinColor =  new THREE.Color(ColorConvert.nameToHex(newColors[i]));
										} 
										for (j = 0; j < 16; j++) {
											chromatinObj.children[0].geometry.faces[i*16+j].color.set(newChromatinColor);
										}
									}
									chromatinObj.children[0].geometry.colorsNeedUpdate = true;
								}
							}
						});
						scope.toggleTubed = function(tubed) {
							scope.clean_scene();
							scope.view.settings.chromatin.tubed = tubed;
						    scope.complete_scene();
						    if(scope.view.settings.chromatin.tubed) {
						        sphereObj = scene.getObjectByName( "TADs cloud" );
							}
							
							particlesObj = scene.getObjectByName( "Particles Cloud" );
							chromatinObj = scene.getObjectByName( "Chromatin Fiber" );
							networkObj = scene.getObjectByName( "Network Graph" );
						};
						// /* Watch for selected TAD */
						scope.$watch('settings.current.tad_selected', function( newValue, oldValue ) {
							//if(scope.view.settings.chromatin.tubed) return;
							if ( newValue !== oldValue ) {
								var i;
								if(scope.view.settings.chromatin.tubed) {
									var tadCount = sphereObj.children.length;
									var newColor = new THREE.Color( 0xff0000 );
									var oldColor = new THREE.Color( 0x000000 );
									for (i = 0; i < tadCount; i++) {
										if(i==scope.settings.current.tad_selected) {
											sphereObj.children[i].material.opacity = 0.2;
											sphereObj.children[i].material.emissive.set( newColor );
											
										} else {
											if(newValue == -1) {
												sphereObj.visible = false;
											} else {
												sphereObj.children[i].material.opacity = 0.3;
												sphereObj.children[i].material.color.set(oldColor);
												sphereObj.children[i].material.emissive.set(oldColor);
											}
										}
										sphereObj.children[i].geometry.colorsNeedUpdate = true;
										
									}
									
								} else {
									var chromatinCount = chromatinObj.children.length;
									var start_tad, end_tad;
									var resolution = scope.settings.current.segmentLength*scope.settings.current.particleSegments; // base pairs
									if(newValue>-1) {
										start_tad = (Math.round(((scope.data.tad_data.tads[newValue][1])-scope.settings.current.chromStart)/resolution))*scope.settings.current.particleSegments;
				                		end_tad = (Math.round((scope.data.tad_data.tads[newValue][2]-scope.settings.current.chromStart)/resolution))*scope.settings.current.particleSegments;
				                 	}
									for (i = 0; i < chromatinCount; i++) {
										if(i>=start_tad && i<=end_tad) {
											chromatinObj.children[i].material.opacity = 1;
										} else {
											if(newValue == -1) chromatinObj.children[i].material.opacity = 1;
											else chromatinObj.children[i].material.opacity = 0.5;
										}
										
									}
								}
							}
						});

						// /* Watch for Network colors */
						scope.$watch('currentoverlay.colors.network', function( newColors, oldColors ) { // cant deep watch as change through set on service
							if ( newColors !== oldColors && networkObj.geometry) {
								networkObj.geometry.addAttribute( 'color', new THREE.BufferAttribute( newColors.RGB, 3 ) );
								networkObj.geometry.addAttribute( 'alpha', new THREE.BufferAttribute( newColors.alpha, 1 ) );
							}
						});

						/* Watch for Browser-wide Position updates */
						scope.$watch('settings.current.particle', function( newParticle, oldParticle ) {
							if ( newParticle !== oldParticle && particlesObj) {
								// SET PARTICLE CURSOR COLOR
								if (particleOriginalColor) particlesObj.geometry.colors[(oldParticle - 1)] = particleOriginalColor;
								particleOriginalColor = particlesObj.geometry.colors[(newParticle - 1)];
								particlesObj.geometry.colors[(newParticle - 1)] = highlightColor;
								particlesObj.geometry.colorsNeedUpdate = true;
							}
						});

						/* Watch for Browser-wide Position updates */
						scope.$watch('settings.current.segment', function( newSegment, oldSegment ) {
							if ( newSegment !== oldSegment ) {
								//if(scope.view.settings.chromatin.tubed) return;
								if(scope.view.settings.chromatin.tubed) {
									if(chromatinObj.children[0].geometry.vertices.length > (newSegment+1)*8+8) {
										var vec, i;
										vec = chromatinObj.children[0].geometry.vertices[(newSegment+1)*8];
										
											for(i=1;i<8;i++){
												vec.add(chromatinObj.children[0].geometry.vertices[(newSegment+1)*8+i]);
											}
											vec.divideScalar(8);
										
										
										ring.position.x = vec.x;
										ring.position.y = vec.y;
										ring.position.z = vec.z;
										
										vec = chromatinObj.children[0].geometry.vertices[oldSegment*8];
										for(i=1;i<8;i++){
											vec.add(chromatinObj.children[0].geometry.vertices[oldSegment*8+i]);
										}
										vec.divideScalar(8);
										ring.lookAt(vec);
									}
									return;
								}
								// SET CHROMATIN CURSOR COLOR

								var segmentPrevious = chromatinObj.getObjectByName( "segment-" + oldSegment );
								if (positionOriginalColor && segmentPrevious) {
									segmentPrevious.material.color = positionOriginalColor;
									segmentPrevious.material.ambient = positionOriginalColor;
									segmentPrevious.material.emissive = positionOriginalColor;
								}

								var segmentCurrent = chromatinObj.getObjectByName( "segment-" + newSegment );
								if(segmentCurrent) {
									positionOriginalColor = segmentCurrent.material.color;

									segmentCurrent.material.color = highlightColor;
									segmentCurrent.material.ambient = highlightColor;
									segmentCurrent.material.emissive = highlightColor;
								}
							}
						});

					};

					// -----------------------------------
					// Event listeners
					// -----------------------------------
					
=======

						// /* Watch for Particles colors */
						// scope.$watch('currentlayer.colors.particles', function( newColors, oldColors ) { // cant deep watch as change through set on service
						// 	if ( newColors !== oldColors ) {
						// 		// var particleCount = particles.children.length;
						// 		// for (var i = 0; i < particleCount; i++) {
						// 		// 	var newParticleColor =  new THREE.Color(newLayer.colors.particles[i]);
						// 		// 	particles.children[i].material.color = newParticleColor;
						// 		// }
						// 	}
						// });

						// /* Watch for Chromatin colors */
						scope.$watch('currentlayer.colors.chromatin', function( newColors, oldColors ) { // cant deep watch as change through set on service
							if ( newColors !== oldColors ) {
								var chromatinCount = chromatin.children.length;
								for (var i = 0; i < chromatinCount; i++) {
									var newChromatinColor =  new THREE.Color(newColors[i]);
									chromatin.children[i].material.color = newChromatinColor;
									chromatin.children[i].material.emissive = newChromatinColor;
								}
							}
						});

						// /* Watch for Network colors */
						scope.$watch('currentlayer.colors.network', function( newColors, oldColors ) { // cant deep watch as change through set on service
							if ( newColors !== oldColors ) {
								network.geometry.addAttribute( 'color', new THREE.BufferAttribute( newColors.RGB, 3 ) );
								network.geometry.addAttribute( 'alpha', new THREE.BufferAttribute( newColors.alpha, 1 ) );
							}
						});

						/* Watch for Browser-wide Position updates */
						scope.$watch('settings.current.particle', function( newParticle, oldParticle ) {
							if ( newParticle !== oldParticle ) {

								// SET PARTICLE CURSOR COLOR
								if (particleOriginalColor) particles.geometry.colors[(oldParticle - 1)] = particleOriginalColor;
								particleOriginalColor = particles.geometry.colors[(newParticle - 1)];
								particles.geometry.colors[(newParticle - 1)] = highlightColor;
								particles.geometry.colorsNeedUpdate = true;
							}
						});

						/* Watch for Browser-wide Position updates */
						scope.$watch('settings.current.segment', function( newSegment, oldSegment ) {
							if ( newSegment !== oldSegment ) {

								// SET CHROMATIN CURSOR COLOR								
								var segmentPrevious = chromatin.getObjectByName( "segment-" + oldSegment );
								if (positionOriginalColor) {
									segmentPrevious.material.color = positionOriginalColor;
									segmentPrevious.material.emissive = positionOriginalColor;
								}

								var segmentCurrent = chromatin.getObjectByName( "segment-" + newSegment );
								positionOriginalColor = segmentCurrent.material.color;

								segmentCurrent.material.color = highlightColor;
								segmentCurrent.material.emissive = highlightColor;
							}
						});

					};

					// -----------------------------------
					// Event listeners
					// -----------------------------------
>>>>>>> upstream/develop
					scope.onWindowResize = function () {
						scope.resizeCanvas();
					};

<<<<<<< HEAD
=======
					$rootScope.$on('$stateChangeStart', function() {
						// cancelAnimationFrame( animation );
						$log.info("$stateChangeStart");
					});
					$rootScope.$on('$stateNotFound', function() {
						$log.warn("$stateNotFound");
					});
					$rootScope.$on('$stateChangeSuccess', function() {
						$log.info("$stateChangeSuccess");
					});
					$rootScope.$on('$stateChangeError', function() {
						$log.warn("$stateChangeError");
					});
					// element.on('mousemove', function(event) {
					// 	// mouseX = ( event.clientX - width / 2 );
					// 	// mouseY = ( event.clientX - width / 2 );
					// 	scope.animate();
					// });

>>>>>>> upstream/develop
					// -----------------------------------
					// Updates
					// -----------------------------------
					scope.resizeCanvas = function () {

						contW = viewport.parentNode.clientWidth * 0.66;
						contH = contW * 0.66;
						windowHalfX = contW / 2;
						windowHalfY = contH / 2;

						camera.aspect = contW / contH;
						camera.updateProjectionMatrix();

						renderer.setSize( contW, contH );
					};

					scope.lookAtTAD = function (position, target, translate) {
<<<<<<< HEAD
							position = position || new THREE.Vector3( 50000, 50000, 50000 );
							var origin = new THREE.Vector3(0,0,0);
							target = target || origin;
							translate = translate || 500;
							// Target on Origin and Translate back
							// (creates consistent view orientation)
							camera.position.set(position.x, position.y, position.z);
							camera.lookAt(origin);
							camera.translateZ(translate);
							// Retarget on target
							camera.lookAt(target);
							camera.updateMatrixWorld();
							// Controls target
							controls.target.copy(position);
=======
						position = position || new THREE.Vector3( 50000, 50000, 50000 );
						var origin = new THREE.Vector3(0,0,0);
						target = target || origin;
						translate = translate || 500;
						// Target on Origin and Translate back
						// (creates consistent view orientation)
						camera.position.set(position.x, position.y, position.z);
						camera.lookAt(origin);
						camera.translateZ(translate);
						// Retarget on target
						camera.lookAt(target);
						camera.updateMatrixWorld();
						// Controls target
						controls.target.copy(position);
>>>>>>> upstream/develop
					};

					// -----------------------------------
					// Draw and Animate
					// -----------------------------------
					scope.animate = function () {
<<<<<<< HEAD
						requestAnimationFrame( scope.animate );
						playback.update();
=======
						animation = requestAnimationFrame( scope.animate );
						// autoplay.update();
>>>>>>> upstream/develop
						controls.update();
						scope.render();
					};

					scope.render = function () {
<<<<<<< HEAD
						renderer.render( scene, camera );
					};

					scope.clean_scene = function () {
						var i;

						scene.remove(particles);
				        scene.remove(chromatin);
				        scene.remove(network);
				        scene.remove(particlesObj);
				        scene.remove(chromatinObj);
				        scene.remove(networkObj);
				        
				        particles.geometry.dispose();
				        particles.material.dispose();
				        particlesObj.geometry.dispose();
				        particlesObj.material.dispose();
				        
				        if(!scope.view.settings.chromatin.tubed) {
									
					        for(i=0;i<chromatin.children.length;i++) {
					        	chromatin.children[i].geometry.dispose();
					        	chromatin.children[i].material.dispose();
					        	chromatinObj.children[i].geometry.dispose();
					        	chromatinObj.children[i].material.dispose();
					        	
					        }
					    } else {
					    	scene.remove(spheres);
					    	scene.remove(sphereObj);
					    	for(i=0;i<spheres.children.length;i++) {
					        	spheres.children[i].geometry.dispose();
					        	spheres.children[i].material.dispose();
					        	sphereObj.children[i].geometry.dispose();
					        	sphereObj.children[i].material.dispose();
					        	
					        }
					        spheres = undefined;
					        sphereObj = undefined;
					    }
				        for(i=0;i<network.children.length;i++) {
				        	network.children[i].geometry.dispose();
				        	network.children[i].material.dispose();
				        	networkObj.children[i].geometry.dispose();
				        	networkObj.children[i].material.dispose();
				        	
				        }     
				        
				        particles = undefined;
				        particlesObj = undefined;
				        chromatinObj = undefined;
				        chromatin = undefined;
				        network = undefined;
				        networkObj = undefined;
				        
					};
				    scope.$on('$destroy', function() {
				        scope.clean_scene();
				    });


					/*function onDocumentMouseDown( event ) {

						event.preventDefault();
						mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
						mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
						raycaster.setFromCamera( mouse, camera );
						var intersects = raycaster.intersectObjects(array_spheres);
						if ( intersects.length > 0 ) {
							intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

						}
					}*/
				    
					// Begin
					scope.init();
					scope.animate();
				// });
=======
						renderer.render( scene, camera, null, true ); // forceClear == true
					};

					// Begin
					scope.init();
					scope.animate();
				});
>>>>>>> upstream/develop
			}
		};
	}
})();
