(function() {
	'use strict';
	angular
		.module('TADkit')
		.factory('Network', Network);

	// create one line between each pair in dataset
	function Network(VERBOSE, $log, Color, Particles, Networks) {
		return function(data, layer, settings) {
			if (VERBOSE) $log.debug(data);
			if (VERBOSE) $log.debug(layer);

			// Uses THREE.LineSegments to generate separate lines
			// from an array of vertex pairs

			var defaults = {
				color: "#ff0000",
				size: 200,
				opacity: 0.8,
				map: "assets/img/sphere-glossy.png",
				depthtest: true,
				alphatest: 0.5,
				transparent: true,
				visible: false
			};	
			settings = settings || {};
			angular.extend(this, angular.copy(defaults), settings);

			// Define a color-typed uniform
			var uniforms = {  
				color: { type: "c", value: new THREE.Color( 0x00ff00 ) },
				alpha: { type: "f", value: 1.0 }
			};
			//var attributes = {  
			//	alpha: { type: 'f', value: [] }
			//};
			var parameters = {
				uniforms: uniforms,
<<<<<<< HEAD
				//attributes: attributes,
=======
				// attributes: attributes,
>>>>>>> upstream/develop
				vertexShader: document.getElementById('vertexShader').textContent,
				fragmentShader: document.getElementById('fragmentShader').textContent,
				vertexColors: THREE.VertexColors,
				// side: THREE.DoubleSide,
				// blending: THREE.AdditiveBlending, // black is transparent
				transparent: true //this.transparent
			};
			var shaderMaterial = new THREE.ShaderMaterial(parameters);
			shaderMaterial.linewidth = 1;

			var dataLength = data.length / 3;
			var totalPairs = ((dataLength * dataLength) - dataLength) * 0.5;

			var vertexPairs = getVertexPairs(data, totalPairs);
			var vertexRGB = layer.RGB;
			var vertexAlpha = layer.alpha;

			var geometry = new THREE.BufferGeometry();
			geometry.addAttribute( 'position', new THREE.BufferAttribute( vertexPairs, 3 ) );
			geometry.addAttribute( 'color', new THREE.BufferAttribute( vertexRGB, 3 ) );
			geometry.addAttribute( 'alpha', new THREE.BufferAttribute( vertexAlpha, 1 ) );
			geometry.center();
			geometry.computeBoundingSphere();

			var nodeMap = null; // render only point
			if (this.map) {
				var loader = new THREE.TextureLoader();
<<<<<<< HEAD
				nodeMap = loader.load(this.map);
			}
			
=======
				loader.load(
					this.map,
					function ( texture ) {
						nodeMap = texture;
					},
					// Function called when download progresses
					function ( xhr ) {
						$log.debug( (xhr.loaded / xhr.total * 100) + '% loaded' );
					},
					// Function called when download errors
					function ( xhr ) {
						$log.error( 'An error happened' );
					}
				);
			}

>>>>>>> upstream/develop
			var nodesMaterial = new THREE.PointsMaterial({
				color: this.color,
    			vertexColors: THREE.VertexColors,
				size: this.size,
				opacity: this.opacity,
				map: nodeMap,
				depthTest: this.depthtest,
				alphaTest: this.alphatest,
				transparent: this.transparent
			});

			// NETWORK
<<<<<<< HEAD
			var particlesGeometry = getGeometry(data);
			particlesGeometry.center();
			particlesGeometry.computeBoundingSphere();
			var vertexColors = [];
			for( var i = 0; i < particlesGeometry.vertices.length; i++ ) {
				// BASE COLOR
				vertexColors[i] = new THREE.Color("rgb(255,255,255)");
			}
			particlesGeometry.colors = vertexColors;
			var nodes = new THREE.Points(particlesGeometry, nodesMaterial);
			nodes.name = "Network Nodes";
			
			//var edges = new THREE.Line(geometry, shaderMaterial, THREE.LinePieces); // THREE.LinePieces = separate lines
			//var material = new THREE.LineBasicMaterial({
			//    color: 0x000000
			//});
			var edges = new THREE.LineSegments( geometry, shaderMaterial );
			edges.name = "Network Edges";

			var network = new THREE.Object3D();
			network.add(edges);
			network.add(nodes);
			network.boundingSphere = geometry.boundingSphere;
			//var network = new THREE.Line(geometry, shaderMaterial, THREE.LinePieces); // THREE.LinePieces = separate lines
			//var network = new THREE.LineSegments( geometry, shaderMaterial );
=======
			// var nodes = new THREE.Points(data, nodesMaterial);
			// nodes.name = "Network Nodes";
			
			// var edges = new THREE.LineSegments(geometry, shaderMaterial);
			// edges.name = "Network Edges";

			// var network = new THREE.Object3D();
			// network.add(edges);
			// network.add(nodes);
			// network.boundingSphere = geometry.boundingSphere;
			var network = new THREE.LineSegments(geometry, shaderMaterial);
>>>>>>> upstream/develop
			network.name = "Network Graph";
			if (VERBOSE) $log.debug(network);
			return network;
		};
	}

	function getVertexPairs($log, data, totalPairs) {
		// from an array of vertex pairs
		// eg. [x1,y1,z1,x2,y2,z2,x3,y3,z3,...xn,yn,zn]
		// to a matrix of all-to-all connections
		// eg. [x1,y1,z1,x2,y2,z2,x1,y1,z1,x3,y3,z3,...xn,yn,zn,xm,ym,zm]
		// such that all point pairs are represented uniquely
		// ie. one half of matrix where array length = (n^2-n)/2
		// eg.  1 2 3 4
		//     1  x x x  ==  1-2 1-3 1-4    3
		//     2    x x  ==  2-3 2-4      + 2
		//     3      x  ==  3-4          + 1
		//     4         ==  ((4*4)-4)*0.5  = 6 pairs of vertices
		var vertexPairs = new Float32Array( totalPairs * 6); // 6 ie. 2 * xyz
		var pairPos = 0;
		for (var i = 0; i < data.length; i += 3) {
			var vertex1 = i;
			for (var j = i + 3; j < data.length; j += 3) {
				var vertex2 = j;
				$log.debug(pairPos);
				$log.debug(data[vertex1]+","+data[vertex1+1]+","+data[vertex1+2]);
				$log.debug(data[vertex2]+","+data[vertex2+1]+","+data[vertex2+2]);
				// from vertex
				vertexPairs[pairPos] = data[vertex1]; pairPos++;
				vertexPairs[pairPos] = data[vertex1 + 1]; pairPos++;
				vertexPairs[pairPos] = data[vertex1 + 2]; pairPos++;
				// to vertex
				vertexPairs[pairPos] = data[vertex2]; pairPos++;
				vertexPairs[pairPos] = data[vertex2 + 1]; pairPos++;
				vertexPairs[pairPos] = data[vertex2 + 2]; pairPos++;
			}
		}
		vertexPairs.name = "Network Vertex Pairs";
		return vertexPairs;
	}
	function getGeometry(data) {
		var offset = 0, vertex,
			 vertexGeometry = new THREE.Geometry();
		var totalVertices = data.length;
		while ( offset < totalVertices ) {
			vertex = new THREE.Vector3();
			vertex.x = data[ offset ++ ];
			vertex.y = data[ offset ++ ];
			vertex.z = data[ offset ++ ];
			vertexGeometry.vertices.push( vertex );
		}
		vertexGeometry.name = "Particles Geometry";
		return vertexGeometry;
	}

})();