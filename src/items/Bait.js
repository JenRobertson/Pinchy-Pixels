import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { Button } from './Basic.js';

export class Bait {
    constructor({x, y, type}) {
        this.x = x;
        this.y = y;
        // this.frame = 0;
        this.grabbable = true;

        this.type = `bait-${type}`;
        this.spriteSheet = getSprite(type);

        this.spriteWidth = 15;
        this.spriteHeight = 8;

        this.action = new Button({ hidden: true, x: this.x - 11, y: 86 , spriteHeight: 17, spriteWidth: 39, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
            text: { text: 'GRAB BAIT', offsetX: 5, offsetY: 12, size: 7 },
            clicked: () => {
                console.log('BAIT')
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
