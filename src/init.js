import { Spool } from './items/Spool.js';
import { Crab } from './items/Crab.js';
import { Character } from './items/Character.js';
import { Bait } from './items/Bait.js';
import { Winder } from './items/Winder.js';
import { STORE } from './store.js';

export function initNewGame() {
    STORE.character = new Character();
    STORE.spool = new Spool({x: 216, y: 3});

    new Crab({x: 35, y: 146});
    new Bait({x: 90, y: 75, type: 'bacon'});
    new Winder({x: 130, y: 73});
};
