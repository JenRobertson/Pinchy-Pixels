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
                    console.log('crab-line')
                }
            })
        }

        STORE.items.push(this);
    }
    showActions() {
        if (STORE.character.child && STORE.character.child.type.includes('bait')){
            this.actions.attachBait.hidden = false;
        } else {
            this.actions.grab.hidden = false;
        }
    }
    hideActions() {
        this.actions.grab.hidden = true;
        this.actions.attachBait.hidden = true;
    }
}

// STORE.ctx.beginPath()
// STORE.ctx.moveTo(142 * STORE.increase, 73* STORE.increase);
// STORE.ctx.lineTo(160* STORE.increase, 173* STORE.increase);
// STORE.ctx.lineWidth = 2;
// STORE.ctx.stroke();