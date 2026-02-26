import * as Objects from "./Objects.js";
import * as Dialouge from "../dialouge/Wyatt.js"

var canvas = document.getElementById('graphing-calc-canvas')
var ctx = canvas.getContext('2d');
var keysPressed = {}

var currentAttack = "Intro";
var attacks = ["ChickenPatty", "Attack2", "Attack3", "Attack4", "Attack5"]
var items =[]
var attackStartFrame = 0;

var currentFrame = 0;

var graphingGraphThing = document.getElementById('graphingGraphThing');

var temporarySpeech = ""

var playerOrign = null;
var playerImage = new Image();
playerImage.src = "../static/img/sigmos.png"
var player = null;

var wyattImage = new Image();
wyattImage.src = "../static/img/WyattSprites/wyatt.png"
var wyatt = null;

export function startTheFight() {

    var whereYouPutMath = document.getElementById("where_you_put_math")
    whereYouPutMath.innerHTML = ""
    whereYouPutMath.outerHTML = ""

    var navbar = document.getElementById("navbar")
    navbar.style.background = "black"
    navbar.innerHTML = "<h1 style='color: #ffffff;' id='wyattTitle'>DUGMOS</h1><div style='color: #ffffff;' id='wyattHealth'>Wyatt's Health: ???</div>"
    
    canvas.style.backgroundColor = "black"
    graphingGraphThing.style.width = "100%"
    
    document.addEventListener('keydown', (e) => {
        keysPressed[e.key.toLowerCase()] = true
    })
    
    document.addEventListener('keyup', (e) => {
        keysPressed[e.key.toLowerCase()] = false
    })

    playerOrign = {x: (canvas.width / 2), y: (canvas.height * (3 / 5) + (canvas.height / 8))}
    player = new Objects.Player(playerOrign.x, playerOrign.y, 100, 1.5, canvas.width / 24, canvas.width / 24, playerImage)

    wyatt = new Objects.Enemy((canvas.width / 2) - canvas.width / 6, (canvas.height / 2) - canvas.width / 3, canvas.width / 3, canvas.width / 3, 67410, wyattImage)

    updateFrame()

}
    
function updateFrame() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    var boundingBoxStart = [(canvas.width / 3), (canvas.height * (3 / 5))]
    var boundingBoxSize = [canvas.width / 3, canvas.height / 4]
        
    var box = new Objects.BoundingBox(boundingBoxStart[0], boundingBoxStart[1], boundingBoxSize[0], boundingBoxSize[1])
    box.draw(ctx)
    player.setBoundingBox(box)

    if (keysPressed['w']) player.move(0, -1)
    if (keysPressed['a']) player.move(-1, 0)
    if (keysPressed['s']) player.move(0, 1)
    if (keysPressed['d']) player.move(1, 0)

    navbar.innerHTML = "<h1 style='color: #ffffff;' id='wyattTitle'>DUGMOS</h1><div style='color: #ffffff;' id='wyattHealth'>Wyatt's Health: " + wyatt.getHealth() + "</div>"
        
    player.draw(ctx)
    wyatt.draw(ctx)
    
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].update();
        items[i].draw(ctx);
        
        if (player.isColliding(items[i])) {
            player.inflate();
            items[i].destroy();
        }
    }

    currentFrame++

    attackLoop(currentFrame)
    
    requestAnimationFrame(updateFrame)

}

function drawWrappedCenteredText(ctx, text, centerX, centerY, maxWidth, lineHeight) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let testLine = currentLine + " " + words[i];
        let metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } 
        
        else {
            currentLine = testLine;
        }
    }

    lines.push(currentLine);

    const totalHeight = lines.length * lineHeight;
    let startY = centerY - totalHeight / 2 + lineHeight / 2;

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], centerX, startY + i * lineHeight);
    }
}

function attackLoop(currentFrame) {
    if (currentAttack == "Intro") {
        if (currentFrame % 10 == 0) {
            temporarySpeech += Dialouge.introduction.charAt(temporarySpeech.length)
        }

        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        drawWrappedCenteredText(ctx, temporarySpeech, canvas.width / 2, canvas.height / 2, 400, 28);

        if (temporarySpeech.length >= Dialouge.introduction.length) {
            currentAttack = "ChickenPatty"
            attackStartFrame = currentFrame
            temporarySpeech = ""
        }

    }

    if (currentAttack == "ChickenPatty") {
        
        if (currentFrame == attackStartFrame) {
            var chickenPattyImage = new Image();
            chickenPattyImage.src = "../static/img/ChickenPatty.png"

            var chickenPatty = new Objects.Projectile(canvas.width / 3, canvas.height / 8, 2, 0, 1, canvas.width / 10, canvas.width / 10, chickenPattyImage)
            chickenPatty.image = chickenPattyImage
            items.push(chickenPatty)
            attackStartFrame += 100
        }
    }

}
