var modelSketchRNN;
var modelsToDraw = [
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
var object = modelsToDraw[Math.floor(Math.random() * modelsToDraw.length)];
var modelDoodle;
var previousPen = "down";
var x, y;
var strokePath;
var canvas;
var scorePlayer = 0;
var scoreComputer = 0;
var playerAI = true;
var guessTry = 0;
function pickRandomDrawing() {
    object = modelsToDraw[Math.floor(Math.random() * modelsToDraw.length)];
    return object;
}
function preload() {
    modelSketchRNN = ml5.sketchRNN(object);
    modelDoodle = ml5.imageClassifier('DoodleNet', modelDoodleReady);
}
function setup() {
    canvas = createCanvas(500, 500);
    background(255);
    var divBouton = createDiv();
    divBouton.id('boutons');
    divBouton.parent(document.querySelector('main'));
    var clearButton = createButton("Clear");
    clearButton.parent('boutons');
    clearButton.mousePressed(clearCanvas);
    var finishButton = createButton("Finish");
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
        if (strokePath) {
            if (previousPen === "down") {
                line(x, y, x + strokePath.dx, y + strokePath.dy);
            }
            x += strokePath.dx;
            y += strokePath.dy;
            previousPen = strokePath.pen;
            if (strokePath.pen !== "end") {
                strokePath = null;
                modelSketchRNN.generate(gotStroke);
            }
        }
    }
    else {
        if (mouseIsPressed) {
            strokeWeight(25);
            line(mouseX, mouseY, pmouseX, pmouseY);
        }
    }
}
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
    }
    else {
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
    var word = document.querySelector("#model").value;
    guessTry += 1;
    if (guessTry == 4) {
        alert("To much try");
        endGame();
    }
    else {
        if (playerAI) {
            var score = document.querySelector("#scorePlayer");
            if (object == word) {
                guessTry = 0;
                document.querySelector("#model").style.backgroundColor = "green";
                scorePlayer += 1;
                score.innerHTML = "Player : " + scorePlayer;
                endGame();
            }
            else {
                document.querySelector("#model").style.backgroundColor = "red";
            }
        }
        else {
            var score = document.querySelector("#scoreComputer");
            if (object == word) {
                guessTry = 0;
                document.querySelector("#model").style.backgroundColor = "green";
                scoreComputer += 1;
                score.innerHTML = "Computer : " + scoreComputer;
                endGame();
            }
            else {
                document.querySelector("#model").style.backgroundColor = "red";
            }
        }
    }
}
function endGame() {
    if (scoreComputer == 5 || scorePlayer == 5) {
        if (scorePlayer >= scoreComputer) {
            alert("Congratulation you win !");
        }
        else {
            alert("Sorry you loose :(");
        }
        scorePlayer = scoreComputer = 0;
        document.location.reload();
    }
    else {
        playerTurn();
    }
}
document.querySelector("#validation").addEventListener("click", function (event) {
    event.preventDefault();
    response();
}, false);
document.querySelector("#model").addEventListener("click", function () {
    this.style.backgroundColor = "white";
});
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
});
var __ASPECT_RATIO = 1;
var __MARGIN_SIZE = 25;
function __desiredCanvasWidth() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return windowWidth - __MARGIN_SIZE * 2;
    }
    else {
        return __desiredCanvasHeight() * __ASPECT_RATIO;
    }
}
function __desiredCanvasHeight() {
    var windowRatio = windowWidth / windowHeight;
    if (__ASPECT_RATIO > windowRatio) {
        return __desiredCanvasWidth() / __ASPECT_RATIO;
    }
    else {
        return windowHeight - __MARGIN_SIZE * 2;
    }
}
var __canvas;
function __centerCanvas() {
    __canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
function p6_CreateCanvas() {
    __canvas = createCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
function p6_ResizeCanvas() {
    resizeCanvas(__desiredCanvasWidth(), __desiredCanvasHeight());
    __centerCanvas();
}
var p6_SaveImageSequence = function (durationInFrames, fileExtension) {
    if (frameCount <= durationInFrames) {
        noLoop();
        var filename_1 = nf(frameCount - 1, ceil(log(durationInFrames) / log(10)));
        var mimeType = (function () {
            switch (fileExtension) {
                case 'png':
                    return 'image/png';
                case 'jpeg':
                case 'jpg':
                    return 'image/jpeg';
            }
        })();
        __canvas.elt.toBlob(function (blob) {
            p5.prototype.downloadFile(blob, filename_1, fileExtension);
            setTimeout(function () { return loop(); }, 100);
        }, mimeType);
    }
};
//# sourceMappingURL=../src/src/build.js.map