// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    Download_Image: () => save(),
}
gui.add(params, "Download_Image")

// The SketchRNN model
let model;
// Start by drawing
let previousPen = "down";
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;
let seedStrokes = [];
let canvas;

// -------------------
//       Drawing
// -------------------

function draw() {
      // If the mosue is pressed capture the user strokes
  if (mouseIsPressed) {
    // Draw line
    stroke(0);
    strokeWeight(3.0);
    line(pmouseX, pmouseY, mouseX, mouseY);
    // Create a "stroke path" with dx, dy, and pen
    const userStroke = {
      dx: mouseX - pmouseX,
      dy: mouseY - pmouseY,
      pen: "down",
    };
    // Add to the array
    seedStrokes.push(userStroke);
  }

  // If something new to draw
  if (strokePath) {
    // If the pen is down, draw a line
    if (previousPen === "down") {
      stroke(0);
      strokeWeight(3.0);
      line(x, y, x + strokePath.dx, y + strokePath.dy);
    }
    // Move the pen
    x += strokePath.dx;
    y += strokePath.dy;
    // The pen state actually refers to the next stroke
    previousPen = strokePath.pen;

    // If the drawing is complete
    if (strokePath.pen !== "end") {
      strokePath = null;
      model.generate(gotStroke);
    }
  }
}

// -------------------
//    Initialization
// -------------------

function setup() {
    canvas = p6_CreateCanvas();

    background(220);
    // Load the model
    // See a list of all supported models: https://github.com/ml5js/ml5-library/blob/master/src/SketchRNN/models.js
    model = ml5.sketchRNN("cat", modelReady);
  
    // Button to start drawing
    const button = select("#clear");
    button.mousePressed(clearDrawing);
}

function windowResized() {
    p6_ResizeCanvas()
}

// The model is ready
function modelReady() {
    // sketchRNN will begin when the mouse is released
    canvas.mouseReleased(startSketchRNN);
    select("#status").html("model ready - sketchRNN will begin after you draw with the mouse");
  }

// Reset the drawing
function clearDrawing() {
    background(220);
    // clear seed strokes
    seedStrokes = [];
    // Reset model
    model.reset();
  }

  // sketchRNN takes over
function startSketchRNN() {
    // Start where the mouse left off
    x = mouseX;
    y = mouseY;
    // Generate with the seedStrokes
    model.generate(seedStrokes, gotStroke);
  }

  // A new stroke path
function gotStroke(err, s) {
    strokePath = s;
  }