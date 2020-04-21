import { Spool } from './items/Spool.js';
import { Crab } from './items/Crab.js';
import { Character } from './items/Character.js';
import { Bait } from './items/Bait.js';
import { Button } from './items/Basic.js';
import { Winder } from './items/Winder.js';
import { STORE } from './store.js';

export function initNewGame() {
    STORE.character = new Character();
    STORE.spool = new Spool({x: 216, y: 3});

    new Crab({x: 35, y: 146});
    new Bait({x: 90, y: 75, type: 'bacon'});
    new Winder({x: 130, y: 73});

    new Button({x: 11, y: 25, spriteHeight: 14, spriteWidth: 50, imageId: 'button-large', arrayToAddTo: STORE.buttons, 
        text: { text: 'DROP LINE', offsetX: 5, offsetY: 9, size: 9 },
        clicked: () => {
            console.log('clack1')
    }});

    new Button({x: 100, y: 100, spriteHeight: 17, spriteWidth: 39, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
        text: {text: 'REEL IN', offsetX: 5, offsetY: 12, size: 9 },
        clicked: () => {
            console.log('clack2')
    }});

    new Button({x: 200, y: 100, spriteHeight: 17, spriteWidth: 39, imageId: 'button-small-arrow', arrayToAddTo: STORE.buttons, 
        text: {text: 'ATTACH', offsetX: 7, offsetY: 12, size: 9 },
        clicked: () => {
            console.log('clack3')
    }});
};
