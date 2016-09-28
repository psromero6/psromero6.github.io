var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');
var program;
var boxTexture;


var vertexShaderText =
	[
	'precision mediump float;',
	'',
	'attribute vec3 vertPosition;',
	'attribute vec2 vertTexCoord;',
	'varying vec2 fragTexCoord;',
	'uniform mat4 mWorld;',
	'uniform mat4 mView;',
	'uniform mat4 mProj;',
	'',
	'void main()',
	'{',
	' fragTexCoord=vertTexCoord;',
	' gl_Position =mProj * mView * mWorld * vec4(vertPosition,1.0);',
	'}'

].join('\n');

var fragmentShaderText =
	[
	'precision mediump float;',
	'',
	'varying vec2 fragTexCoord;',
	'uniform sampler2D sampler;',
	'void main()',
	'{',
	' gl_FragColor = texture2D(sampler,fragTexCoord);',
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

	var boxTexCoord =
		//U, V
		[0, 0,
		0, 1,
		1, 1,
		1, 0,

		0, 0,
		1, 0,
		1, 1,
		0, 1,

		1, 1,
		0, 1,
		0, 0,
		1, 0,

		1, 1,
		1, 0,
		0, 0,
		0, 1,

		0, 0,
		0, 1,
		1, 1,
		1, 0,

		1, 1,
		1, 0,
		0, 0,
		0, 1,
	]

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
	guiInit = function(){
		

	for(i=0; i<cullRadios.length; i++) {
        cullRadios[i].addEventListener('change', changeCullFace, false);
    }
		
		
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

	//create new buffer for coordinates
	var texCoordBufferObj = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBufferObj);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxTexCoord), gl.STATIC_DRAW);
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');

	gl.vertexAttribPointer(
		texCoordAttribLocation, //attribute Location
		2, //number of elements per attribute
		gl.FLOAT, //type
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
		0 //Offset from begining of single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	var boxIndexBufferObj = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObj);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	

	
	
	
}
var makeTexture=function(){
	//Create Texture

	boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
		document.getElementById('xImage'));

	gl.bindTexture(gl.TEXTURE_2D, null);
	
	
}

var replaceObject = function(vert,tex,ind){
		boxVert=vert;
		boxTexCoord= tex;
		boxIndices=ind;	
		makeBuffers();
	}

	
	//CameraVariables
	var nearClipping;
	var farClipping;
	
		document.getElementById('nearClipping').addEventListener('change', setNearClipping, false);
	function setNearClipping(evt){
		nearClipping=evt.target.valueAsNumber;
		mat4.perspective(ProjMatrix, glMatrix.toRadian(45), canvas.width / canvas.height,nearClipping, farClipping);
		
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);
		
	}
		document.getElementById('farClipping').addEventListener('change', setFarClipping, false);
	function setFarClipping(evt){
		farClipping= evt.target.valueAsNumber;
		mat4.perspective(ProjMatrix, glMatrix.toRadian(45), canvas.width / canvas.height,nearClipping,farClipping);
		
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
	 makeTexture();
	

	//Set world,view, and projection
	gl.useProgram(program);
	 matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	 matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	 matProjUniformLocation = gl.getUniformLocation(program, 'mProj');



	mat4.identity(worldMatrix);
	
	//Main Render loop
	var xrotation = new Float32Array(16);
	var yrotation = new Float32Array(16);
	camRotation=vec3.create;
	verticalAngle=0;
	horizontalAngle=0;
	
	right=vec3.create();
	up=vec3.create();
	vec3.set(right,
		Math.sin(horizontalAngle - 3.14/2.0),
		0,
		Math.cos(horizontalAngle - 3.14/2.0));
	
	vec3.set(camRotation,
		Math.cos(verticalAngle) * Math.sin(horizontalAngle),
		Math.sin(verticalAngle),
		Math.cos(verticalAngle) * Math.cos(horizontalAngle));

	up=vec3.cross(up, right, camRotation);
	position=vec3.create();
	vec3.set(position,0,0,-8);
	
	mat4.lookAt(viewMatrix, position, [0, 0, 0],up);
	
	nearClipping=0.1;
	farClipping= 10000.0;
	mat4.perspective(ProjMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, nearClipping, farClipping);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, ProjMatrix);

	
	
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	
	
	
	var loop = function () {
		//angle = performance.now() / 1000 / 6 * 2 * Math.PI;
	
		mat4.rotate(yrotation, identityMatrix, angle, [0, 1, 0]);
		mat4.rotate(xrotation, identityMatrix, angle / 4, [1, 0, 0]);
		mat4.mul(worldMatrix, yrotation, xrotation);
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.1, 0.1, 0.1, 1.0);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
		requestAnimationFrame(loop);
	};

	requestAnimationFrame(loop);

};

//worldVariables
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var ProjMatrix = new Float32Array(16);
	var camRotation,verticalAngle,horizontalAngle;
	var right,up;
	var position;
	
	var matWorldUniformLocation;
	var matViewUniformLocation;
	var matProjUniformLocation;
	
	
	
var resetCamera = function(){
	verticalAngle=0;
	horizontalAngle=0;

	vec3.set(right,
		Math.sin(horizontalAngle - 3.14/2.0),
		0,
		Math.cos(horizontalAngle - 3.14/2.0));
	
	vec3.set(camRotation,
		Math.cos(verticalAngle) * Math.sin(horizontalAngle),
		Math.sin(verticalAngle),
		Math.cos(verticalAngle) * Math.cos(horizontalAngle));

	up=vec3.cross(up, right, camRotation);
	position=vec3.create();
	vec3.set(position,0,0,-8);
	
	mat4.lookAt(viewMatrix, position, [0, 0, 0],up);
	
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
}
	

	
	
document.addEventListener('keydown', function(event) {
	var lookSpeed= 0.01;
	var moveSpeed= 0.1;
	var identityMatrix = new Float32Array(16);
	var translation = vec3.create();
	mat4.identity(identityMatrix);
	var translate;
	translate=vec3.create();
	vec3.scale(translate,camRotation,moveSpeed);
	
	
	
    if(event.keyCode == 37) {//LeftKey
       horizontalAngle+=lookSpeed;
		
    }else if(event.keyCode == 38) {//UpKey
      verticalAngle+=lookSpeed;
    }
    else if(event.keyCode == 39) {//RightKey
       horizontalAngle-=lookSpeed;
    }
	else if(event.keyCode == 40) {//DownKey
       verticalAngle-=lookSpeed;
    }
	else if(event.keyCode == 87) {//w
	
	vec3.add(position,position,translate);
     // position+=moveSpeed*camRotation;
    }else if(event.keyCode == 83) {//s
	vec3.subtract(position,position,translate);
     // position+=moveSpeed*camRotation;
    }else if(event.keyCode == 65) {//a
	vec3.add(right,right,translate);
	vec3.scale(right,right,moveSpeed);
	vec3.subtract(position,position,right);
     // position+=moveSpeed*camRotation;
    }else if(event.keyCode == 68) {//d
	vec3.add(right,right,translate);
	vec3.scale(right,right,moveSpeed);
	vec3.add(position,position,right);
     // position+=moveSpeed*camRotation;
    }
	else{
		return;
		
	}
	vec3.set(right,
		Math.sin(horizontalAngle - 3.14/2.0),
		0,
		Math.cos(horizontalAngle - 3.14/2.0));
	
	vec3.set(camRotation,
		Math.cos(verticalAngle) * Math.sin(horizontalAngle),
		Math.sin(verticalAngle),
		Math.cos(verticalAngle) * Math.cos(horizontalAngle));

	up=vec3.cross(up, right, camRotation);
	var target;
	target=vec3.create();
	vec3.add(target,position,camRotation);
	mat4.lookAt(viewMatrix, position,target, up);
	
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
});
