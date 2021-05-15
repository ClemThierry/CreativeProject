var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
};
gui.add(params, "Download_Image");
var model;
var modelsToDraw = [
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
    'beeflower',
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
    'catbus',
    'catpig',
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
    'fire_hydrant',
    'firetruck',
    'flamingo',
    'flower',
    'floweryoga',
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
    'palm_tree',
    'parrot',
    'passport',
    'peas',
    'penguin',
    'pig',
    'pigsheep',
    'pineapple',
    'pool',
    'postcard',
    'power_outlet',
    'rabbit',
    'rabbitturtle',
    'radio',
    'radioface',
    'rain',
    'rhinoceros',
    'rifle',
    'roller_coaster',
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
    'the_mona_lisa',
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
var object = modelsToDraw[Math.floor(Math.random() * modelsToDraw.length)];
var previousPen = "down";
var x, y;
var strokePath;
function pickRandomDrawing() {
    object = modelsToDraw[Math.floor(Math.random() * modelsToDraw.length)];
    return object;
}
function preload() {
    model = ml5.sketchRNN(object);
}
console.log('ml5 version:', ml5.version);
function setup() {
    createCanvas(640, 480);
    background(220);
    var button = createButton("Replay");
    button.mousePressed(startDrawing);
    startDrawing();
}
function modelReady() {
    console.log("model loaded");
    startDrawing();
}
function startDrawing() {
    background(220);
    x = width / 2;
    y = height / 2;
    model.reset();
    model.generate(gotStroke);
    console.log(object);
}
function draw() {
    if (strokePath) {
        if (previousPen === "down") {
            stroke(0);
            strokeWeight(3.0);
            line(x, y, x + strokePath.dx, y + strokePath.dy);
        }
        x += strokePath.dx;
        y += strokePath.dy;
        previousPen = strokePath.pen;
        if (strokePath.pen !== "end") {
            strokePath = null;
            model.generate(gotStroke);
        }
    }
}
function gotStroke(err, s) {
    strokePath = s;
}
var scorePlayer = 0, let, scoreAI = 0;
document.querySelector("#validation").addEventListener("click", function (event) {
    event.preventDefault();
    var word = document.querySelector("#model").value;
    var score = document.querySelector("#scorePlayer");
    if (object == word) {
        scorePlayer += 1;
        score.innerHTML = "You : " + scorePlayer;
        model = ml5.sketchRNN(pickRandomDrawing());
    }
}, false);
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