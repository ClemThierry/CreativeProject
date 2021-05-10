var gui = new dat.GUI();
var params = {
    Download_Image: function () { return save(); },
};
gui.add(params, "Download_Image");
var model;
var previousPen = "down";
var x, y;
var strokePath;
var seedStrokes = [];
var canvas;
function draw() {
    if (mouseIsPressed) {
        stroke(0);
        strokeWeight(3.0);
        line(pmouseX, pmouseY, mouseX, mouseY);
        var userStroke = {
            dx: mouseX - pmouseX,
            dy: mouseY - pmouseY,
            pen: "down",
        };
        seedStrokes.push(userStroke);
    }
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
function setup() {
    canvas = p6_CreateCanvas();
    background(220);
    model = ml5.sketchRNN("cat", modelReady);
    var button = select("#clear");
    button.mousePressed(clearDrawing);
}
function windowResized() {
    p6_ResizeCanvas();
}
function modelReady() {
    canvas.mouseReleased(startSketchRNN);
    select("#status").html("model ready - sketchRNN will begin after you draw with the mouse");
}
function clearDrawing() {
    background(220);
    seedStrokes = [];
    model.reset();
}
function startSketchRNN() {
    x = mouseX;
    y = mouseY;
    model.generate(seedStrokes, gotStroke);
}
function gotStroke(err, s) {
    strokePath = s;
}
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