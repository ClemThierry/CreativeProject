// The SketchRNN model
let modelSketchRNN;
const modelsToDraw = [
  'alarm_clock',
  'ambulance',
  'angel',
  'ant',
  'antyoga',
  'backpack',
  'barn',
  'basket',
  'bear',
  'bee',
  'bicycle',
  'bird',
  'book',
  'brain',
  'bridge',
  'bulldozer',
  'bus',
  'butterfly',
  'cactus',
  'calendar',
  'castle',
  'cat',
  'chair',
  'couch',
  'crab',
  'crabchair',
  'crabrabbitfacepig',
  'cruise_ship',
  'diving_board',
  'dog',
  'dogbunny',
  'dolphin',
  'duck',
  'elephant',
  'elephantpig',
  'eye',
  'face',
  'fan',
  'firetruck',
  'flamingo',
  'flower',
  'frog',
  'frogsofa',
  'garden',
  'hand',
  'hedgeberry',
  'hedgehog',
  'helicopter',
  'kangaroo',
  'key',
  'lantern',
  'lighthouse',
  'lion',
  'lionsheep',
  'lobster',
  'map',
  'mermaid',
  'monapassport',
  'monkey',
  'mosquito',
  'octopus',
  'owl',
  'paintbrush',
  'parrot',
  'passport',
  'peas',
  'penguin',
  'pig',
  'pigsheep',
  'pineapple',
  'pool',
  'postcard',
  'rabbit',
  'rabbitturtle',
  'radio',
  'radioface',
  'rain',
  'rhinoceros',
  'rifle',
  'sandwich',
  'scorpion',
  'sea_turtle',
  'sheep',
  'skull',
  'snail',
  'snowflake',
  'speedboat',
  'spider',
  'squirrel',
  'steak',
  'stove',
  'strawberry',
  'swan',
  'swing_set',
  'tiger',
  'toothbrush',
  'toothpaste',
  'tractor',
  'trombone',
  'truck',
  'whale',
  'windmill',
  'yoga',
  'yogabicycle',
  'everything',
];
let object = modelsToDraw[Math.floor(Math.random() * modelsToDraw.length)];

//The Doodle model
let modelDoodle;

// Start by drawing
let previousPen = "down";
// Current location of drawing
let x, y;
// The current "stroke" of the drawing
let strokePath;
let canvas;

let scorePlayer = 0;
let scoreComputer = 0;
let playerAI = true;

function pickRandomDrawing() {
  object = modelsToDraw[Math.floor(Math.random() * modelsToDraw.length)];
  return object;
}

// For when SketchRNN is fixed
function preload() {
  modelSketchRNN = ml5.sketchRNN(object);
  modelDoodle = ml5.imageClassifier('DoodleNet', modelDoodleReady);
}

function setup() {
  canvas = createCanvas(500, 500);
  background(255);

  let divBouton = createDiv();
  divBouton.id('boutons');
  divBouton.parent(document.querySelector('main'));

  // Button to reset drawing
  const replayButton = createButton("Replay");
  replayButton.parent('boutons');
  replayButton.mousePressed(startDrawing);

  const clearButton = createButton("Clear");
  clearButton.parent('boutons');
  clearButton.mousePressed(clearCanvas);

  const finishButton = createButton("Finish");
  finishButton.parent('boutons');
  finishButton.mousePressed(guess);
}

function clearCanvas() {
  background(255);
}

function modelDoodleReady() {
  console.log("Doodlemodel loaded");
}

function modelReady() {
  startDrawing();
}

// Reset the drawing
function startDrawing() {
  background(255);
  // Start in the middle
  x = width / 2;
  y = height / 2;
  modelSketchRNN.reset();
  // Generate the first stroke path
  modelSketchRNN.generate(gotStroke);
  console.log(object);
}

function draw() {
  stroke(0);
  strokeWeight(16);
  if (playerAI) {
    // If something new to draw
    if (strokePath) {
      // If the pen is down, draw a line
      if (previousPen === "down") {
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
        modelSketchRNN.generate(gotStroke);
      }
    }
  } else {
    if (mouseIsPressed) {
      strokeWeight(25);
      line(mouseX, mouseY, pmouseX, pmouseY);
    }
  }
}

// A new stroke path
function gotStroke(err, s) {
  strokePath = s;
}

function playerTurn() {
  playerAI = !playerAI;
  clearCanvas();
  object = pickRandomDrawing();
  if (playerAI) {
    modelSketchRNN = ml5.sketchRNN(object);
  } else {
    alert("It's your turn ! Draw : " + object);
  }
}

function guess() {
  console.log("l'ordinateur suppose");
  modelDoodle.classify(canvas, gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  console.log("2e fonction appelée");
  document.querySelector("#model").value = results[0].label;
  response();
}

function response() {
  let word = document.querySelector("#model").value;

  if (playerAI) {
    let score = document.querySelector("#scorePlayer");
    if (object == word) {
      document.querySelector("#model").style.backgroundColor = "green";
      scorePlayer += 1;
      score.innerHTML = "Player : " + scorePlayer;
      playerTurn();
    } else {
      document.querySelector("#model").style.backgroundColor = "red";
    }
  } else {
    let score = document.querySelector("#scoreComputer");
    if (object == word) {
      document.querySelector("#model").style.backgroundColor = "green";
      scoreComputer += 1;
      score.innerHTML = "Computer : " + scoreComputer;
      //prochain tour
      playerTurn();

      //Créer une fonction pour changer le dessin (object)
      //changement de dessin    
      // modelSketchRNN = ml5.sketchRNN(pickRandomDrawing());
    } else {
      document.querySelector("#model").style.backgroundColor = "red";
    }
  }
}

  document.querySelector("#validation").addEventListener("click", function (event) {
    event.preventDefault();
    response();
  }, false);

  document.querySelector("#model").addEventListener("click", function () {
    this.style.backgroundColor = "white";
  })

  document.querySelector("#play").addEventListener("click", function (event) {
    event.preventDefault();
    this.style.display = "none";
    document.querySelector("main").removeAttribute("style");
    startDrawing();
  }, false);


