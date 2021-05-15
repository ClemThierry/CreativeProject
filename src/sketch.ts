// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    N: 300,
    seed: 6,
    rectVersion: false,
    Download_Image: () => save(),
}
gui.add(params, "N", 0, 300, 1)
gui.add(params, "rectVersion")
gui.add(params, "seed", 0, 50, 1)
gui.add(params, "Download_Image")



// -------------------
//       Drawing
// -------------------

function draw() {
    background(255, 255, 255)
    randomSeed(params.seed)
    fill(0, 0, 0, 0)
    stroke(0)
    strokeWeight(1)
    //Draw Noll version
    if (!params.rectVersion) {
        let change_x = true;
        let x = random(30, height - 30);
        let y = random(30, height - 30);

        beginShape();
        for (let index = 0; index < params.N; index++) {
            if (change_x) {
                x = random(30, width - 30);
            } else { //change_y
                y = random(30, height - 30);
            }
            vertex(x, y);
            change_x = !change_x;
        }
        endShape();
    } else { //Draw rectangle version
        let x, y, rectHeight, rectWidth
        for (let index = 0; index < params.N; index++) {
            x = random(30, width - 30)
            y = random(30, height - 30)
            rectHeight = random(20, height - y - 30)
            rectWidth = random(20, width - x - 30)
            rect(x, y, rectWidth, rectHeight)
        }
    }
}

// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()
}

function windowResized() {
    p6_ResizeCanvas()
}
