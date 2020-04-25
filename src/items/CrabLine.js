import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { Button } from './Basic.js';

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

        this.stringOffset = {x: 7, y: 4}; // where string starts from on crabline
        this.endPoint = {x: this.x, y: this.y, finalY: 155};
        this.sineStep = 0;

        this.actions = {
            grab: new Button({ hidden: true, x: this.x - 18, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-medium-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Grab crab line', offsetX: 3, offsetY: 12, size: 7 },
                clicked: () => {
                    console.log('crab-line')
                }
            }),
            attachBait: new Button({ hidden: true, x: this.x - 13, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Attach bait', offsetX: 3, offsetY: 12, size: 7 },
                clicked: () => {
                    this.bait = STORE.character.child;
                    this.bait.parent = this;
                    STORE.character.child = null;
                    this.showActions();
                }
            }),
            castLine: new Button({ hidden: true, x: this.x - 18, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-medium-arrow', arrayToAddTo: STORE.buttons, 
                text: { text: 'Cast crab line', offsetX: 3, offsetY: 12, size: 7 },
                clicked: () => {
                    this.casting = true;
                    this.showActions();
                }
            })
        }

        STORE.items.push(this);
    }
    update(){
        if (this.casting) {
            this.endPoint.y += this.dropSpeed; // animate string down
            if (this.endPoint.y >= this.endPoint.finalY) {
                this.casting = false;
                this.casted = true;
            }
        }
        this.draw();
    }
    draw() {
        this.drawSine({
            startX: this.x + this.stringOffset.x, 
            startY: this.y + this.stringOffset.y, 
            endX: this.endPoint.x + this.stringOffset.x,
            endY: this.endPoint.y + this.stringOffset.x,
        });

        if (this.bait) { // align bate to end of string
            this.bait.x = this.endPoint.x;
            this.bait.y = this.endPoint.y + 4;
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
    drawSine({startX, startY, endX, endY}){ 

        var lengthOfString = (endY - startY) * STORE.increase;
        var width = 30;
        var scale = 1;

        STORE.ctx.beginPath();
        STORE.ctx.lineWidth = STORE.increase * 0.5;
        STORE.ctx.strokeStyle = "#434343";

        var x = 0;
        var y = 0;
        var amplitude = 5;
        var frequency = 40;

        while (y < lengthOfString) {
            x = width/2 + amplitude * Math.sin((y+this.sineStep)/frequency);
            STORE.ctx.lineTo(x + (startX * STORE.increase), y + (startY * STORE.increase));
            y++;
        }
        STORE.ctx.stroke();
        this.sineStep += 1;
    }
    showActions() {
        this.hideActions();
        if (this.casting) return;
        if (this.casted) return;
        if (STORE.character.child && STORE.character.child.type.includes('bait') && !this.bait) { // character holding bait and I do not have bait attached
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
    }
}

