import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';

export class Winder {
    constructor({x, y}) {
        this.x = x;
        this.y = y;
        // this.frame = 0;

        this.type = `winder`;
        this.spriteSheet = getSprite('winder');

        this.spriteWidth = 14;
        this.spriteHeight = 10;

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
}
