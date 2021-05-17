// The SketchRNN model
let modelSketchRNN;
const modelsToDraw = [
  'ambulance',
  'angel',
  'ant',
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
  'dog',
  'dolphin',
  'duck',
  'elephant',
  'eye',
  'face',
  'fan',
  'firetruck',
  'flamingo',
  'flower',
  'frog',
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
  'pineapple',
  'pool',
  'postcard',
  'rabbit',
  'radio',
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
  'tiger',
  'toothbrush',
  'toothpaste',
  'tractor',
  'trombone',
  'truck',
  'whale',
  'windmill',
  'yoga',
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
let guessTry = 0;

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

  const clearButton = createButton("Clear");
  clearButton.parent('boutons');
  clearButton.mousePressed(clearCanvas);

  const finishButton = createButton("Finish");
  finishButton.parent('boutons');
  finishButton.mousePressed(guess);
}

function clearCanvas() {
  if (!playerAI) {
  background(255);    
  }
}

function modelDoodleReady() {
  console.log("Doodlemodel loaded");
}

function modelReady() {
  startDrawing();
}

function startDrawing() {
  background(255);
  x = width / 2;
  y = height / 2;
  modelSketchRNN.reset();
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
  console.log(playerAI);
  if (playerAI) {
    modelSketchRNN = ml5.sketchRNN(object);
    setTimeout(startDrawing, 3000);
  } else {
    alert("It's your turn ! Draw : " + object);
  }
}

function guess() {
  if (!playerAI) {
  modelDoodle.classify(canvas, gotResults);    
  }
}

function gotResults(error, results) {
  if (error) {
    console.log(error);
    return;
  }
  document.querySelector("#model").value = results[0].label;
  response();
}


function response() {
  let word = document.querySelector("#model").value;
  guessTry +=1;
  if (guessTry == 4) {
    alert("To much try");
    endGame();
  }else{
    if (playerAI) {
      let score = document.querySelector("#scorePlayer");
      if (object == word) {
        guessTry=0;
        document.querySelector("#model").style.backgroundColor = "green";
        scorePlayer += 1;
        score.innerHTML = "Player : " + scorePlayer;
        endGame();
      } else {
        document.querySelector("#model").style.backgroundColor = "red";
      }
    } else {
      let score = document.querySelector("#scoreComputer");
      if (object == word) {
        guessTry=0;
        document.querySelector("#model").style.backgroundColor = "green";
        scoreComputer += 1;
        score.innerHTML = "Computer : " + scoreComputer;
        endGame();
      } else {
        document.querySelector("#model").style.backgroundColor = "red";
      }
    }
  }
}

function endGame() {
  if (scoreComputer== 5 || scorePlayer == 5) {
    if (scorePlayer >= scoreComputer) {
      alert("Congratulation you win !");
    }else{
      alert("Sorry you loose :(");
    }
    scorePlayer = scoreComputer = 0;
    document.location.reload();
  }else{
    playerTurn();
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
    document.querySelector("#rules").style.display = "none";
    document.querySelector("main").removeAttribute("style");
    document.querySelector("footer").classList.toggle("translate");
    startDrawing();
  }, false);

  document.querySelector("#about").addEventListener("click", function () {
    document.querySelector("footer").classList.toggle("translate");
  })

