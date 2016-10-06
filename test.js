var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');
var program;
var boxTexture;


var vertexShaderText =
	[
	'precision mediump float;',
	'',
	'attribute vec3 vertPosition;',
	'uniform vec3 vertColor;',
	'varying vec3 fragColor;',
	'uniform mat4 mWorld;',
	'uniform mat4 mView;',
	'uniform mat4 mProj;',
	'',
	'void main()',
	'{',
	' fragColor=vertColor;',
	' gl_Position =mProj * mView * mWorld * vec4(vertPosition,1.0);',
	' gl_PointSize = 1.0;',
	'}'

].join('\n');

var fragmentShaderText =
	[
	'precision mediump float;',
	'',
	'varying vec3 fragColor;',
	'uniform sampler2D sampler;',
	'void main()',
	'{',
	' gl_FragColor = vec4(fragColor,1.0);',
	'}'

].join('\n');
//create cube object

	var boxVert =
		[// X, Y, Z
		// Top
		-1.0, 1.0, -1.0,
		-1.0, 1.0, 1.0,
		1.0, 1.0, 1.0,
		1.0, 1.0, -1.0,

		// Left
		-1.0, 1.0, 1.0,
		-1.0, -1.0, 1.0,
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,

		// Right
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,
		1.0, 1.0, -1.0,

		// Front
		1.0, 1.0, 1.0,
		1.0, -1.0, 1.0,
		-1.0, -1.0, 1.0,
		-1.0, 1.0, 1.0,

		// Back
		1.0, 1.0, -1.0,
		1.0, -1.0, -1.0,
		-1.0, -1.0, -1.0,
		-1.0, 1.0, -1.0,

		// Bottom
		-1.0, -1.0, -1.0,
		-1.0, -1.0, 1.0,
		1.0, -1.0, 1.0,
		1.0, -1.0, -1.0,
	];
	
	var boxIndices =
		[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];
	var cullRadios = document.getElementsByName('cullFace');
	var renderModeRadios = document.getElementsByName('renderMode');
	var colorSliders = document.getElementsByName('colorBar');
	guiInit = function(){
		

	for(i=0; i<cullRadios.length; i++) {
        cullRadios[i].addEventListener('change', changeCullFace, false);
    }
		for(i=0; i<colorSliders.length; i++) {
        colorSliders[i].addEventListener('change', setColors, false);
    }
		for(i=0; i<renderModeRadios.length; i++) {
        renderModeRadios[i].addEventListener('change', setRenderMode, false);
		}
	}

	

var setRenderMode= function(evt){
	if(renderModeRadios[0].checked){mode=gl.TRIANGLES;}
	else if(renderModeRadios[1].checked){mode=gl.LINES;}
	else if(renderModeRadios[2].checked){mode=gl.POINTS;}
	
}
	
	var setColors= function(evt){
	VertexColor=[	colorSliders[0].valueAsNumber/100,
					colorSliders[1].valueAsNumber/100,
					colorSliders[2].valueAsNumber/100];
		
		gl.uniform3fv(fragmentColorLocation, VertexColor);
		
	}
	
var makeBuffers=function(){
	
	//create new buffer for indexes
	var boxVertBufferObj = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertBufferObj);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVert), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, //attribute Location
		3, //number of elements per attribute
		gl.FLOAT, //type
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
		0 //Offset from begining of single vertex to this attribute
	);
gl.enableVertexAttribArray(positionAttribLocation);

	var boxIndexBufferObj = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObj);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

}

var replaceObject = function(vert,ind){
		boxVert=vert;
		boxIndices=ind;	
		makeBuffers();
	}

	
	//CameraVariables
	var nearClipping;
	var farClipping;
	var FOV;
	var mode=gl.TRIANGLES;
		document.getElementById('nearClipping').addEventListener('change', setNearClipping, false);
	function setNearClipping(evt){
		nearClipping=evt.target.valueAsNumber;
		mat4.perspective(ProjMatrix, glMatrix.toRadian(FOV), canvas.width / canvas.height,nearClipping, farClipping);
		
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);
		
	}
		document.getElementById('farClipping').addEventListener('change', setFarClipping, false);
	function setFarClipping(evt){
		farClipping= evt.target.valueAsNumber;
		mat4.perspective(ProjMatrix, glMatrix.toRadian(FOV), canvas.width / canvas.height,nearClipping,farClipping);
		
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);
		
	}
	
	//ChangeCullingFace
	
	
	
	function changeCullFace(evt){
		if(cullRadios[0].checked){
			
		gl.frontFace(gl.CW);
		}
		else if(cullRadios[1].checked){
			
		gl.frontFace(gl.CCW);
			
		}
		
		
	}
	
	
	
	
	
var InitDemo = function () {
	guiInit();
	//load openGL
	
	if (!gl) {
		console.log('WebGL not supported on this browser, falling back on experimental-webgl')
		gl = canvas.getContext('experimental-webgl');
	}
	if (!gl) {
		alert('your browser does not support WebGL');

	}
	// Check for the various File API support.
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		// Great success! All the File APIs are supported.
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}

	//culling and face settings.
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);//clockwise defines front
	gl.cullFace(gl.BACK);


	//Background color
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Create Shaders
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	//Check Shaders for errors
	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertexShader', gl.getShaderInfoLog(vertexShader));
		return;

	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragmentShader', gl.getShaderInfoLog(fragmentShader));
		return;

	}

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program', gl.getProgramInfoLog(program));
		return;

	}
	//validate, remove from final releases
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program', gl.getProgramInfoLog(program));
		return;

	}

	 makeBuffers();
	

	//Set world,view, and projection
	gl.useProgram(program);
	 matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	 matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	 matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	fragmentColorLocation = gl.getUniformLocation(program, 'vertColor');

	mat4.identity(worldMatrix);
	
	//Main Render loop
	var xrotation = new Float32Array(16);
	var yrotation = new Float32Array(16);

	u = vec3.create();
	v = vec3.create();
	w = vec3.create();

	resetCamera();

	gl.uniform3fv(fragmentColorLocation, VertexColor);
	
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	doRotate=false;
	
	
	var loop = function () {
		if(doRotate){angle = performance.now() / 1000 / 6 * 2 * Math.PI;
	
		mat4.rotate(yrotation, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xrotation, identityMatrix, angle / 4, [1, 0, 0]);
		mat4.mul(worldMatrix, yrotation, xrotation);
		}
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.1, 0.1, 0.1, 1.0);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		
		gl.drawElements(mode, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		requestAnimationFrame(loop);
	};

	requestAnimationFrame(loop);

};

//worldVariables
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var ProjMatrix = new Float32Array(16);
	var u, v, w;


	var right,up;
	var position;
	
	var matWorldUniformLocation;
	var matViewUniformLocation;
	var matProjUniformLocation;
	
	var fragmentColorLocation;
	
var resetCamera = function(){
    vec3.set(u, 1, 0, 0);
    vec3.set(v, 0, 1, 0);
    vec3.set(w, 0, 0, 1);


    position = vec3.create();
    vec3.set(position, 0, 0, 8);

    viewMatrix = buildView(position, u, v, w);
    VertexColor = [1.0, 1.0, 1.0];
    nearClipping = 0.1;
    farClipping = 100.0;
    FOV = 45;
    mat4.perspective(ProjMatrix, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);

}
	var doRotate;
	
	
	var toggleObjectRotate=function(){
		doRotate=!doRotate;
		
		
	}	
var buildView= function(eye,u,v,w )
{
	var m14,m24,m34;
	m14=vec3.dot( u, eye );
	m24=vec3.dot( v, eye );
	m34=vec3.dot( w, eye );
	
    var view = [
             u[0],v[0],w[0], 0,
             u[1],v[1],w[1], 0,
             u[2],v[2],w[2], 0,
             -m14	 ,	  -m24,	   -m34, 1
			   ];
    return view;
}
var rotateAxes = function (axis, angle) {
    var rotationMatrix;
    rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, angle, axis);
    var cameraAxis = [u[0], v[0], w[0], 0.0,
                      u[1], v[1], w[1], 0.0,
                      u[2], v[2], w[2], 0.0,
                      0.0 , 0.0 , 0.0 , 1.0];



}
	
document.addEventListener('keydown', function(event) {
	var lookSpeed= 0.01;
	var moveSpeed= 0.1;
	var identityMatrix = new Float32Array(16);
	var translation = vec3.create();
	mat4.identity(identityMatrix);
	var translate;
	translate=vec3.create();
	//RotateCamera
    if(event.keyCode == 37) {//LeftKey
        vec3.rotate(u, lookSpeed, v);
        vec3.rotate(w, lookSpeed, v);
    } if(event.keyCode == 38) {//UpKey
        vec3.rotate(v, lookSpeed, u);
        vec3.rotate(w, lookSpeed, u);
    }
     if(event.keyCode == 39) {//RightKey
         vec3.rotate(u, -lookSpeed, v);
         vec3.rotate(w, -lookSpeed, v);
    }
	 if(event.keyCode == 40) {//DownKey
	     vec3.rotate(v, -lookSpeed, u);
	     vec3.rotate(w, -lookSpeed, u);
    }
	
	/*/TranslateCamera
	 if(event.keyCode == 87) {//w
	vec3.add(position,position,translate);
    } if(event.keyCode == 83) {//s
	vec3.subtract(position,position,translate);
    } if(event.keyCode == 65) {//a
	vec3.add(right,right,translate);
	vec3.scale(right,right,moveSpeed);
	vec3.subtract(position,position,right);
    } if(event.keyCode == 68) {//d
	vec3.add(right,right,translate);
	vec3.scale(right,right,moveSpeed);
	vec3.add(position,position,right);
    }
	
	/*///Alter FOV
	if(event.keyCode==49){//1
	if(FOV>2){
		FOV-=2;
		mat4.perspective(ProjMatrix, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);
		}	
	}
	if(event.keyCode==50){//1
		if(FOV<178){
		FOV+=2;
		mat4.perspective(ProjMatrix, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);
		gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);
		}
	}
	/*vec3.set(right,
		Math.sin(yaw - 3.14/2.0),
		0,
		Math.cos(yaw - 3.14/2.0));
	
	vec3.set(camRotation,
		Math.cos(pitch) * Math.sin(yaw),
		Math.sin(pitch),
		Math.cos(pitch) * Math.cos(yaw));

	up=vec3.cross(up, right, camRotation);
	
	viewMatrix=FPSViewRH(position,pitch,yaw);
	*/
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
});
