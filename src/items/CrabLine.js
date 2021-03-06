import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { Button } from './Basic.js';
import { Spool } from './Spool.js';

export class CrabLine {
    constructor({x, y}) {
        this.x = x;
        this.y = y;
        // this.frame = 0;
        this.grabbable = true;

        this.type = 'crab-line';
        this.spriteSheet = getSprite('crab-line');

        this.spriteWidth = 14;
        this.spriteHeight = 10;
        this.dropSpeed = 2;
        this.raiseSpeed = 0.5;

        this.stringOffset = {x: 4, y: 4}; // where string starts from on crabline
        this.endPoint = {x: this.x, y: this.y, finalY: 155, type: 'lineEndPoint'};
        this.wiggleSpeed = 0.2; // how fast string wiggles
        this.sineAmplitude = 0; // used to control wiggle
        this.sineDirection = this.wiggleSpeed; // also controls wiggle

        this.spool = new Spool({x: this.x + 30});

        this.actions = {
            grab: new Button({ hidden: true, x: this.x - 18, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-medium-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Grab crab line', offsetX: 3, offsetY: 12, size: 7 },
                itemParent: this, xOffset: -18,
                clicked: () => {
                    this.grabbable = false;
                    this.parent = STORE.character;
                    STORE.character.child = this;
                    this.showActions();
                }
            }),
            place: new Button({ hidden: true, x: 10, y: 10 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-large', arrayToAddTo: STORE.buttons, 
                text: { text: 'Place crab line', offsetX: 2, offsetY: 9, size: 7 },
                clicked: () => {
                    this.grabbable = true;
                    this.actions.place.hidden = true;
                    STORE.character.child = null;
                    this.parent = null;
                    this.y = STORE.areas.jetty.top - this.spriteHeight;
                    // update items to new location                  
                    this.endPoint.x = this.x;
                    this.endPoint.y = this.y;
                    this.spool.x = this.x + 30;
                    this.showActions();
                }
            }),            
            attachBait: new Button({ hidden: true, x: this.x - 13, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Attach bait', offsetX: 3, offsetY: 12, size: 7 },
                itemParent: this, xOffset: -13,
                clicked: () => {
                    this.bait = STORE.character.child;
                    this.bait.parent = this;
                    STORE.character.child = null;
                    this.showActions();
                }
            }),
            castLine: new Button({ hidden: true, x: this.x - 18, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-medium-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Cast crab line', offsetX: 3, offsetY: 12, size: 7 },
                itemParent: this, xOffset: -18,
                clicked: () => {
                    this.casting = true;
                    this.showActions();
                }
            }),
            reelLine: new Button({ hidden: true, x: this.x - 18, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-medium-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Reel crab line', offsetX: 3, offsetY: 12, size: 7 },
                itemParent: this, xOffset: -18,
                clicked: () => {
                    this.reeling = true;
                }
            }),
            grabCrab: new Button({ hidden: true, x: this.x - 13, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Grab crab', offsetX: 3, offsetY: 12, size: 7 },
                itemParent: this, xOffset: -13,
                clicked: () => {
                    this.showActions();
                    this.crab.parent = STORE.character;
                    STORE.character.child = this.crab;
                    this.bait.delete = true;
                    this.bait = null;
                }
            })
        }

        STORE.items.push(this);
    }
    update(){
        this.draw();

        if (this.parent){
            this.alignToParent();
        }

        if (this.casting) {
            this.endPoint.y += this.dropSpeed; // animate string down
            if (this.endPoint.y >= this.endPoint.finalY) {
                this.casting = false;
                this.casted = true;
                STORE.availableLines.push(this);
            }
        }

        if (this.reeling){
            if (this.spool.status === this.spool.statuses.green){
                this.endPoint.y-= this.raiseSpeed;
                if (this.endPoint.y <= this.y){ // reached the top
                    this.reeling = false;
                    this.reeled = true;
                }
            } else if (this.spool.status === this.spool.statuses.red){
                if (this.endPoint.y < this.endPoint.finalY){ // reached the bottom
                    this.endPoint.y += this.dropSpeed;
                }
            }
        }
    }
    draw() {
        this.drawWigglyLine({
            startX: this.x + this.stringOffset.x, 
            startY: this.y + this.stringOffset.y, 
            endX: this.endPoint.x + this.stringOffset.x,
            endY: this.endPoint.y + this.stringOffset.x,
        });

        if (this.bait) { // align bate to end of string
            this.bait.x = this.endPoint.x - 1;
            this.bait.y = this.endPoint.y + 1;
        }
        if (this.reeling) {
            this.spool.draw();
            this.spool.hidden = false;
        } else {
            this.spool.hidden = true;
        }

    }
    drawLine({startX, startY, endX, endY}){
        STORE.ctx.beginPath()
        STORE.ctx.moveTo(startX * STORE.increase, startY * STORE.increase);
        STORE.ctx.lineTo(endX * STORE.increase, endY * STORE.increase);
        STORE.ctx.lineWidth = STORE.increase * 1;
        STORE.ctx.strokeStyle = '#434343';
        STORE.ctx.stroke();
    }
    drawWigglyLine({startX, startY, endX, endY}){ 
        // https://gist.github.com/gkhays/e264009c0832c73d5345847e673a64ab
        const lengthOfString = (endY - startY) * STORE.increase;
        const width = 30;
        const scale = 1;

        STORE.ctx.beginPath();
        STORE.ctx.lineWidth = STORE.increase * 0.5;
        STORE.ctx.strokeStyle = "#434343";

        let x = 0;
        let y = 0;
        const frequency = 40;

        while (y < lengthOfString) {
            x = width/2 + this.sineAmplitude * Math.sin(y/frequency);
            STORE.ctx.lineTo(x + (startX * STORE.increase), y + (startY * STORE.increase));
            y++;
        }
        STORE.ctx.stroke();
        this.sineAmplitude += this.sineDirection;
  
        if (this.sineAmplitude >= 10) this.sineDirection = -this.wiggleSpeed;
        if (this.sineAmplitude <= -10) this.sineDirection = this.wiggleSpeed;
    }
    showActions() {
        this.hideActions();
        if (this.casting) return;
        if (this.reeling) return;
        if (this.parent) {
            this.actions.place.hidden = false;
        } else if (this.reeled) {
            this.actions.grabCrab.hidden = false;
        } else if  (this.casted) {
            this.actions.reelLine.hidden = false;
        } else if (STORE.character.child && STORE.character.child.type.includes('bait') && !this.bait) { // character holding bait and I do not have bait attached
            this.actions.attachBait.hidden = false;
        } else if (this.bait) {
            this.actions.castLine.hidden = false; // I have bait
        } else {
            this.actions.grab.hidden = false;
        }
    }
    hideActions() {
        this.actions.grab.hidden = true;
        this.actions.attachBait.hidden = true;
        this.actions.castLine.hidden = true;
        this.actions.reelLine.hidden = true;
        this.actions.grabCrab.hidden = true;
    }
    alignToParent() {
        switch(this.parent.type) {
            case 'character': 
                this.y = 52;
                this.x = this.parent.directionFacing === 'right' ? this.parent.x + 20 : this.parent.x - 2;
                break;
        }
    }

}

