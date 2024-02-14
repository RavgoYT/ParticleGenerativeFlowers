var inc = .08;
var scl = 50;
var cols, rows;

var zoff = 0;

var fr;

var particles = [];
var particlesMaroon = [];
var particlesBlue = [];
var particlesYellow = [];

var flowfield;
var flowfieldMaroon;
var flowfieldBlue;
var flowfieldYellow;

var gamma_is_high = false;
var beta_is_high = false;
var alpha_is_high = false;

var maroon_data=1000;
var blue_data = 1000;
var yellow_data = 1000;

setInterval(function() {
    ChangeLines();
}, 1000);

function dataRequest(){
    socket.emit('datarequest', {data: "request"});
}

function ChangeLines(){

    maroon_data = random(500, 2000);
    blue_data = random(500, 2000);
    yellow_data = random(500, 2000);

    gamma_is_high = true;
    alpha_is_high = true;
    beta_is_high = true;
}

function setup() {
  ChangeLines();
  createCanvas(windowWidth, windowHeight);
  cols = floor(width / scl);
  rows = floor(height / scl);
  fr = createP('');

  flowfield = new Array(cols * rows);
  flowfieldMaroon = new Array(cols * rows);
  flowfieldBlue = new Array(cols * rows);
  flowfieldYellow = new Array(cols * rows);

  for (var i = 0; i < 1000; i++) {
    particles[i] = new Particle();
    particlesMaroon[i] = new Particle();
    particlesBlue[i] = new Particle();
    particlesYellow[i] = new Particle();
  }
  background(255);  
}

function createFlowField(cols, rows, inc) {
  let flowfield = new Array(cols * rows);
  let yoff = 0;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = perlinNoise(xoff, yoff, zoff) * TWO_PI * 1.2;

      let v = createVector(cos(angle), sin(angle));
      v.mult(5); // Adjust magnitude as needed

      flowfield[index] = v;

      xoff += inc;
    }
    yoff += inc;
  }

  zoff += 0.003;

  return flowfield;
}

function draw() {
  // Use createFlowField function for each flow field
  flowfield = createFlowField(cols, rows, inc);

  fr.html(floor(frameRate()));

  // Rest of your draw logic...
}


function doTheThing(){

  let val = slider.value();
  inc = val;

  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    var xoff = 0;
    for (var x = 0; x < cols; x++) {
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI;

      var v = p5.Vector.fromAngle(angle);
      v.setMag(5);

      flowfield[index] = v;

      xoff += inc;
    }
    yoff += inc;
  }

  zoff += 0.0003;

  for (var gx = 0; gx < gridSize; gx++) {
    for (var gy = 0; gy < gridSize; gy++) {
      var offsetX = gx * gridSpacingX;
      var offsetY = gy * gridSpacingY;

      for (var i = 0; i < particles.length; i++) {
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show(offsetX, offsetY);
      }
    }
  }

  fr.html(floor(frameRate()));
}