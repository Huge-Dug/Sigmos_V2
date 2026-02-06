document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('graphing-calc-canvas');
    const ctx = canvas.getContext('2d');
    const graph = document.getElementById("graphing-calc-canvas");
    const addNewItemButton = document.getElementById("add_new_item");

    let amountOfInserts = 1;

    let itemsGraphed = {

        "Points": [

        ],

        "Lines": [

        ],
    
    };

    function resizeCanvasToParent() {
        const parent = canvas.parentElement;
        const rect = parent.getBoundingClientRect();
        const scale = window.devicePixelRatio || 1;

        canvas.style.width  = rect.width + 'px';
        canvas.style.height = rect.height + 'px';

        canvas.width  = Math.floor(rect.width * scale);
        canvas.height = Math.floor(rect.height * scale);

        ctx.setTransform(scale, 0, 0, scale, 0, 0);
    }

    resizeCanvasToParent();
    window.addEventListener('resize', resizeCanvasToParent);

    var width = canvas.width;
    var height = canvas.height;
    var ratio = 3/2;
    var baseSize = 17;
    var squareSizeX = width / (baseSize * ratio);
    var squareSizeY = height / baseSize;
    

    var amountOfSquaresX = width / squareSizeX;
    var amountOfSquaresY = height / squareSizeY;

    if( amountOfSquaresX % 2 != 0 || amountOfSquaresY % 2 != 0 ) {
        while( amountOfSquaresX % 2 != 0 || amountOfSquaresY % 2 != 0 ) {
            baseSize = baseSize + 1;
            squareSizeX = width / (baseSize * ratio);
            squareSizeY = height / baseSize;
            amountOfSquaresX = width / squareSizeX;
            amountOfSquaresY = height / squareSizeY;
        }
    }

    console.log(baseSize, squareSizeX, squareSizeY);

    let offsetX = 0;
    let offsetY = 0;
    let realOriginX = width / 2 + offsetX;
    let realOriginY = height / 2 + offsetY;

    function drawGrid() {

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;

        const startX = Math.floor((-offsetX) / squareSizeX);
        const endX = Math.ceil((width - offsetX) / squareSizeX);

        for (let x = startX; x <= endX; x++) {
            const xPos = x * squareSizeX + offsetX;
            ctx.beginPath();
            ctx.moveTo(xPos, 0);
            ctx.lineTo(xPos, height);
            ctx.stroke();
        }

        const startY = Math.floor((-offsetY) / squareSizeY);
        const endY = Math.ceil((height - offsetY) / squareSizeY);

        for (let y = startY; y <= endY; y++) {
            const yPos = y * squareSizeY + offsetY;
            ctx.beginPath();
            ctx.moveTo(0, yPos);
            ctx.lineTo(width, yPos);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(realOriginX, realOriginY, squareSizeX / 2, 0, 360);
        ctx.stroke();

        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo((width / 2) + offsetX, height);
        ctx.lineTo((width / 2 + offsetX), 0);
        ctx.strokeStyle = '#00ff00';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, (height / 2) + offsetY);
        ctx.lineTo(width, (height / 2) + offsetY);
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();

        ctx.lineWidth = 1;

        itemCheck();

    };
    
    function convertToCanvasCoords(x, y) {
        x = realOriginX + (x * squareSizeX);
        y = realOriginY - (y * squareSizeY);
        return [x, y]
    }

    function plotPoint(x, y) {

        const realCords = convertToCanvasCoords(x, y)

        ctx.beginPath();
        ctx.arc(realCords[0], realCords[1], squareSizeX / 4, 0, 360);
        ctx.strokeStyle = '#001aff';
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.stroke();

    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    function refreshCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        itemCheck();
    }

    refreshCanvas();

    function readdListeners() {
        for (let i = 1; i <= amountOfInserts; i++) {
            const input = document.getElementById(`where_the_math_goes_${i}`);

            input.addEventListener('input', () => {
                refreshCanvas();

                if (input.value) {

                    try {
                        var array = JSON.parse("[" + input.value + "]");
                    }

                    catch (e) {
                        var array = null;
                    }

                    if(array != null) {
                        plotPoint(array[0], array[1])
                    }
                }
                
            });
        }
    }


    function itemCheck() {
        for (let i = 1; i <= amountOfInserts; i++) {
            const input = document.getElementById(`where_the_math_goes_${i}`);

            if (input.value) {

                try {
                    var array = JSON.parse("[" + input.value + "]");
                }

                catch (e) {
                    var array = null;
                }

                if(array != null) {
                    plotPoint(array[0], array[1])
                }
            }
                
            
        }
    }

    readdListeners();

    addNewItemButton.addEventListener('click', () => {
        amountOfInserts = amountOfInserts + 1;
        const whereYouPutMath = document.querySelector('.where_you_put_math');
        const newDiv = document.createElement('div');
        newDiv.style.display = 'flex';
        newDiv.style.height = '15%';
        newDiv.innerHTML = `<h2 class="whatever_this_thing_is_called">${amountOfInserts}</h2><input class="graphing-calc-text" type="text" id="where_the_math_goes_${amountOfInserts}" placeholder="...">`;
        whereYouPutMath.insertBefore(newDiv, addNewItemButton);

        readdListeners();
    });
    
    window.addEventListener('resize', () => {
        refreshCanvas();
        itemCheck();
    });

    var isDragging = false;
    var originalXPos = 0;
    var originalYPos = 0;
    let rect = canvas.getBoundingClientRect();

    graph.style.cursor = 'grab';

    function onMouseDown(event) {
        rect = canvas.getBoundingClientRect();
        isDragging = true;
        originalXPos = event.clientX - rect.left;
        originalYPos = event.clientY - rect.top;
        canvas.style.cursor = 'grabbing';
    }

    function onMouseMove(event) {

        if (!isDragging) return;

        rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const movementX = -(mouseX - originalXPos) * 1;
        const movementY = -(mouseY - originalYPos) * 1;

        offsetX -= movementX;
        offsetY -= movementY;

        originalXPos = mouseX;
        originalYPos = mouseY;

        realOriginX = width / 2 + offsetX;
        realOriginY = height / 2 + offsetY;

        console.log(offsetX, offsetY)

        canvas.style.cursor = 'grabbing';
        
        refreshCanvas();

        itemCheck();

    }

    function onMouseUp(event) {
        isDragging = false;
        canvas.style.cursor = 'grab';
        itemCheck();
    }

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseout', onMouseUp)

});