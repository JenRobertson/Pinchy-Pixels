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
        this.itemWalkedOver = null;
        this.child = null;
        
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
    update() {
        this.updateItemsOnJetty();
        this.handleKeyPresses();
        if (this.isWalking) {
            this.state = this.states.walking;
        } else {
            this.state = this.states.idle;
        }
    }

    updateItemsOnJetty() {
        this.prevItemWalkedOver = this.itemWalkedOver;
        this.itemWalkedOver = this.getItemWalkedOver();

        // show actions for item
        if (this.itemWalkedOver) {
            this.itemWalkedOver.showActions('jetty');
        }
        // hide previous items actions
        if (this.prevItemWalkedOver && this.prevItemWalkedOver !== this.itemWalkedOver ) {
            this.prevItemWalkedOver.hideActions();
        }
    }

    getItemWalkedOver() {
        const leftBoundry = this.x - 5;
        const rightBoundry = this.x + 22;
        // item must have grabbable true to be selected
        const withinRange = STORE.items.filter(item => item.grabbable && item.x > leftBoundry && item.x < rightBoundry);
        
        // if more than one item in range
        if (withinRange.length){
            const characterCenter = this.x + 15;        
            // find closest item to character
            return withinRange.reduce((prev, current) => {
                return (Math.abs(current.x - characterCenter) < Math.abs(prev.x - characterCenter) ? current : prev);
            });
        } 
        return null;
    }
        
    draw() {
        this.update();
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
