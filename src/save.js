import { STORE, changeStore } from './store.js';
import { Chicken } from './items/Chicken.js';
import { Chick } from './items/Chick.js';
import { Egg } from './items/Egg.js';
import { BrokenEgg } from './items/BrokenEgg.js';
import { Corn } from './items/Corn.js';
import { Feed } from './items/Feed.js';
import { Grapes } from './items/Grapes.js';
import { Grapefruit } from './items/Grapefruit.js';
import { Box } from './items/Box.js';
import { Weigher } from './items/Weigher.js';
import { Trophy } from './items/Trophy.js';
import { Static, Button, Animated } from './items/Basic.js';
import { initNewGame } from './init.js';
import { getObjectivesProgress } from './objectives';
var stringify = require('json-stringify-safe');

const typesToClasses = {
    chicken: Chicken,
    chick: Chick,
    egg: Egg,
    hatchedEgg: Egg,
    brokenEgg: BrokenEgg,
    corn: Corn,
    feed: Feed,
    grapes: Grapes,
    grapefruit: Grapefruit,
    button: Button,
    static: Static,
    box: Box,
    weigher: Weigher,
    animated: Animated,
    trophy: Trophy
};

let aboutToErase = false;

// changeStore
export function save() {
    if (forceErase) {
        erase();
        return;
    }
    if (aboutToErase) return;

    localStorage.setItem('store', stringify({
        ...STORE,
        objectives: {
            ...STORE.objectives,
            progress: getObjectivesProgress()
        }
    }));
}

export function load() {
    const loadedStore = JSON.parse(localStorage.getItem('store'));
    
    if (loadedStore) {
        if (!loadedStore.version || loadedStore.version !== STORE.version ){
            console.log('resetting');
            reset();
        }
        // loadedStore.audioUserVolume.main = 0; // keep at 0 on load for now

        changeStore({
            ...STORE,
            isMusicMuted: loadedStore.isMusicMuted,
            eggColours: loadedStore.eggColours,
            moneyAmount: loadedStore.moneyAmount,
            lastCompletedObjective: loadedStore.lastCompletedObjective,
            areas: {
                ...STORE.areas,
                weigher: fixDraggables([loadedStore.areas.weigher])[0]
            },
            audioUserVolume: loadedStore.audioUserVolume,
            draggables: fixDraggables(loadedStore.draggables),
            panels: {
                ...STORE.panels,
                orderBookPageNumber: loadedStore.panels.orderBookPageNumber,
                noMoneyPopupIsOpen: loadedStore.panels.noMoneyPopupIsOpen,
                noticeBoardIsOpen: loadedStore.panels.noticeBoardIsOpen,
                objectiveCompletePopupIsOpen: loadedStore.panels.objectiveCompletePopupIsOpen,
                tutorialPageNumber: loadedStore.panels.tutorialPageNumber,
                finalePageNumber: loadedStore.panels.finalePageNumber,
                hutPageNumber: loadedStore.panels.hutPageNumber
            },
            objectives: loadedStore.objectives,
            orderQueue: loadedStore.orderQueue
        });
        
        if (STORE.draggables.length === 0){
            reset();
        }
    } else {
        initNewGame();
    }
}
export function erase() {
    aboutToErase = true;
    localStorage.removeItem('store');
    location.reload();
}

function fixDraggables(draggables){
    let newDraggables = [];
    draggables.forEach((item, index) => {
        
        const newObject = new typesToClasses[item.type](item);
        if (newObject.load){
            newObject.load(item);
        }

        if (newObject.init){
            newObject.init();
        }
        
        newDraggables[index] = newObject;
    });
    return newDraggables;
}