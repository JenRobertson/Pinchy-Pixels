import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { getArea, checkIfInBox, checkIfOnConveyor } from '../utils.js'

export class Basic {
    constructor(x, y, spriteHeight, spriteWidth, imageId) {
        this.type = "static";
        this.x = x;
        this.y = y;
        this.imageId = imageId;
        this.spriteSheet = getSprite(this.imageId);
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.shadowHeight = 0;
        this.frame = 0;
        this.states = {
            default: {
                row: 0,
                numberOfFrames: 1,
                spriteSpeed: 0.1,
                speed: 0.1,
            }
        };
        this.state = this.states.default;
    }

    top() {
        return this.y;
    }
    bottom() {
        return (this.y + this.spriteHeight) - this.shadowHeight;
    }
    left() {
        return this.x;
    }
    right() {
        return this.x + this.spriteWidth;
    }
}

// draggable, animated but dumb
export class Animated extends Basic {
    constructor({x, y, spriteHeight, spriteWidth, imageId, spriteSpeed, numberOfFrames, SELL_PRICE = 0}) {
        super(x, y, spriteHeight, spriteWidth, imageId);
        this.type = "animated";
        this.checkIfInBox = checkIfInBox.bind(this);
        this.spriteSpeed = spriteSpeed;
        this.numberOfFrames = numberOfFrames;
        this.SELL_PRICE = SELL_PRICE;
        this.states = {
            default: {
                row: 0,
                numberOfFrames: this.numberOfFrames,
                spriteSpeed: this.spriteSpeed,
                speed: 0.1,
            }
        };
        this.state = this.states.default;
        // STORE.draggables.push(this);
        this.area = getArea(this);
        this.checkIfInBox();
        checkIfOnConveyor.call(this);
    }
    dragStop() {
        this.checkIfInBox();
        checkIfOnConveyor.call(this);
    }
}

export class Static extends Basic {
    constructor({x, y, spriteHeight, spriteWidth, imageId}) {
        super(x, y, spriteHeight, spriteWidth, imageId);
        this.checkIfInBox = checkIfInBox.bind(this);
        // STORE.draggables.push(this);
    }
    init(){
        this.area = getArea(this);
        this.checkIfInBox();
    }
}

export class Button extends Basic {
    constructor({x, y, spriteHeight, spriteWidth, imageId, arrayToAddTo, clicked, text, hidden}) {
        super(x, y, spriteHeight, spriteWidth, imageId);
        this.type = 'button';
        this.hidden = hidden;
        this.text = text;
        this.clicked = clicked;
        this.defaultSprite = this.spriteSheet;
        this.locked = false;
        if (getSprite(imageId + "--hover")) {
            this.hoverSprite = getSprite(imageId + "--hover");
        }
        if (arrayToAddTo) {
            arrayToAddTo.push(this);
        }
        this.id = `${this.imageId}_${this.x}_${this.y}`;
        if (this.text) {
            this.text.x = this.x + this.text.offsetX;
            this.text.y = this.y + this.text.offsetY;
        }
    }
    getId (){
        return this.id;
    }
    startHover() {
        if (this.hoverSprite) {
            this.spriteSheet = this.hoverSprite;
        }
    };

    update() {
        if (!STORE.somethingIsHovering) {
            this.spriteSheet = this.defaultSprite;
        }
        if (this.locked){
            this.spriteSheet = null;
        }
    }
}
