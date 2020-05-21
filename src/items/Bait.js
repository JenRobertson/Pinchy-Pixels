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

        this.actions = {
            grab: new Button({ hidden: true, x: this.x - 11, y: 86 , spriteHeight: 17, spriteWidth: 39, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
            text: { text: 'grab bait', offsetX: 5, offsetY: 12, size: 7 },
            clicked: () => {
                this.grabbable = false;
                this.parent = STORE.character;
                STORE.character.child = this;
            }})
        }
        STORE.items.push(this);
    }
    update() {
        if (this.parent){
            this.alignToParent();
        }
    }
    casted() {
        
    }
    alignToParent() {
        switch(this.parent.type) {
            case 'character': 
                this.y = 52;
                this.x = this.parent.directionFacing === 'right' ? this.parent.x + 20 : this.parent.x - 2;
                break;
            case 'crab-line': 
                this.y = this.parent.y - 7;
                this.x = this.parent.x;
                break;
        }
    }
    showActions() {
        this.actions.grab.hidden = false;
        
    }
    hideActions() {
        this.actions.grab.hidden = true;
    }
}
