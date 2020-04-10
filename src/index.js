import './assets/style.css';
import { getSprite } from './assetLoader.js';
import { STORE } from './store.js';
import { CONFIG } from './config.js';
import { drawAsset } from './draw.js';

var gtx, c, cursorX, cursorY, draggingItem, dragOffsetX, dragOffsetY;
var HEIGHT = 600 * STORE.increase;
var WIDTH = 600 * STORE.increase;
var VERSION = '1.2.1';
let mousePositionFix;

// things needed to show loading bar
const canvasElement = document.createElement("canvas");
canvasElement.height = HEIGHT;
canvasElement.width = WIDTH;
STORE.ctx = canvasElement.getContext("2d", {alpha: false});
STORE.ctx.imageSmoothingEnabled = false;
document.body.append(canvasElement);
// resize();
// drawLoadingBar(0);
// setMainVolume();

window.onunload  = function () {
    save();
}

window.pagehide = function () {
    save();
}

window.onload = function () {
    drawAsset(STORE.ctx, {spriteSheet: getSprite('spool'), x: 0, y: 0, spriteWidth: 200, spriteHeight: 200 });
}

function getItemUnderCursor(){
    if (STORE.panels.objectiveCompletePopupIsOpen){
        return getItemUnderCursorFromArray(STORE.panels.objectiveCompletePopup);
    }
    else if (STORE.panels.noMoneyPopupIsOpen){
        return getItemUnderCursorFromArray(STORE.panels.noMoneyPopup);
    }
    else if (STORE.panels.orderBookPageNumber){
        return getItemUnderCursorFromArray(STORE.panels.orderBook[STORE.panels.orderBookPageNumber - 1]);
    }
    else if (STORE.panels.noticeBoardIsOpen){
        return getItemUnderCursorFromArray(STORE.panels.noticeBoard);
    }
    else if (STORE.panels.hutPageNumber){
        return getItemUnderCursorFromArray(STORE.panels.hut[STORE.panels.hutPageNumber - 1]);
    }
    else if (STORE.panels.tutorialPageNumber){
        return getItemUnderCursorFromArray([...STORE.draggables, ...STORE.panels.main, ...STORE.instructions[STORE.panels.tutorialPageNumber - 1].buttons]);
    }
    else if (STORE.panels.finalePageNumber){
        return getItemUnderCursorFromArray([...STORE.finale[STORE.panels.finalePageNumber - 1].buttons]);
    }
    else {
        return getItemUnderCursorFromArray([...STORE.draggables, ...STORE.panels.main]);
    }
}

function getItemUnderCursorFromArray(array) {
    for (let i = array.length -1; i > -1; i--) {
        const asset = array[i];

        const smallCursorX = cursorX / STORE.increase;
        const smallCursorY = cursorY / STORE.increase;

        if (asset.type !== 'static' && checkIfAllowedInTutorial(asset)) {
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

function frame() {
    //draw
    drawAsset(STORE.ctx, {spriteSheet: getSprite('bg'), x: 0, y: 0, spriteWidth: 287, spriteHeight: 181 });
    // drawRect(0,0,10000,10000,'white')
    if (draggingItem && draggingItem.type !== 'button'){
        canvasElement.style.cursor = "pointer";
        draggingItem.x = Math.trunc((cursorX - dragOffsetX) / STORE.increase);
        draggingItem.y = Math.trunc((cursorY - dragOffsetY) / STORE.increase);
    };

    STORE.draggables.sort(function(a, b){return a.bottom() - b.bottom()});

    STORE.draggables.forEach(function(item) {
        if (item.SELL_PRICE && isItemEntirelyInsideArea(item, STORE.areas.conveyorSell) && item.right() < 0) {
            sellItem(item);
            recordEvent({type: 'SOLD', item});
        }
    });

    drawAssets(STORE.areas);
    drawAssets(STORE.panels.main);
    drawAssets(STORE.draggables);
    animateAssets(STORE.draggables);
    drawAssets(STORE.topLayers);
    drawTutorial();
    drawOrderBook();
    drawText(STORE.moneyAmount, 247, 34, 5, 'black');
    drawNoticeBoard();
    drawHutInterior();
    drawObjectiveComplete();
    drawFinale();

    // check if needs to pause
    if(STORE.panels.orderBookPageNumber ||
        STORE.panels.noMoneyPopupIsOpen ||
        STORE.panels.noticeBoardIsOpen ||
        STORE.panels.hutPageNumber ||
        STORE.panels.finalePageNumber ||
        STORE.panels.objectiveCompletePopupIsOpen )
    {
        STORE.isPaused = true;
    } else {
        STORE.isPaused = false;
    }

    STORE.lastSeen = Date.now();
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
    startMusic();
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