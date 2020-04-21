import './assets/style.css';
import { getSprite } from './assetLoader.js';
import { STORE } from './store.js';
import { CONFIG } from './config.js';
import { drawAsset, drawAssets, drawAssetRotated, drawLoadingBar, animateAssets } from './draw.js';
import { initNewGame } from './init.js'

var gtx, c, cursorX, cursorY, draggingItem, dragOffsetX, dragOffsetY, spool;
var HEIGHT = 181 * STORE.increase;
var WIDTH = 287 * STORE.increase;
var VERSION = '1.2.1';
let mousePositionFix;

// things needed to show loading bar
const canvasElement = document.createElement("canvas");
canvasElement.height = HEIGHT;
canvasElement.width = WIDTH;
STORE.ctx = canvasElement.getContext("2d", {alpha: false});
STORE.ctx.imageSmoothingEnabled = false;
document.body.append(canvasElement);
resize();
// drawLoadingBar(0);
// setMainVolume();

// window.onunload  = function () {
//     save();
// }

// window.pagehide = function () {
//     save();
// }

window.onload = function () {
    setInterval(frame, CONFIG.frameInterval);
    mousePositionFix = getMousePositionFix();
    addGhostCanvas();
    addListeners();
    initNewGame();
}

function addGhostCanvas() {
    const ghostCanvasElement = document.createElement("canvas");
    ghostCanvasElement.height = HEIGHT / STORE.increase;
    ghostCanvasElement.width = WIDTH / STORE.increase;
    gtx = ghostCanvasElement.getContext("2d");
};

function addListeners() {
    window.addEventListener('resize', resize, false);

    canvasElement.addEventListener('mousedown',(e) => {
        e.stopPropagation();
        e.preventDefault();
        interactStart(e.pageX, e.pageY); 
    });
    canvasElement.addEventListener('mousemove', (e) => { interactMove(e.pageX, e.pageY, true)});
    canvasElement.addEventListener('mouseup', (e) => {interactStop(e)});

    canvasElement.addEventListener('touchstart',(e) => {
        e.stopPropagation();
        e.preventDefault();
        interactStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY); 
    });
    canvasElement.addEventListener('touchmove',(e) => {
        e.preventDefault(); 
        interactMove(e.changedTouches[0].pageX, e.changedTouches[0].pageY, false);
    });
    canvasElement.addEventListener('touchend', (e) => {interactStop(e)});
}

function frame() {
    drawAsset(STORE.ctx, {spriteSheet: getSprite('bg'), x: 0, y: 0, spriteWidth: 287, spriteHeight: 181 });
    STORE.spool.draw({cursorX, cursorY});

    STORE.character.draw();
    drawAssets(STORE.items);
    drawAssets(STORE.buttons);
    animateAssets(STORE.items);

}

function getItemUnderCursor(){
    return getItemUnderCursorFromArray(STORE.buttons);
}

function getItemUnderCursorFromArray(array) {
    for (let i = array.length -1; i > -1; i--) {
        const asset = array[i];

        const smallCursorX = cursorX / STORE.increase;
        const smallCursorY = cursorY / STORE.increase;

        // if (asset.type !== 'static' && checkIfAllowedInTutorial(asset)) {
        if (asset.type !== 'static') {
            const withinLeft = smallCursorX > asset.left() - 20;
            const withinRight = smallCursorX < asset.right() + 20;
            const withinTop = smallCursorY > asset.top() - 20;
            const withinBottom = smallCursorY < asset.bottom() + 20;

            if (withinLeft && withinRight && withinTop && withinBottom){
                drawAsset(gtx, asset, true);
                const imageData = gtx.getImageData(smallCursorX, smallCursorY, 1, 1);
                gtx.clearRect(0, 0, WIDTH, HEIGHT);
    
                if (imageData.data[3] === 255){
                    return asset;
                }
            }
        }
    }
}


function resize (){
    const canvasRatio = canvasElement.height / canvasElement.width;
    const windowRatio = window.innerHeight / window.innerWidth;
    let width;
    let height;

    if (windowRatio < canvasRatio) {
        height = window.innerHeight;
        width = height / canvasRatio;
    } else {
        width = window.innerWidth;
        height = width * canvasRatio;
    }

    canvasElement.style.width = width + 'px';
    canvasElement.style.height = height + 'px';
    mousePositionFix = getMousePositionFix();
};
function getMousePositionFix (){
    return WIDTH / canvasElement.offsetWidth;// prev 0.2
};

function interactStart(x, y){
    // startMusic();
    cursorX = Math.trunc((x - canvasElement.offsetLeft)  * mousePositionFix);
    cursorY = Math.trunc((y- canvasElement.offsetTop) * mousePositionFix);
    draggingItem = getItemUnderCursor();
    // console.log('x', cursorX / STORE.increase, 'y', cursorY / STORE.increase);
    if (draggingItem && draggingItem.type !== 'button'){
        dragOffsetX = cursorX - (draggingItem.x * STORE.increase);
        dragOffsetY = cursorY - (draggingItem.y * STORE.increase);
        // draggingItem.area = null;

        if (draggingItem.dragStart){
            draggingItem.dragStart();
        }
    }
}

function checkIfAllowedInTutorial(asset){
    if (STORE.panels.tutorialPageNumber < 1) return true; // not in tutorial
    const clickableTypes = STORE.instructions[STORE.panels.tutorialPageNumber - 1].clickableTypes;
    for (var i = 0; i < clickableTypes.length; i++) {
        const idMatches = asset.id === clickableTypes[i].id;
        const typeMatches = asset.type === clickableTypes[i].type;
        const imageMatches = asset.imageId === clickableTypes[i].imageId;

        if (clickableTypes[i].id){
            if (idMatches) return true;
        } else if (!clickableTypes[i].imageId){// if no imageId
            if (typeMatches) return true;
        } else { // has image id
            if (imageMatches) return true;
        };
    };
    return false;
}

function interactMove(x, y, hoverEnabled){
    cursorX = Math.trunc((x - canvasElement.offsetLeft)  * mousePositionFix);
    cursorY = Math.trunc((y- canvasElement.offsetTop) * mousePositionFix);
    let hoverItem;
    if (hoverEnabled && !draggingItem){ //not on mobile, and not currently dragging something
        hoverItem = getItemUnderCursor();
    }

    if (hoverItem){
        canvasElement.style.cursor = "pointer";
        hoverItem.hover = true;
        STORE.somethingIsHovering = true;
        if (hoverItem.startHover) {
            hoverItem.startHover();
        }
    }
    else {
        canvasElement.style.cursor = "auto"
        STORE.somethingIsHovering = false;
    }
}

function interactStop(e){
    if (draggingItem){
        if (draggingItem.type === 'button'){
            draggingItem.clicked();
        } else {
            draggingItem.destinationX = null;
            draggingItem.destinationY = null;
            draggingItem.area = getArea(draggingItem);
    
            if (draggingItem.dragStop){
                draggingItem.dragStop();
            }
        }
        draggingItem = false;
    }
}

function addPolyfills() {
    Object.defineProperty(Array.prototype, 'flat', {
        value: function(depth = 1) {
          return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
          }, []);
        }
    });
}