var canvas = document.getElementById('game-surface-new');
var gl1 = canvas.getContext('webgl');
var program1;
var boxTexture;


var vertexShaderText1;

var fragmentShaderText1 =
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
guiInit1 = function () {


    for (i = 0; i < cullRadios.length; i++) {
        cullRadios[i].addEventListener('change', changeCullFace1, false);
    }
    for (i = 0; i < colorSliders.length; i++) {
        colorSliders[i].addEventListener('change', setColors, false);
    }
    for (i = 0; i < renderModeRadios.length; i++) {
        renderModeRadios[i].addEventListener('change', setRenderMode, false);
    }
}



var setRenderMode = function (evt) {
    if (renderModeRadios[0].checked) {
        mode = gl1.TRIANGLES;
    } else if (renderModeRadios[1].checked) {
        mode = gl1.LINES;
    } else if (renderModeRadios[2].checked) {
        mode = gl1.POINTS;
    }

}

var setColors = function (evt) {
    VertexColor = [colorSliders[0].valueAsNumber / 100,
        colorSliders[1].valueAsNumber / 100,
        colorSliders[2].valueAsNumber / 100];

    gl1.uniform3fv(fragmentColorLocation1, VertexColor);

}

var makeBuffers1 = function () {

    //create new buffer for indexes
    var boxVertBufferObj = gl1.createBuffer();
    gl1.bindBuffer(gl1.ARRAY_BUFFER, boxVertBufferObj);
    gl1.bufferData(gl1.ARRAY_BUFFER, new Float32Array(boxVert), gl1.STATIC_DRAW);

    var positionAttribLocation = gl1.getAttribLocation(program1, 'vertPosition');
    gl1.vertexAttribPointer(
            positionAttribLocation, //attribute Location
            3, //number of elements per attribute
            gl1.FLOAT, //type
            gl1.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, //Size of an individual vertexShader
            0 //Offset from begining of single vertex to this attribute
            );
    gl1.enableVertexAttribArray(positionAttribLocation);

    var boxIndexBufferObj = gl1.createBuffer();
    gl1.bindBuffer(gl1.ELEMENT_ARRAY_BUFFER, boxIndexBufferObj);
    gl1.bufferData(gl1.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl1.STATIC_DRAW);

}

var replaceObject = function (vert, ind) {
    boxVert = vert;
    boxIndices = ind;
    makeBuffers1();
}


//CameraVariables
var nearClipping;
var farClipping;
var FOV;
var mode = gl1.TRIANGLES;
document.getElementById('nearClipping').addEventListener('change', setNearClipping1, false);
function setNearClipping1(evt) {
    nearClipping = evt.target.valueAsNumber;
    perspective(ProjMatrix1, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);

    gl1.uniformMatrix4fv(matProjUniformLocation1, gl1.FALSE, ProjMatrix1);

}
document.getElementById('farClipping').addEventListener('change', setFarClipping1, false);
function setFarClipping1(evt) {
    farClipping = evt.target.valueAsNumber;
    perspective(ProjMatrix1, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);

    gl1.uniformMatrix4fv(matProjUniformLocation1, gl1.FALSE, ProjMatrix1);

}

//ChangeCullingFace



function changeCullFace1(evt) {
    if (cullRadios[0].checked) {

        gl1.frontFace(gl1.CW);
    } else if (cullRadios[1].checked) {

        gl1.frontFace(gl1.CCW);

    }


}





var InitDemo1 = function () {
    guiInit1();
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    vertexShaderText1 = readText('file://'+dir+'/vertexShader.txt');
    //load openGL

    if (!gl1) {
        console.log('WebGL not supported on this browser, falling back on experimental-webgl')
        gl1 = canvas.getContext('experimental-webgl');
    }
    if (!gl1) {
        alert('your browser does not support WebGL');

    }
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    //culling and face settings.
    gl1.enable(gl1.DEPTH_TEST);
    gl1.enable(gl1.CULL_FACE);
    gl1.frontFace(gl1.CCW);//clockwise defines front
    gl1.cullFace(gl1.BACK);


    //Background color
    gl1.clearColor(0.75, 0.85, 0.8, 1.0);
    gl1.clear(gl1.COLOR_BUFFER_BIT | gl1.DEPTH_BUFFER_BIT);

    // Create Shaders
    var vertexShader1 = gl1.createShader(gl1.VERTEX_SHADER);
    var fragmentShader1 = gl1.createShader(gl1.FRAGMENT_SHADER);

    gl1.shaderSource(vertexShader1, vertexShaderText1);
    gl1.shaderSource(fragmentShader1, fragmentShaderText1);

    //Check Shaders for errors
    gl1.compileShader(vertexShader1);
    if (!gl1.getShaderParameter(vertexShader1, gl1.COMPILE_STATUS)) {
        console.error('ERROR compiling vertexShader', gl1.getShaderInfoLog(vertexShader1));
        return;

    }

    gl1.compileShader(fragmentShader1);
    if (!gl1.getShaderParameter(fragmentShader1, gl1.COMPILE_STATUS)) {
        console.error('ERROR compiling fragmentShader', gl1.getShaderInfoLog(fragmentShader1));
        return;

    }

    program1 = gl1.createProgram();
    gl1.attachShader(program1, vertexShader1);
    gl1.attachShader(program1, fragmentShader1);
    gl1.linkProgram(program1);
    if (!gl1.getProgramParameter(program1, gl1.LINK_STATUS)) {
        console.error('ERROR linking program', gl1.getProgramInfoLog(program1));
        return;

    }
    //validate, remove from final releases
    gl1.validateProgram(program1);
    if (!gl1.getProgramParameter(program1, gl1.VALIDATE_STATUS)) {
        console.error('ERROR validating program', gl1.getProgramInfoLog(program1));
        return;

    }

    makeBuffers1();


    //Set world,view, and projection
    gl1.useProgram(program1);
    matWorldUniformLocation1 = gl1.getUniformLocation(program1, 'mWorld');
    matViewUniformLocation1 = gl1.getUniformLocation(program1, 'mView');
    matProjUniformLocation1 = gl1.getUniformLocation(program1, 'mProj');

    fragmentColorLocation1 = gl1.getUniformLocation(program1, 'vertColor');

    mat4.identity(worldMatrix1);

    //Main Render loop
    var xrotation1 = new Float32Array(16);
    var yrotation1 = new Float32Array(16);

    u1 = vec3.create();
    v1 = vec3.create();
    w2 = vec3.create();

    resetCamera1();

    gl1.uniform3fv(fragmentColorLocation1, VertexColor);

    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    doRotate = false;


    var loop1 = function () {
       
        if (doRotate) {
            angle = performance.now() / 1000 / 6 * 2 * Math.PI;

            mat4.rotate(yrotation1, identityMatrix, angle, [0, 1, 0]);
            mat4.rotate(xrotation1, identityMatrix, angle / 4, [1, 0, 0]);
            mat4.mul(worldMatrix1, yrotation1, xrotation1);
        }
        gl1.uniformMatrix4fv(matWorldUniformLocation1, gl1.FALSE, worldMatrix1);

        gl1.clearColor(0.1, 0.1, 0.1, 1.0);

        gl1.clear(gl1.COLOR_BUFFER_BIT | gl1.DEPTH_BUFFER_BIT);


        gl1.drawElements(mode, boxIndices.length, gl1.UNSIGNED_SHORT, 0);
        requestAnimationFrame(loop1);
    };

    requestAnimationFrame(loop1);

};

//worldVariables
var worldMatrix1 = new Float32Array(16);
var viewMatrix1 = new Float32Array(16);
var ProjMatrix1 = new Float32Array(16);
var u1, v1, w2;


var right1, up1;
var position1;

var matWorldUniformLocation1;
var matViewUniformLocation1;
var matProjUniformLocation1;

var fragmentColorLocation1;



var resetCamera1 = function () {
    vec3.set(u1, 1, 0, 0);
    vec3.set(v1, 0, 1, 0);
    vec3.set(w2, 0, 0, 1);


    position1 = vec3.create();
    vec3.set(position1, 0, 0, 10);

    viewMatrix1 = buildView1(position1, u1, v1, w2);
    VertexColor = [1.0, 1.0, 1.0];
    nearClipping = 0.1;
    farClipping = 100.0;
    FOV = 45;
    perspective(ProjMatrix1, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);

    gl1.uniformMatrix4fv(matWorldUniformLocation1, gl1.FALSE, worldMatrix1);
    gl1.uniformMatrix4fv(matViewUniformLocation1, gl1.FALSE, viewMatrix1);
    gl1.uniformMatrix4fv(matProjUniformLocation1, gl1.FALSE, ProjMatrix1);

}
var doRotate;


var toggleObjectRotate = function () {
    doRotate = !doRotate;


}
var buildView1 = function (eye, u, v, w)
{
    var m14, m24, m34;
    m14 = vec3.dot(u, eye);
    m24 = vec3.dot(v, eye);
    m34 = vec3.dot(w, eye);

    var view = [
        u[0], v[0], w[0], 0,
        u[1], v[1], w[1], 0,
        u[2], v[2], w[2], 0,
        -m14, -m24, -m34, 1
    ];
    return view;
}
var rotateAxes1 = function (axis, angle) {
    var rotationMatrix;
    rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, angle, axis);
    var ca = [u1[0], v1[0], w2[0], 0.0,
        u1[1], v1[1], w2[1], 0.0,
        u1[2], v1[2], w2[2], 0.0,
        0.0, 0.0, 0.0, 1.0];
    mat4.multiply(ca, ca, rotationMatrix);
    vec3.set(u1, ca[0], ca[4], ca[8]);
    vec3.set(v1, ca[1], ca[5], ca[9]);
    vec3.set(w2, ca[2], ca[6], ca[10]);
}
perspective = function (out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
            nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};
document.addEventListener('keydown', function (event) {


    //RotateCamera
    var lookSpeed = 0.01;

    if (event.keyCode == 37) {//LeftKey
        rotateAxes1(v1, -lookSpeed);
    }
    if (event.keyCode == 38) {//UpKey
        rotateAxes1(u1, -lookSpeed);
        ;
    }
    if (event.keyCode == 39) {//RightKey
        rotateAxes1(v1, lookSpeed);
    }
    if (event.keyCode == 40) {//DownKey
        rotateAxes1(u1, lookSpeed);
    }

    //TranslateCamera

    var moveSpeed = 1;
    var translate;
    translate = vec3.create();


    if (event.keyCode == 87) {//w
        vec3.scale(translate, w2, -moveSpeed);
    }
    if (event.keyCode == 83) {//s
        vec3.scale(translate, w2, moveSpeed);
    }
    if (event.keyCode == 65) {//a
        vec3.scale(translate, u1, -moveSpeed);
    }
    if (event.keyCode == 68) {//d
        vec3.scale(translate, u1, moveSpeed);
    }

    vec3.add(position1, position1, translate);

    //build view Matrix
    viewMatrix1 = buildView1(position1, u1, v1, w2);
    gl1.uniformMatrix4fv(matViewUniformLocation1, gl1.FALSE, viewMatrix1);


    //Alter FOV
    if (event.keyCode == 49) {//1
        if (FOV > 2) {
            FOV -= 2;
            perspective(ProjMatrix1, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);
            gl1.uniformMatrix4fv(matProjUniformLocation1, gl1.FALSE, ProjMatrix1);
        }
    }
    if (event.keyCode == 50) {//2
        if (FOV < 178) {
            FOV += 2;
            perspective(ProjMatrix1, glMatrix.toRadian(FOV), canvas.width / canvas.height, nearClipping, farClipping);
            gl1.uniformMatrix4fv(matProjUniformLocation1, gl1.FALSE, ProjMatrix1);
        }
    }

});
