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
                    this.endPoint = {x: this.x, y: 155};

                }
            })
        }

        STORE.items.push(this);
    }
    update(){
        this.draw();
    }
    draw() {
        if (this.endPoint){
            STORE.ctx.beginPath()
            STORE.ctx.moveTo(this.x * STORE.increase, this.y * STORE.increase);
            STORE.ctx.lineTo(this.endPoint.x * STORE.increase, this.endPoint.y * STORE.increase);
            STORE.ctx.lineWidth = 3;
            STORE.ctx.stroke();

            this.bait.x = this.endPoint.x;
            this.bait.y = this.endPoint.y;

        }

        // drawAsset()
    }
    showActions() {
        this.hideActions();
        if (STORE.character.child && STORE.character.child.type.includes('bait') && !this.bait) {
            this.actions.attachBait.hidden = false;
        } else if (this.bait) {
            this.actions.castLine.hidden = false;
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

