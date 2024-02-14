var points = []
var mult = 0.009


let randomPetalNumber;

var r1
var r2
var g1
var g2
var b1
var b2
let overlay;
let centerX, centerY, textSize;
let density = 1000;
let shapeImage;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  overlay = createGraphics(width, height);
  overlay.colorMode(HSB, 360, 100, 100, 100);
  overlay.rectMode(CENTER);
  overlay.fill("255");
  overlay.stroke(255);
  randomPetalNumber = random(4, 2)
  //overlay.textFont(font);
  overlay.textAlign(CENTER, CENTER);

  overlay.imageMode(CENTER);
  background(0)
  angleMode(DEGREES)
  noiseDetail(1)

   // Store text position and size
   centerX = overlay.width / 2;
   centerY = overlay.height / 2 - 55;

  var space = width / density
  
  for (var x = 0; x < width; x += space) {
    
    for (var y = 0; y < height; y += space) {
       var p = createVector(x + random(-10, 10), y + random(-10, 10))
       points.push(p)
    }
  }
  
  shuffle(points, true)
  
  r1 = 215//random(255)
  r2 = random(255)
  g1 = 77//random(255)
  g2 = random(255)
  b1 = 210//random(255)
  b2 = random(255)
  
  mult = 0.0006//random(0.09, 0.9)
  
}


function draw() {

  doTheDraw();
}

function doTheDraw() { // 4 10 3
  noStroke();

  overlay.background(0, 0, 0);
  cutText(
    'For My Darlin\' Emma', overlay.width/2, overlay.height/2+450,
    40, 3, 100, 100
  );
  textSize = overlay.textSize(); // Store text size
  density = 100

  for (let i = 0; i < density; i++) {
    // Generate points with biased probability
    const x = randomGaussian(centerX, textSize * 2); // Adjust spread as needed
    const y = randomGaussian(centerY, textSize);

    // Calculate adjusted density based on distance to text center
    const distance = dist(x, y, centerX, centerY);
    let maxFrames = 60 * 10; // Adjust as needed
    const adjustedDensity = density / (distance * distance * 0.5); // Adjust factor


    // Generate point with probability based on adjusted density
    if (random() < adjustedDensity) {
      points.push(createVector(x, y));
    }
  }


  image(overlay, 0, 0)
  var gridSize = 2; // Number of rows and columns for the grid
  var gridSpacingX = width / gridSize;
  var gridSpacingY = height / gridSize;

  for (var gx = 0; gx < gridSize; gx++) {
    for (var gy = 0; gy < gridSize; gy++) {
      var offsetX = gx * gridSpacingX;
      var offsetY = -(gy * gridSpacingY * 1.9);

      var max = frameCount * 10;

      for (var i = 0; i < max; i++) {
        var x = points[i].x + offsetX;
        var y = points[i].y + offsetY;

        var r = map(x, offsetX, offsetX + width, r1, r2);
        var g = map(y, offsetY, offsetY + height, g1, g2);
        var b = map(x, offsetX, offsetX + width, b1, b2);
        var alpha = map(dist((offsetX + width) / 2, (offsetY + height) / 2, x, y), 0, 500, 1000, 0);

        fill(r, g, b);

        var angle = map(noise((x - offsetX) * mult, (y - offsetY) * mult), 0, 1, 0, 720);

        points[i].add(createVector(cos(angle), sin(angle)));

        ellipse(x, y, 1.2); // the individual points that make a line
      }
    }
  }
}

function cutText(theText, x, y, t_Size, s_Weight, f_A, s_A){
  let normalHeight = (y - 450) - 300
  t_Size = t_Size - (3 * theText.length)
  overlay.stroke(255);
  overlay.strokeWeight(s_Weight);
  overlay.erase(f_A, s_A);
  // this took me WAY too long to figure out

  let numFlowers = 5;

  //for (let i = 0; i < numFlowers; i++) {
    // Calculate random position within the bouquet's radius
    let angle = TWO_PI//random(TWO_PI); // Random angle
    let distance = 0//random(50, 150); // Random distance from the center within a range
    let posX = x + cos(angle) * distance; // X-coordinate within the range of the flower's x
    let posY = normalHeight + sin(angle) * distance; // Y-coordinate within the range of the flower's y
    
    drawRose(posX, posY, 0); // Draw the flower
    drawRose(posX - 130, posY + 50, 1.3)
    //drawRose(posX + 130, posY - 50, -1.3) i do NOT have time to work with this  
  //}

  overlay.push();
  overlay.translate(0, 0);
  overlay.rotate(-HALF_PI);
  overlay.textSize(80);
  overlay.text(theText, 0 - 590, 0 + 1200);
  overlay.pop();
  overlay.noErase();
}

function drawRose(x, normalHeight, angle){
  let radius = 50;
  let petals = randomPetalNumber;
  let stemLength = 200 * petals; // Length of the stem
  
  // Draw the circles (petals)
  let j = petals;

    // Draw the stem
    overlay.strokeWeight(6); // Adjust thickness as needed
    overlay.line(normalHeight + 82, x - 300, normalHeight + radius * 1.75 + stemLength, x - 300 + (angle * 150)); // Stem extends from the bottom of the flower
  
    overlay.strokeWeight(0);
  for (let i = 0; i < petals; i++) {
    
    let startAngle = -2 * PI/(3 + angle); // Start angle (30 degrees clockwise from the vertical)
    let endAngle = -(PI + (2 * PI/(6 + angle))); // End angle (30 degrees counter-clockwise from the vertical)
    let yOffset = i * 12.5;
    let newRadius;
    if (i > 0) {
      newRadius = radius / pow(0.75, i); // Decrease the radius by a fourth each iteration
    }
    else {
      newRadius = radius;
    }
    fill(color + (j * 20), 0, 0);
    noStroke();
    overlay.arc(normalHeight + yOffset + 80, x - 300, newRadius * 2, newRadius * 1.75, startAngle, endAngle);
    j--;
  }
}
function mousePressed() {
  saveCanvas('iloveyousm', 'png');
}
