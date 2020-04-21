import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { Button } from './Basic.js';

export class CrabLine {
    constructor({x, y}) {
        this.x = x;
        this.y = y;
        // this.frame = 0;
        this.grabbable = true;

        this.type = `crab-line`;
        this.spriteSheet = getSprite('crab-line');

        this.spriteWidth = 14;
        this.spriteHeight = 10;

        this.action = new Button({ hidden: true, x: this.x - 18, y: 86 , spriteHeight: 17, spriteWidth: 51, imageId: 'button-medium-arrow', arrayToAddTo: STORE.buttons, 
            text: { text: 'Grab crab line', offsetX: 3, offsetY: 12, size: 7 },
            clicked: () => {
                console.log('crab-line')
            }
        });

        // this.states = {
        //     idle: {
        //         type: 'idle',
        //         row: {direction: { left: 0, right: 0}},
        //         numberOfFrames: 1,
        //         spriteSpeed: 0.1,
        //         speed: 0.1,
        //     },
        //     walking: {
        //         type: 'walking',
        //         row: {direction: { left: 0, right: 0}},
        //         numberOfFrames: 5,
        //         spriteSpeed: 0.5,
        //         speed: 0.5,
        //     }
        // };
        STORE.items.push(this);
    }
    showActions() {
        this.action.hidden = false;
    }
    hideActions() {
        this.action.hidden = true;
    }
}

// STORE.ctx.beginPath()
// STORE.ctx.moveTo(142 * STORE.increase, 73* STORE.increase);
// STORE.ctx.lineTo(160* STORE.increase, 173* STORE.increase);
// STORE.ctx.lineWidth = 2;
// STORE.ctx.stroke();