import { STORE } from './store.js';
import { getSprite } from './assetLoader.js';
import { drawAsset } from './draw.js';
// import { save } from './save';

export function setVolumes(){
    setMainVolume();
    setSoundEffectsVolume();
}
export function setMainVolume(){
    STORE.audio.main.file.volume = STORE.audio.main.volume * STORE.audioUserVolume.main; 
}

export function detectIfVolumeSupported(){   
    const audio = document.createElement('audio');
    audio.addEventListener('volumechange', (event) => {
        STORE.volumeIsSupported = true;
        return true;
    });
    audio.volume = 0.1;
}

export function setSoundEffectsVolume(){
    for (var key in STORE.audio){
        if (key !== 'main'){
            STORE.audio[key].file.volume = STORE.audio[key].volume * STORE.audioUserVolume.sfx; 
        }
    }
}

export function addBrowserClosedListener() {
    STORE.audio.main.file.addEventListener('timeupdate', function (){
        if (Date.now() - STORE.lastSeen > 100){
            this.pause();
            save();
        } 
    }, false);
}

export function getArea(asset) {
    for (var box of STORE.areas.boxes) {//ECMA2015
        if (isItemEntirelyInsideArea(asset, box)){
            return box;
        }
    }

    for (var key in STORE.areas){
        if (key !== 'boxes'){// we already searched the boxes m8
            let area = STORE.areas[key];
            if (isItemEntirelyInsideArea(asset, area)){
                // fix the conveyor issue
                if (asset.type === 'box' && (area.type === 'conveyor_sell' || area.type === 'conveyor_deliver')){
                    if (asset.bottom() + 17 > STORE.areas.conveyorDeliver.bottom()){
                        area = STORE.areas.conveyorSell;
                    }
                }
                return area;
            }
        }
    };
}

export function isItemEntirelyInsideArea(item, area){
    if (item.left() < area.left()) {
        return false;
    }
    if (item.right() > area.right()) {
        return false;
    }
    if (item.top() < area.top()) {
        return false;
    }
    if (item.bottom() > area.bottom()) {
        return false;
    }
    return true;
}

export function isItemPartiallyInsideArea(item, area){
    if (item.left() < area.left()) {
        return false;
    }
    if (item.right() > area.right()) {
        return false;
    }
    if (item.top() < area.top()) {
        return false;
    }
    if (item.bottom() > area.bottom()) {
        return false;
    }
    return true;
}

export function randomIntFromInterval(min,max) { // min and max included
    return Math.floor(Math.random()*(max-min+1)+min);
}

// box utils
export function checkIfInBox () {
    // remove from the box first in case its in one
    if (this.parent){
        this.parent.contents.splice( this.parent.contents.indexOf(this), 1 );
        this.parent = null;
    }

    const inABox = this.area && this.area.draggable && this.area.draggable.type === 'box';

    if (inABox) {
        this.parent = this.area.draggable;
        const assignedToBox = this.parent.contents.indexOf(this) !== -1;

        // add offset
        this.boxOffsetX = this.parent.x - this.x;
        this.boxOffsetY = this.parent.y - this.y;

        if (!assignedToBox) {
            this.parent.contents.push(this);
        }
    }
    else {
        if (this.parent) {
            // remove from box
            this.parent.contents.splice( this.parent.contents.indexOf(this), 1 );
            this.parent = null;
        }
    }
}

export function removeFromBox() {
    if (this.parent){
        this.parent.contents.splice( this.parent.contents.indexOf(this), 1 );
    }
}

export function checkIfOnConveyor() {
    if (this.area && this.area.type){
        if (this.area.type === "conveyor_sell") {
            this.destinationX = -60;
        } else if (this.area.type === "conveyor_deliver") {
            this.destinationX = this.area.right() - this.spriteWidth;
        }
    }
}

export function sellItem(item) {
    STORE.moneyAmount+=item.SELL_PRICE;
    item.delete = true;
    STORE.audio.sell.file.play();
}

function isAllowedInArea(currentArea, allowedAreas){
    if (!currentArea || !currentArea.type) return false;
    
    for (var i = 0; i < allowedAreas.length; i++) {
        if (currentArea.type === allowedAreas[i]){
            return true;
        }
    };
    return false;
}

export function drawCrossIfNeeded() {
    const nestIsOccupiedByAnotherChicken = this.area && this.area.type === 'nest' && (this.area.chicken && this.area.chicken !== this);

    if (!isAllowedInArea(this.area, this.crossData.allowedAreas) || nestIsOccupiedByAnotherChicken){
        const spriteSheet = this.crossData.smallCross ? getSprite('cross_small') : getSprite('cross');
        drawAsset(STORE.ctx, {spriteSheet, x: this.x + this.crossData.xOffset, y: this.y + this.crossData.yOffset });
        this.area = null;
    }
}