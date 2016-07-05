(function() {
	'use strict';
	angular
		.module('TADkit')
		.directive('tkComponentPanelHicdata', tkComponentPanelHicdata);

	function tkComponentPanelHicdata($timeout) {
		return {
			restrict: 'EA',
			scope: { 
				id: '@',
				state: '=',
				view: '=',
				data: '=',
				settings:'='
			},
			templateUrl: 'assets/templates/panel-hicdata.html',
			link:function(scope, element, attrs){
				var data = scope.data;
				scope.rendered = false;
				scope.imageObject=new Image();
				//scope.restore_image = null;
				//scope.restore_data = null;
				//scope.restore_position = 0;
				var slidevalue = scope.slidevalue;
				
				scope.render = function(data_max, data_min) {
		            var canvas = document.getElementById("hic_canvas");
		            if (canvas.getContext) {
		                console.log("Drawing hic matrix");
		                var ctx = canvas.getContext("2d");
		                ctx.imageSmoothingEnabled = false;
		                ctx.mozImageSmoothingEnabled = false;
		                ctx.webkitImageSmoothingEnabled = false;
		                
		                //clear the canvas
		                ctx.clearRect(0,0, canvas.width, canvas.height);
		                
		                var val, x , y = 0;
		                var Logmin, Logmax = 0;
		                if(data.max !== 0) Logmax = Math.log(data.max);
		                if(data.min !== 0) Logmin = Math.log(data.min);
		                //var container_width = parseInt(scope.state.width);
		                //var container_height = parseInt(scope.state.height);
		                for(var i=0;i<data.value.length;i++) {
		                	x = Math.floor(data.pos[i]%data.n);
							y = Math.floor(data.pos[i]/data.n);
		                	if(x >= parseInt(canvas.width) && y >= parseInt(canvas.height)) {
		                		break; // avoid overflow
		                	}
		                	//if(x >= (container_width-scope.translatePos.x)/scope.scale && y >= (container_height-scope.translatePos.y)/scope.scale) break;
		                	if(x < parseInt(canvas.width) && y < parseInt(canvas.height)) {
		                		if(data.value[i]!==0) {
		                			//if(data.max<=1) val = Math.floor((Math.log(data.value[i])/Math.log(data.max))*5);
		                			//else 
		                			//val = Math.floor((Math.log(data.value[i])/Math.log(data.max))*255);
		                			if(data.value[i] <= data_max && data.value[i] >= data_min)
		                				val = Math.floor( ((Math.log(data.value[i])-Logmin)/(Logmax-Logmin))*255 );
		                			else
		                				val = 0;
		                		} else {
		                			val = 0;
		                		}
		                		ctx.fillStyle = "rgba(0,0,255,"+val/255+")";
		                		ctx.fillRect( x, y, 1 , 1 );
		                	}
		                }
		                var resolution, start_tad, end_tad = 0;
		                for(var i=0;i<data.tads.length;i++) {
		                	ctx.strokeStyle = "rgba(0,0,0,"+data.tads[i][3]/10+")";
		                	// assuming tads given always at 10k
		                	resolution = scope.settings.current.segmentLength*scope.settings.current.particleSegments; // base pairs
							start_tad = Math.round(((data.tads[i][1]-1)*10000-scope.settings.current.chromStart)/resolution);
		                	end_tad = Math.round((data.tads[i][2]*10000-scope.settings.current.chromStart)/resolution);
		                	
		                	ctx.strokeRect( start_tad, start_tad, end_tad-start_tad , end_tad-start_tad);
		                }
		                //scope.restore_image = ctx.getImageData(0, 0, canvas.width, canvas.height);
		                scope.scale = (canvas.width-10)/(Math.sqrt(2)*x);
		                scope.imageObject.src=canvas.toDataURL();
		                
		                scope.rendered = true;
		                scope.imageObject.onload = function () {
		                	scope.update();
		                };
		            }
		        };
		        scope.$watch('settings.current.particle', function(newParticle, oldParticle) {
					if ( newParticle !== oldParticle) {
						//scope.render();
						scope.update();
					}
				});
		        scope.$watch('settings.slidevalue', function(newvalue,oldvalue) {
		        	if ( newvalue !== oldvalue) {
		        		var slide_value = newvalue.split(";");
		        		var datamin = parseFloat(slide_value[0]);
		        		var datamax = parseFloat(slide_value[1]);
		        		var b = Math.log(10000)/(scope.data.max-0.001);
		        		var a = 10/Math.exp(b*scope.data.max);
		        		if(datamin!==0) datamin=Math.log(datamin/a)/b;
		        		if(datamax!==0) datamax=Math.log(datamax/a)/b;
		        		scope.render(scope.data.max-datamax,scope.data.max-datamin);
		        	}
				});

		        // UPDATE
				scope.update = function() {
					
					
	                if(!scope.rendered)	scope.render(data.max, data.min);
					var canvas = document.getElementById("hic_canvas");
		            if (canvas.getContext) {
		                var ctx = canvas.getContext("2d");
		                ctx.clearRect(0,0, canvas.width, canvas.height);
		                ctx.save();
		                //if(scope.restore_image!==null) {
		                	//ctx.putImageData(scope.restore_image,scope.translatePos.x, scope.translatePos.y);
		                //}
		                ctx.translate(0, canvas.height-10);
		                ctx.rotate(-Math.PI/4);
		                ctx.scale(scope.scale, scope.scale);
		                
		                ctx.drawImage(scope.imageObject,scope.translatePos.x/scope.scale,scope.translatePos.x/scope.scale);
		                //ctx.drawImage(scope.imageObject,scope.translatePos.x/scope.scale,scope.translatePos.y/scope.scale);
		                //ctx.translate(scope.translatePos.x/scope.scale, scope.translatePos.y/scope.scale);
		                var x = scope.settings.current.particle-1;
		                var y = scope.settings.current.particle-1;		                
		                if(x<1) {
		                	x=y=1;
		                }
		                if(x>=data.n-2) x=data.n-2;
		                //x = (x)*scope.scale+scope.translatePos.x;
		                //y = (y)*scope.scale+scope.translatePos.y;
		                //scope.restore_position = x-4;
		                //scope.restore_data = ctx.getImageData(x-4, x-4, 9, 9); 
		                //ctx.fillStyle = "rgba(0,0,0,1)";
            			//ctx.fillRect( x-2, y-2, 5 , 5 );
            			ctx.fillStyle = "rgba(255,255,255,1)";
            			x = x + scope.translatePos.x/scope.scale;
            			y = y + scope.translatePos.x/scope.scale;
            			ctx.fillRect( x-1, y-1, 3 , 3 );
		                
            			ctx.restore();
		            }
				};
				
				var canvas = document.getElementById("hic_canvas");
				scope.translatePos = {
					x: 0,
				    y: 0
				};
			 
			    scope.scale = 1.0;
				var scaleMultiplier = 0.8;
			    var startDragOffset = {};
			    var mouseDown = false;
			 
	
			    scope.increasezoom = function() {
			    	scope.scale /= scaleMultiplier;
			        scope.update();
			    };
			 
			    scope.reducezoom = function() {
			    	scope.scale *= scaleMultiplier;
			        scope.update();
			    };
			    
			    
			    // add event listeners to handle screen drag
			    canvas.addEventListener("mousedown", function(evt){
			        mouseDown = true;
			        startDragOffset.x = evt.clientX - scope.translatePos.x;
			        startDragOffset.y = evt.clientY - scope.translatePos.y;
			    });
			 
			    canvas.addEventListener("mouseup", function(evt){
			        mouseDown = false;
			    });
			 
			    canvas.addEventListener("mouseover", function(evt){
			        mouseDown = false;
			    });
			 
			    canvas.addEventListener("mouseout", function(evt){
			        mouseDown = false;
			    });
			 
			    canvas.addEventListener("mousemove", function(evt){
			        if (mouseDown) {
			            scope.translatePos.x = evt.clientX - startDragOffset.x;
			            scope.translatePos.y = evt.clientY - startDragOffset.y;
			            //scope.render();
			            scope.update();
			        }
			    });
				
			    $timeout(function () {
                    scope.update();
                });
			}
		};
	}
})();