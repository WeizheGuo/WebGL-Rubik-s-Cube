var canvas;
var gl;
var program;
var cbuff;
var vColor;
var fileContent;
var fileLoaded = false;

// cubie spacing
var d_cubie = 0.98;
var spacing = 2.05;

// animation parameters
var rotationAngle = 1;
var animationTimer = 1;

var numVertices = 36;

// References to vertex-shader uniforms
var _projectionMatrix;
var _modelViewMatrix;

// Actual projection- and modelView- matrices
var PROJMATRIX = mat4();
var MVMATRIX = mat4();

// For the lookAt() function - for the model-view matrix
var eye = vec3(0.0, 0.0, 8.0);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var cameraRadius = 30.0;
var cameraRadiusMinimum = 12.5;
var cameraRadiusMaximum = 50.0;

var THETA = radians(20);
var PHI = radians(60);

// For the perspective() function - for the projection matrix
var fovy = 45.0; 
var aspect = 1.0;
var near = 0.3;
var far = 1000;

// 24 vertices in total for the cube; 4 for each face
var vertices = [
  vec3(-d_cubie,-d_cubie,-d_cubie), vec3( d_cubie,-d_cubie,-d_cubie), vec3( d_cubie, d_cubie,-d_cubie), vec3(-d_cubie, d_cubie,-d_cubie),
  vec3(-d_cubie,-d_cubie, d_cubie), vec3( d_cubie,-d_cubie, d_cubie), vec3( d_cubie, d_cubie, d_cubie), vec3(-d_cubie, d_cubie, d_cubie),
  vec3(-d_cubie,-d_cubie,-d_cubie), vec3(-d_cubie, d_cubie,-d_cubie), vec3(-d_cubie, d_cubie, d_cubie), vec3(-d_cubie,-d_cubie, d_cubie),
  vec3( d_cubie,-d_cubie,-d_cubie), vec3( d_cubie, d_cubie,-d_cubie), vec3( d_cubie, d_cubie, d_cubie), vec3( d_cubie,-d_cubie, d_cubie),
  vec3(-d_cubie,-d_cubie,-d_cubie), vec3(-d_cubie,-d_cubie, d_cubie), vec3( d_cubie,-d_cubie, d_cubie), vec3( d_cubie,-d_cubie,-d_cubie),
  vec3(-d_cubie, d_cubie,-d_cubie), vec3(-d_cubie, d_cubie, d_cubie), vec3( d_cubie, d_cubie, d_cubie), vec3( d_cubie, d_cubie,-d_cubie),
];

var startingVertexColors = [
  // colors corresponding to the 24 individual vertices
  
  // Back face gr
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),

  // Front face bla
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  
  // Left face wht
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  
  // Right face blu
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  
  // Bottom face yel
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  
  // Top face black
  vec4( 0.0, 0.0, 0.0, 1.0 ),
  vec4( 0.0, 0.0, 0.0, 1.0 ),
  vec4( 0.0, 0.0, 0.0, 1.0 ),
  vec4( 0.0, 0.0, 0.0, 1.0 ),
];

var vertexColors = [
   // Back face gr
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),
  vec4( 0.0, 0.0, 1.0, 1.0 ),

  // Front face bla
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  vec4( 0.0, 1.0, 0.0, 1.0 ), 
  vec4( 0.0, 1.0, 0.0, 1.0 ),
  
  // Left face wht
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  vec4( 1.0, 0.0, 0.0, 1.0 ),
  
  // Right face blu
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  vec4( 1.0, 1.0, 0.0, 1.0 ),
  
  // Bottom face yel
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  vec4( 1.0, 1.0, 1.0, 1.0 ),
  
  // Top face black
  vec4( 0.0, 0.0, 0.0, 1.0 ),
  vec4( 0.0, 0.0, 0.0, 1.0 ),
  vec4( 0.0, 0.0, 0.0, 1.0 ),
  vec4( 0.0, 0.0, 0.0, 1.0 ),
];

var cubePosition = [[[[],[],[]],[[],[],[]],[[],[],[]]],[[[],[],[]],[[],[],[]],[[],[],[]]],[[[],[],[]],[[],[],[]],[[],[],[]]]]

// Defining indices for vertexes
var indices = [
    0,1,2,      0,2,3,    // front
    4,5,6,      4,6,7,    // back
    8,9,10,     8,10,11,  // left
    12,13,14,   12,14,15, // right
    16,17,18,   16,18,19, // bottom
    20,21,22,   20,22,23  // top
];

/*var moves = [
  "L","l","R","r","U","u",
  "D","d","F","f","B","b",
  "L","l","R","r","U","u",
]*/

var moves = [
  "L","l","R","r","U","u",
  "D","d","F","f","B","b",
  "M","m","S","s","E","e"
]

var textFile = null,
  makeTextFile = function (text) {
    var data = new Blob([text], {type: 'text/plain'});
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
};

function degrees(radians) {
  return radians / Math.PI * 180.0;
}

var originalMapping = {
  "rd": "L",
  "yel": "R",
  "bla": "U",
  "wht": "D",
  "gr": "F",
  "blu": "B",
  "M": "M",
  "E": "E",
  "S": "S"
}

var mappingColor = {
  "L": "rd",
  "R": "yel",
  "U": "bla",
  "D": "wht",
  "F": "gr",
  "B": "blu",
  "M": "M",
  "E": "E",
  "S": "S"
}

function callPush(strategy) {
  if(animationQueue.length < 9999) {
    var direction = 1;
    if (strategy == strategy.toLowerCase()) {
      strategy = strategy.toUpperCase();
      direction = 0;
    }
    var theta = degrees(THETA)%360;
    var phi = degrees(PHI)%360;
    var front = "gr", top = "bla", right = "yel";
    if (up[1] == 1) {
      if (phi < -315 || (phi >= -45 && phi < 45) || phi >= 315) {
        front = "bla";
        if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "blu": top ="gr";
          top=="blu" ? right = "yel": right = "rd";
        } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "yel": top ="rd";
          top=="yel" ? right = "gr": right = "blu";
        } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "gr": top= "blu";
          top=="blu" ? right = "yel": right = "rd";
        } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "rd": top ="yel";
          top=="yel" ? right = "gr": right = "blu";
        }
      } else if ((phi >= -225 && phi < -135) || (phi >=135 && phi < 225)){
        front = "wht";
        if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "gr" : top = "blu";
          top=="blu" ? right = "rd": right = "yel";
        } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "rd": top = "yel";
          top=="yel" ? right = "blu": right = "gr";
        } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "blu": top = "gr";
          top=="blu" ? right = "rd": right = "yel";
        } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "yel": top = "rd";
          top=="yel" ? right = "blu": right = "gr";
        }
      } else {
        if ((phi >=0 && phi <180) || (phi >=-360 && phi <-180)) {
          if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
            front = "gr";
            top = "bla";
            right = "yel";
          } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
            front = "rd";
            top = "bla";
            right = "gr";
          } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
            front = "blu";
            top = "bla";
            right = "rd";
          } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
            front = "yel";
            top = "bla";
            right = "blu";
          }
        } else {
          if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
            front = "blu";
            top = "bla";
            right = "rd";
          } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
            front = "yel";
            top = "bla";
            right = "blu";
          } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
            front = "gr";
            top = "bla";
            right = "yel";
          } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
            front = "rd";
            top = "bla";
            right = "gr";
          }
        }
      }
    } else {
      if (phi < -315 || (phi >= -45 && phi < 45) || phi >= 315) {
        front = "bla";
        if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "gr" : top = "blu";
          top=="blu" ? right = "yel": right = "rd";
        } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "rd": top = "yel";
          top=="yel" ? right = "gr": right = "blu";
        } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "blu": top = "gr";
          top=="blu" ? right = "yel": right = "rd";
        } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "yel": top = "rd";
          top=="yel" ? right = "gr": right = "blu";
        }
      } else if ((phi >= -225 && phi < -135) || (phi >=135 && phi < 225)){
        front = "wht";
        if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "blu": top ="gr";
          top=="blu" ? right = "rd": right = "yel";
        } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "yel": top ="rd";
          top=="yel" ? right = "blu": right = "gr";
        } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "gr": top= "blu";
          top=="blu" ? right = "rd": right = "yel";
        } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
          (phi >=0 && phi <180) || (phi >=-360 && phi <-180) ? top = "rd": top ="yel";
          top=="yel" ? right = "blu": right = "gr";
        }
      } else {
        // console.log("side:\n");
        if ((phi >=0 && phi <180) || (phi >=-360 && phi <-180)) {
          if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
            front = "gr";
            top = "wht";
            right = "rd";
          } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
            front = "rd";
            top = "wht";
            right = "blu";
          } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
            front = "blu";
            top = "wht";
            right = "yel";
          } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
            front = "yel";
            top = "wht";
            right = "gr";
          }
        } else {
          if (theta < -315 || (theta >= -45 && theta < 45) || theta >= 315) {
            front = "blu";
            top = "wht";
            right = "yel";
          } else if ((theta >= -135 && theta < -45) || (theta >= 225 && theta < 315)) {
            front = "yel";
            top = "wht";
            right = "gr";
          } else if ((theta >= -225 && theta < -135) || (theta >=135 && theta < 225)) {
            front = "gr";
            top = "wht";
            right = "rd";
          } else if ((theta >= -315 && theta < -225) || (theta >= 45 && theta < 135)) {
            front = "rd";
            top = "wht";
            right = "blu";
          }
        }
      }
    }

    makeRestFaces(front, top, right);

    if (top=="bla" || top =="wht") {
      if (front == "gr" || front == "blu"){
        mappingColor["M"] = "M"; 
        mappingColor["S"] = "S"; 
        mappingColor["E"] = "E";
        if (strategy=="M"&&(top=="wht"&&front!="blu" || top!="wht"&&front=="blu")){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="E"&&top=="wht"){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="S"&&front=="blu"){
          direction == 1? direction=0:direction=1;
        }
      } else if (front == "rd" || front == "yel") {
        mappingColor["M"] = "S";  
        mappingColor["S"] = "M"; 
        mappingColor["E"] = "E";
        if (strategy=="M"&&(top=="wht"&&front!="rd" || top!="wht"&&front=="rd")){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="E"&&top=="wht"){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="S"&&front=="yel"){
          direction == 1? direction=0:direction=1;
        }
      } 
    } else if (front == "wht" || front =="bla") {
      if (top == "gr" || top =="blu") {
        mappingColor["S"] = "E"; 
        mappingColor["E"] = "S"; 
        mappingColor["M"] = "M";
        if (strategy=="M"&&(top=="gr"&&front=="bla")||(top=="blu"&&front=="wht")){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="E"&&(top=="gr"&&front=="bla")||(top=="blu"&&front=="wht")){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="S"&&front=="bla"){
          direction == 1? direction=0:direction=1;
        }
      } else if (top == "rd" || top == "yel") {
        //console.log("I am here!");
        mappingColor["S"] = "E";  
        mappingColor["E"] = "M"; 
        mappingColor["M"] = "S";
        if(strategy == "U" || strategy == "D"){
          if (direction == 0){
            direction = 1;
          }
          else if(direction == 1){
            direction = 0;
          }            
        }
        if (strategy=="M"&&(top=="yel"&&front=="bla")||(top=="rd"&&front=="wht")){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="E"&&(top=="rd"&&front=="bla")||(top=="yel"&&front=="wht")){
          direction == 1? direction=0:direction=1;
        }
        if (strategy=="S"&&front=="wht"){
          direction == 1? direction=0:direction=1;
        }
      } 
    }
    
    colorIndex = mappingColor[strategy];
    newAction = originalMapping[colorIndex];
    if (direction==0) {
      newAction = newAction.toLowerCase();
    }
    //console.log(direction, newAction);
    animationQueue.push(newAction);
  } else {
    console.log("queue full!");
  }
}

function makeRestFaces(f,t,r) {
    b = oppositeFace(f);
    d = oppositeFace(t);
    l = oppositeFace(r);

    mappingColor["F"] = f;
    mappingColor["U"] = t;
    mappingColor["R"] = r;
    mappingColor["B"] = b;
    mappingColor["D"] = d;
    mappingColor["L"] = l;
    // console.log(mappingColor);

}

function oppositeFace(face) {
  if (face=="rd"){
    return "yel";
  } else if (face == "yel") {
    return "rd";
  } else if (face == "gr") {
    return "blu";
  } else if (face == "blu") {
    return "gr";
  } else if (face == "wht") {
    return "bla";
  } else if (face == "bla") {
    return "wht";
  }
}


// Work out the up vec for given phi and theta
function angleworker (dX, dY){
  var absPhi = Math.abs(degrees(PHI)%360); 
  // Allow for rotation beyond +-360 degrees
  if (absPhi > 180.0 && absPhi < 270.0 || PHI < 0.0) {
    if (degrees(PHI)%360 < -180.0) {
      up = vec3(0.0, 1.0, 0.0);
      THETA += -dX*2*Math.PI/canvas.width;
    } else {
      up = vec3(0.0, -1.0, 0.0);
      THETA += dX*2*Math.PI/canvas.width;
    }
  } else {
    if (absPhi > 270.0) {
      up = vec3(0.0, -1.0, 0.0);
      THETA += dX*2*Math.PI/canvas.width;
    } else {
      up = vec3(0.0, 1.0, 0.0);
      THETA += -dX*2*Math.PI/canvas.width;
    }
  }
  PHI += -dY*2*Math.PI/canvas.height;
}

// Setups
window.onload = function init() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log("All the file APIs are supported!");
  } else {
    console.log("Not all the file APIs are supported!");
  }

  canvas = document.getElementById("gl-canvas");

  // Capture mouse events
  var drag = false;
  var old_mouse_x, old_mouse_y;
  var isHeld = false;
  var mouseDown = function(e) {
    drag = true;
    old_mouse_x = e.pageX;
    old_mouse_y = e.pageY;
    e.preventDefault();
    return false;
  }
  
  var mouseUp = function(e) {drag = false;}
  
  var mouseMove = function(e) {
    if (!drag) {return false;}
    
    var dX = e.pageX - old_mouse_x;
    var dY = e.pageY - old_mouse_y;

    var absPhi = Math.abs(degrees(PHI)%360);

    angleworker(dX, dY);
    
    old_mouse_x = e.pageX;
    old_mouse_y = e.pageY;
    e.preventDefault();
  }
  
  var mouseWheel = function(e) {
    if (cameraRadius - e.wheelDelta/75 < cameraRadiusMinimum) {
      cameraRadius = cameraRadiusMinimum;
    } else if (cameraRadius - e.wheelDelta/75 > cameraRadiusMaximum) {
      cameraRadius = cameraRadiusMaximum;
    } else {
      cameraRadius -= e.wheelDelta/75;
    }
  }
  
  canvas.addEventListener("mousewheel", mouseWheel, false);
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mouseout", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);

  // Set up button listeners
  // document.getElementById( "LButton" ).onclick = function () {
  //   callPush("L","F","R","B","L","F","R","B");};
  // document.getElementById( "RButton" ).onclick = function () {
  //   callPush("R","B","L","F","R","B","L","F");};
  // document.getElementById( "UButton" ).onclick = function () {
  //   callPush("B","D","F","D","U","U","U","U");};
  // document.getElementById( "DButton" ).onclick = function () {
  //   callPush("F","U","B","U","D","D","D","D");};
  // document.getElementById( "FButton" ).onclick = function () {
  //   callPush("U","L","U","R","F","R","B","L");};
  // document.getElementById( "BButton" ).onclick = function () {
  //   callPush("D","R","D","L","B","L","F","R");};
  // document.getElementById( "MButton" ).onclick = function () {
  //   callPush("M","S","m","s","M","S","m","s");};
  // document.getElementById( "EButton" ).onclick = function () {
  //   callPush("S","e","s","e","E","E","E","E");};
  // document.getElementById( "SButton" ).onclick = function () {
  //   callPush("e","m","e","m","S","m","s","M");};
  // document.getElementById( "LiButton" ).onclick = function () {
  //   callPush("l","f","r","b","l","f","r","b");};
  // document.getElementById( "RiButton" ).onclick = function () {
  //   callPush("r","b","l","f","r","b","l","f");};
  // document.getElementById( "UiButton" ).onclick = function () {
  //   callPush("b","d","f","d","u","u","u","u");};
  // document.getElementById( "DiButton" ).onclick = function () {
  //   callPush("f","u","b","u","d","d","d","d");};
  // document.getElementById( "FiButton" ).onclick = function () {
  //   callPush("u","l","u","r","f","r","b","l");};
  // document.getElementById( "BiButton" ).onclick = function () {
  //   callPush("d","r","d","l","b","l","f","r");};
  // document.getElementById( "MiButton" ).onclick = function () {
  //   callPush("m","s","M","S","m","s","M","S");};
  // document.getElementById( "EiButton" ).onclick = function () {
  //   callPush("s","E","S","E","e","e","e","e");};
  // document.getElementById( "SiButton" ).onclick = function () {
  //   callPush("E","M","E","M","s","M","S","m");};
  document.getElementById( "LButton" ).onclick = function () {callPush("L");};
  document.getElementById( "RButton" ).onclick = function () {callPush("R");};
  document.getElementById( "UButton" ).onclick = function () {callPush("U");};
  document.getElementById( "DButton" ).onclick = function () {callPush("D");};
  document.getElementById( "FButton" ).onclick = function () {callPush("F");};
  document.getElementById( "BButton" ).onclick = function () {callPush("B");};
  document.getElementById( "MButton" ).onclick = function () {callPush("M");};
  document.getElementById( "EButton" ).onclick = function () {callPush("E");};
  document.getElementById( "SButton" ).onclick = function () {callPush("S");};
  document.getElementById( "LiButton" ).onclick = function () {callPush("l");};
  document.getElementById( "RiButton" ).onclick = function () {callPush("r");};
  document.getElementById( "UiButton" ).onclick = function () {callPush("u");};
  document.getElementById( "DiButton" ).onclick = function () {callPush("d");};
  document.getElementById( "FiButton" ).onclick = function () {callPush("f");};
  document.getElementById( "BiButton" ).onclick = function () {callPush("b");};
  document.getElementById( "MiButton" ).onclick = function () {callPush("m");};
  document.getElementById( "EiButton" ).onclick = function () {callPush("e");};
  document.getElementById( "SiButton" ).onclick = function () {callPush("s");};

  document.getElementById( "randomTurnCount").onkeypress = function(e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
      makeRandomTurns();
      return false;
    }
  }

  document.getElementById( "RandomButton" ).onclick = makeRandomTurns;
  
  function makeRandomTurns() {
    var input = document.getElementById("randomTurnCount").value;
    if(isNaN(input) || !input) {
      alert("The value you have indicated is invalid.");
    } else if (input > 9999 || input < 0) {
      alert("The value is out of range from (0 - 9999).");
    } else if (animationQueue.length != 0) {
      alert("Moves in the animation queue already.");
    } else {
      for (i = 0; i < input; i++) {
        var randi = Math.round(Math.random()*1000)%17;
        pushAnimation(moves[randi]);
      }
    }
  }

  document.getElementById( "LoadButton" ).onclick = function () {
    if (!fileLoaded) {
      alert("You dont specify a cube state file.");
    } else {
      cubePosition = cubeposition.slice();
      PHI = radians(phivalue);
      THETA = radians(thetavalue);
      angleworker(0.0,0.0);
    }
  };

  document.getElementById( "SaveButton" ).onclick = function () {
    var link = document.getElementById("downloadlink");
    var phival = degrees(PHI)%360;
    var thetaval = degrees(THETA)%360;
    link.href = makeTextFile(JSON.stringify({ phival: phival, thetaval: thetaval, cubepos: cubePosition}));
    link.innerHTML = "Download saved cube state";
  };
  
  // Set up WebGL
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL not available");
  }
  
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.0, 0.0, 0.5, 0.8);
  
  gl.enable(gl.DEPTH_TEST);
  
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);
  
  // array element buffer
  var ebuff = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ebuff);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
  
  // color buffer
  cbuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cbuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
  
  vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
  gl.enableVertexAttribArray(vColor);
  
  // vertex buffer
  var vbuff = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuff);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
  
  var _vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(_vPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(_vPosition);
  
  _projectionMatrix = gl.getUniformLocation(program, "projectionMatrix");
  _modelViewMatrix = gl.getUniformLocation(program, "modelViewMatrix");
  
  initCubePosition();
  render();
}

var innerfaceColor = vec4(0.0, 0.0, 0.0, 0.5);
// Set inner face colors
function SetinnerColor(x,y,z) {
  for (i = 0; i < vertexColors.length; i++) {
    vertexColors[i] = startingVertexColors[i];
  }
  var index, first;
  if (x != -1) {darken(8);}
  if (x != 1) {darken(12);}
  if (y != -1) {darken(16);}
  if (y != 1) {darken(20);}
  if (z != -1) {darken(0);}
  if (z != 1) {darken(4);}
  
  function darken(index) {
    for (i = index; i < index + 4; i++) {
      vertexColors[i] = innerfaceColor;
    }  
  }
}

function checkSolve() {
  var orientation;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      orientation = cubePosition[0][0][0][3];
      for (x = -1; x < 2; x++) {
        for (y = -1; y < 2; y++) {
          for (z = -1; z < 2; z++) {
            if (cubePosition[x+1][y+1][z+1][3][i][j] != orientation[i][j]) {
              // Check out faces match with the center piece
              if (x == 0 && z == 0) {
                if (cubePosition[x+1][y+1][z+1][3][1][j] != orientation[1][j]) {
                  return false;
                }
              } else if (x == 0 && y == 0) {
                if (cubePosition[x+1][y+1][z+1][3][2][j] != orientation[2][j]) {
                  return false;
                }
              } else if (y == 0 && z == 0) {
                if (cubePosition[x+1][y+1][z+1][3][0][j] != orientation[0][j]) {
                  return false;
                }
              } else {
                return false;
              }
            }
          }
        }
      }
    }
  }
  return true;
}

// cubePosition[x][y][z][0] is cubie's x position
// cubePosition[x][y][z][1] is cubie's y position
// cubePosition[x][y][z][2] is cubie's z position
// cubePosition[x][y][z][3] is reference axis
// cubePosition[x][y][z][4] is cubie's rotation matrix
function initCubePosition() {
  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      for (k = -1; k < 2; k++) {
        cubePosition[i+1][j+1][k+1][0] = i;
        cubePosition[i+1][j+1][k+1][1] = j;
        cubePosition[i+1][j+1][k+1][2] = k;
        cubePosition[i+1][j+1][k+1][3] = [vec3(-1,0,0),vec3(0,-1,0),vec3(0,0,-1)];
        cubePosition[i+1][j+1][k+1][4] = mat4();
      }
    }
  }
}

function negateVec(vec) {
  var temp = [];
  for (i=0; i < vec.length; i++) {temp[i] = -vec[i];}
  return temp;
}

function getRotationAxis(x,y,z) {return cubePosition[x+1][y+1][z+1][3];}
function getRotationMatrix(x,y,z) {return cubePosition[x+1][y+1][z+1][4];}
function setRotationMatrix(x,y,z,m) {cubePosition[x+1][y+1][z+1][4] = m;}

var currentAngle = 0;
var interval;
var isAnimating = false;
var animationQueue = [];

function pushAnimation(face) {animationQueue.push(face);}

function animate(action) {
  interval = setInterval(function() {callRotation(action)}, animationTimer);
}

// Rotate given face
function callRotation(face) {
  turnFace(face);
  currentAngle += rotationAngle;
  if (currentAngle == 90) {
    clearInterval(interval);
    isAnimating = false;
    currentAngle = 0;
    setCubePosition(face);
    if (checkSolve()) {
      document.getElementById("FinishedField").innerHTML = "CUBE COMPLETE!";
    } else {
      document.getElementById("FinishedField").innerHTML = "";
    }
  }
}

// Set the new matrix based on the finished position for each cubie
function setCubePosition(face) {
  var x, y, z, first, second, third, temp;
  for (x = -1; x < 2; x++) {
    for (y = -1; y < 2; y++) {
      for (z = -1; z < 2; z++) {
        switch (face) {
         case "L":
          if (cubePosition[x+1][y+1][z+1][0] == -1) {
            temp = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][1];
            cubePosition[x+1][y+1][z+1][3][1] = negateVec(cubePosition[x+1][y+1][z+1][3][2]);
            cubePosition[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "l":
          if (cubePosition[x+1][y+1][z+1][0] == -1) {
            temp = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][2];
            cubePosition[x+1][y+1][z+1][3][2] = negateVec(cubePosition[x+1][y+1][z+1][3][1]);
            cubePosition[x+1][y+1][z+1][3][1] = temp;
          }
          break;
         case "R":
          if (cubePosition[x+1][y+1][z+1][0] == 1) {
            temp = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][2];
            cubePosition[x+1][y+1][z+1][3][2] = negateVec(cubePosition[x+1][y+1][z+1][3][1]);
            cubePosition[x+1][y+1][z+1][3][1] = temp;
          }
          break;
         case "r":
          if (cubePosition[x+1][y+1][z+1][0] == 1) {
            temp = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = -temp;
            
            
            temp = cubePosition[x+1][y+1][z+1][3][1];
            cubePosition[x+1][y+1][z+1][3][1] = negateVec(cubePosition[x+1][y+1][z+1][3][2]);
            cubePosition[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "U":
          if (cubePosition[x+1][y+1][z+1][1] == 1) {
            temp = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][0];
            cubePosition[x+1][y+1][z+1][3][0] = negateVec(cubePosition[x+1][y+1][z+1][3][2]);
            cubePosition[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "u":
          if (cubePosition[x+1][y+1][z+1][1] == 1) {
            temp = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][2];
            cubePosition[x+1][y+1][z+1][3][2] = negateVec(cubePosition[x+1][y+1][z+1][3][0]);
            cubePosition[x+1][y+1][z+1][3][0] = temp;
          }
          break;
         case "D":
          if (cubePosition[x+1][y+1][z+1][1] == -1) {
            temp = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][2];
            cubePosition[x+1][y+1][z+1][3][2] = negateVec(cubePosition[x+1][y+1][z+1][3][0]);
            cubePosition[x+1][y+1][z+1][3][0] = temp;
          }
          break;
         case "d":
          if (cubePosition[x+1][y+1][z+1][1] == -1) {
            temp = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][0];
            cubePosition[x+1][y+1][z+1][3][0] = negateVec(cubePosition[x+1][y+1][z+1][3][2]);
            cubePosition[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "E":
          if (cubePosition[x+1][y+1][z+1][1] == 0) {
            temp = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][2];
            cubePosition[x+1][y+1][z+1][3][2] = negateVec(cubePosition[x+1][y+1][z+1][3][0]);
            cubePosition[x+1][y+1][z+1][3][0] = temp;
          }
          break;
         case "e":
          if (cubePosition[x+1][y+1][z+1][1] == 0) {
            temp = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][0];
            cubePosition[x+1][y+1][z+1][3][0] = negateVec(cubePosition[x+1][y+1][z+1][3][2]);
            cubePosition[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "F":
          if (cubePosition[x+1][y+1][z+1][2] == 1) {
            temp = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][1];
            cubePosition[x+1][y+1][z+1][3][1] = negateVec(cubePosition[x+1][y+1][z+1][3][0]);
            cubePosition[x+1][y+1][z+1][3][0] = temp;
          }
          break;
         case "f":
          if (cubePosition[x+1][y+1][z+1][2] == 1) {
            temp = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][0];
            cubePosition[x+1][y+1][z+1][3][0] = negateVec(cubePosition[x+1][y+1][z+1][3][1]);
            cubePosition[x+1][y+1][z+1][3][1] = temp;
          }
          break;
         case "S":
          if (cubePosition[x+1][y+1][z+1][2] == 0) {
            temp = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][1];
            cubePosition[x+1][y+1][z+1][3][1] = negateVec(cubePosition[x+1][y+1][z+1][3][0]);
            cubePosition[x+1][y+1][z+1][3][0] = temp;
          }
          break;
         case "s":
          if (cubePosition[x+1][y+1][z+1][2] == 0) {
            temp = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][0];
            cubePosition[x+1][y+1][z+1][3][0] = negateVec(cubePosition[x+1][y+1][z+1][3][1]);
            cubePosition[x+1][y+1][z+1][3][1] = temp;
          }
          break;
         case "B":
          if (cubePosition[x+1][y+1][z+1][2] == -1) {
            temp = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][0];
            cubePosition[x+1][y+1][z+1][3][0] = negateVec(cubePosition[x+1][y+1][z+1][3][1]);
            cubePosition[x+1][y+1][z+1][3][1] = temp;
          }
          break;
         case "b":
          if (cubePosition[x+1][y+1][z+1][2] == -1) {
            temp = cubePosition[x+1][y+1][z+1][0];
            cubePosition[x+1][y+1][z+1][0] = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][1];
            cubePosition[x+1][y+1][z+1][3][1] = negateVec(cubePosition[x+1][y+1][z+1][3][0]);
            cubePosition[x+1][y+1][z+1][3][0] = temp;
          }
          break;
         case "M":
          if (cubePosition[x+1][y+1][z+1][0] == 0) {
            temp = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][1];
            cubePosition[x+1][y+1][z+1][3][1] = negateVec(cubePosition[x+1][y+1][z+1][3][2]);
            cubePosition[x+1][y+1][z+1][3][2] = temp;
          }
          break;
         case "m":
          if (cubePosition[x+1][y+1][z+1][0] == 0) {
            temp = cubePosition[x+1][y+1][z+1][1];
            cubePosition[x+1][y+1][z+1][1] = cubePosition[x+1][y+1][z+1][2];
            cubePosition[x+1][y+1][z+1][2] = -temp;
            
            temp = cubePosition[x+1][y+1][z+1][3][2];
            cubePosition[x+1][y+1][z+1][3][2] = negateVec(cubePosition[x+1][y+1][z+1][3][1]);
            cubePosition[x+1][y+1][z+1][3][1] = temp;
          }
        }
      }
    }
  }
}

function turnFace(face) {
  var x,y,z;
  var direction,value;
  var mainAxis,secondAxis,thirdAxis;
  var oldMatrix, newMatrix
  switch (face) {
   case "L":
    mainAxis = 0; value = -1; direction = "L";
    break;
   case "l":
    mainAxis = 0; value = -1; direction = 0;
    break;
   case "R":
    mainAxis = 0; value = 1; direction = 0;
    break;
   case "r":
    mainAxis = 0; value = 1; direction = "r";
    break;
   case "M":
    mainAxis = 0;value = 0;direction = "M";
    break;
   case "m":
    mainAxis = 0;value = 0;direction = 0;
    break;
   case "U":
    mainAxis = 1;value = 1;direction = 0;
    break;
   case "u":
    mainAxis = 1;value = 1;direction = "u";
    break;
   case "D":
    mainAxis = 1;value = -1;direction = "D";
    break;
   case "d":
    mainAxis = 1;value = -1;direction = 0;
    break;
   case "E":
    mainAxis = 1;value = 0;direction = "E";
    break;
   case "e":
    mainAxis = 1;value = 0;direction = 0;
    break;
   case "F":
    mainAxis = 2;value = 1;direction = 0;
    break;
   case "f":
    mainAxis = 2;value = 1;direction = "f";
    break;
   case "B":
    mainAxis = 2;value = -1;direction = "B";
    break;
   case "b":
    mainAxis = 2;value = -1;direction = 0;
    break;
   case "S":
    mainAxis = 2;value = 0;direction = 0;
    break;
   case "s":
    mainAxis = 2;value = 0;direction = "s";
    break;
  }
  for (x = -1; x < 2; x++) {
    for (y = -1; y < 2; y++) {
      for (z = -1; z < 2; z++) {
        // check if cubie is in the plane of the face being turned
        if (cubePosition[x+1][y+1][z+1][mainAxis] == value) {
          oldMatrix = getRotationMatrix(x,y,z);
          if (!direction) {
            oldMatrix = mult(oldMatrix,rotate(rotationAngle,getRotationAxis(x,y,z)[mainAxis]));
          } else {
            oldMatrix = mult(oldMatrix,rotate(rotationAngle,negateVec(getRotationAxis(x,y,z)[mainAxis])));
          }
          setRotationMatrix(x,y,z,oldMatrix);
        }
      }
    }
  }
}

// Display pixels
function render() {
  if (animationQueue.length != 0 && !isAnimating) {
    animate(animationQueue.shift());
    isAnimating = true;
  }

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  eye = vec3(cameraRadius*Math.sin(PHI)*Math.sin(THETA),
    cameraRadius*Math.cos(PHI),
    cameraRadius*Math.sin(PHI)*Math.cos(THETA));
    
  PROJMATRIX = perspective(fovy, aspect, near, far);
  
  MVMATRIX = lookAt(eye, at, up);
  var x, y, z;
  for (x = -1; x <= 1; x++) {
    for (y = -1; y <= 1; y++) {
      for (z = -1; z <= 1; z++) {
        if (x !=0 || y !=0 || z!=0) { 
          // if (x,y,z) != (0,0,0).
          var tempMVMATRIX = MVMATRIX;
          
          MVMATRIX = mult(MVMATRIX,getRotationMatrix(x,y,z));
          MVMATRIX = mult(MVMATRIX,translate(vec3(x*spacing,y*spacing,z*spacing)));
          SetinnerColor(x,y,z);
          
          cbuff = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, cbuff);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);
          
          vColor = gl.getAttribLocation( program, "vColor" );
          gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0 , 0);
          gl.enableVertexAttribArray(vColor);
          
          gl.uniformMatrix4fv(_projectionMatrix, false, flatten(PROJMATRIX));
          gl.uniformMatrix4fv(_modelViewMatrix, false, flatten(MVMATRIX));
          gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);
          
          MVMATRIX = tempMVMATRIX;
        }  
      }
    }
  }
  requestAnimFrame(render);
}
