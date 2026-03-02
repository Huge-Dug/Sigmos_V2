import * as Objects from "./Objects.js";
import * as Dialouge from "../dialouge/Wyatt.js"

var canvas = document.getElementById('graphing-calc-canvas')
var ctx = canvas.getContext('2d');
var graphingGraphThing = document.getElementById('graphingGraphThing');

var keysPressed = {};
var lastFrameTime = performance.now();

var currentAttack = "Intro";
var attacks = Array("ChickenPatty", "WeridThings", "Highlighter")
var attackAmount = 0;

var items =[]

var currentTaunt = null;

var attackStartFrame = 0;
var generalAssumedFramesPerSecond = 30
var currentFrame = 0;
var fps = null;
var painFrames = null;
var painFramesCount = null;

var temporarySpeech = ""

var playerOrign = null;
var playerImage = new Image();
playerImage.src = "../static/img/sigmos.png"
var player = null;

var wyattImage = new Image();
wyattImage.src = "../static/img/WyattSprites/wyatt.png"
var wyatt = null;
var wyattPosition = null;

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
    player = new Objects.Player(playerOrign.x, playerOrign.y, 100, 0, canvas.width / 24, canvas.width / 24, playerImage)

    wyatt = new Objects.Enemy((canvas.width / 2) - canvas.width / 6, (canvas.height / 2) - canvas.width / 3, canvas.width / 3, canvas.width / 3, 1000, wyattImage)
    
    lastFrameTime = performance.now();
    updateFrame()

}

function getFramesPerSecond() {
    
    var now = performance.now();
    var delta = now - lastFrameTime;
    lastFrameTime = now;
    var fps = 1000 / delta;
    
    return Math.round(fps);
    
}

function write(text, canSpeedUp = true, canSkip = true, isAnAction = false) {

    if(!(temporarySpeech.length >= text.length)) {
        if (keysPressed['shift'] && canSpeedUp) {
            temporarySpeech = text
        }

    }

    if (currentFrame % (2 * math.ceil(fps / generalAssumedFramesPerSecond)) == 0) {
        temporarySpeech += text.charAt(temporarySpeech.length)
    }

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    drawWrappedCenteredText(ctx, temporarySpeech, canvas.width / 2, canvas.height / 2, 400, 28);

    if(keysPressed[' '] && isAnAction) {
        temporarySpeech = ""
        return "Done"
    }

    if (temporarySpeech.length >= text.length) {

        if(keysPressed['enter'] && canSkip) {
            temporarySpeech = ""
            return "Done"
        }
    
    }
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

    fps = getFramesPerSecond()
    navbar.innerHTML = "<h1 style='color: #ffffff;' id='wyattTitle'>DUGMOS</h1><div style='color: #ffffff;' id='wyattHealth'>Wyatt's Health: " + wyatt.getHealth() + " | Your Health: " + player.getHealth() + "</div>"
        
    player.draw(ctx)
    player.updateSpeed(Math.ceil((generalAssumedFramesPerSecond / fps)) * 5)
    wyatt.draw(ctx)
    
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].update();
        items[i].draw(ctx);
        
        if (player.isColliding(items[i])) {
            if(items[i].getId() == "ChickenPatty") {
                player.inflate();
            }
            
            player.takeDamage(items[i].getDamage());
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

    if(wyatt.getHealth() <= 0) {
        if(write("Guh! You... you... defeated me, no this CAN'T BE!", false, false, false) == "Done") {
            return
        }
        return
    }

    if(player.getHealth() <= 0) {
        if(write("Well, THAT was easy!", false, false, false) == "Done") {
            return
        }
        return
    }

    if (currentAttack == "Intro") {

        if(write(Dialouge.introduction) == "Done") {
            currentAttack = attacks[Math.floor(Math.random() * attacks.length)]
            attackStartFrame = currentFrame + 10 * (Math.round(fps / generalAssumedFramesPerSecond))
        }
        
    }

    else if (currentAttack == "Player") {

        if(write("(Press SPACE to attack!)", true, false, true) == "Done") {
            wyatt.takeDamage(100)
            currentAttack = "Taunt"
            attackStartFrame = currentFrame + 10 * (Math.round(fps / generalAssumedFramesPerSecond))
        }
    }

    else if (currentAttack == "ChickenPatty") {
        
        if (currentFrame == attackStartFrame) {

            if (attackAmount < 10) {

                var chickenPattyImage = new Image();
                chickenPattyImage.src = "../static/img/ChickenPatty.png"

                var chickenPatty = new Objects.Projectile((((canvas.width / 2) + (canvas.width / 4)) / (Math.random() * 2 + 1)), canvas.height / 8, 20 / (Math.round(fps / generalAssumedFramesPerSecond)) , 0, 1, canvas.width / 10, canvas.width / 10, chickenPattyImage, "ChickenPatty", 5)
                chickenPatty.image = chickenPattyImage
                items.push(chickenPatty)
                attackStartFrame += 16 * (Math.round(fps / generalAssumedFramesPerSecond))
                attackAmount++

            }

            else {

                attackAmount = 0;
                currentAttack = 'Player'
            }
        }
    }

    else if(currentAttack == "WeridThings") {
        
        if (currentFrame == attackStartFrame) {

            if (attackAmount < 75) {

                console.log("CMing")

                var weridTThingImage = new Image();
                weridTThingImage.src = "../static/img/werid_thing.png"

                var weridThing = new Objects.Projectile(0, canvas.width / 2 * (Math.random() * 2), 60 / (Math.round(fps / generalAssumedFramesPerSecond)), 1, ((Math.random() * 2) - 1) * (3/4), canvas.width / 32, canvas.width / 32, weridTThingImage, "WeridThing", 1)
                weridThing.image = weridTThingImage
                items.push(weridThing)
                attackStartFrame += 1 * (Math.ceil(fps / generalAssumedFramesPerSecond))
                attackAmount++

            }

            else {
                
                if(player.isInflated()) {
                    
                    player.deflate()
                }
                
                attackAmount = 0;
                currentAttack = 'Player'
            }
        }
    }

    else if(currentAttack == "Highlighter") {
        if (currentFrame == attackStartFrame) {

            if (attackAmount < 10) {

                var highlighterImage = new Image();
                highlighterImage.src = "../static/img/highlighter.png"

                var highlighter = new Objects.Projectile(-canvas.width, player.y, 75 / (Math.round(fps / generalAssumedFramesPerSecond)), 1, 0, canvas.width / 4, canvas.width / 32, highlighterImage, "Highlighter", 15)
                highlighter.image = highlighterImage
                items.push(highlighter)
                attackStartFrame += 25 * (Math.ceil(fps / generalAssumedFramesPerSecond))
                attackAmount++

            }

            else {
                
                if(player.isInflated()) {
                    
                    player.deflate()
                }
                
                attackAmount = 0;
                currentAttack = 'Player'
            }
        }
    }

    

    else if(currentAttack == 'Taunt') {

        if(currentTaunt == null) {
            currentTaunt = Dialouge.taunts[(Math.floor(Math.random() * Dialouge.taunts.length))]
        }

        if(write(currentTaunt) == "Done") {
            currentTaunt = null
            currentAttack = attacks[Math.floor(Math.random() * attacks.length)]
            attackStartFrame = currentFrame + 10 * (Math.round(fps / generalAssumedFramesPerSecond))
        }

    }

    else {
        
    }

}
