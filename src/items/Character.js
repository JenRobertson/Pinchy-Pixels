import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { drawAsset } from '../draw.js';

export class Character {
    constructor() {
        this.spriteWidth = 33;
        this.spriteHeight = 66;

        this.x = 100;
        this.y = STORE.areas.jetty.top - this.spriteHeight;

        this.type = "character";
        this.spriteSheet = getSprite(`character`);
        this.directionFacing = 'right';
        this.isWalking = false;
        
        this.frame = 0;

        this.states = {
            idle: {
                type: 'idle',
                row: {direction: { left: 0, right: 1}},
                numberOfFrames: 1,
                spriteSpeed: 0.1,
                speed: 0.1,
            },
            walking: {
                type: 'walking',
                row: {direction: { left: 0, right: 1}},
                numberOfFrames: 4,
                spriteSpeed: 0.5,
                speed: 3,
            }
        };
        this.state = this.states.idle;
        
        window.addEventListener('keydown', this.keydown.bind(this), true);
        window.addEventListener('keyup', this.keyup.bind(this), true);

        this.keyPresses = {};
    }

    draw() {
        this.handleKeyPresses();
        if (this.isWalking) {
            this.state = this.states.walking;
        } else {
            this.state = this.states.idle;
        }

        drawAsset(STORE.ctx, this);
    }

    handleKeyPresses() {
        if (this.keyPresses.a || this.keyPresses.ArrowLeft) {
            if (this.x <= STORE.areas.jetty.left) return;
            this.x -= this.states.walking.speed;
            this.directionFacing = 'left';
            this.isWalking = true;
        } else if (this.keyPresses.d || this.keyPresses.ArrowRight) {
            if (this.x > STORE.areas.jetty.right - this.spriteWidth) return;
            this.x += this.states.walking.speed;
            this.directionFacing = 'right';
            this.isWalking = true;
        } else {
            this.isWalking = false;
        }
    }

    keydown() {
        this.keyPresses[event.key] = true;
    }

    keyup() {
        this.keyPresses[event.key] = false;
    }
}
