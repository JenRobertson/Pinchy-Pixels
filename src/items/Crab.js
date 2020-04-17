import { STORE } from '../store.js';
import { getSprite } from '../assetLoader.js';
import { randomIntFromInterval } from '../utils.js'

export class Crab {
    constructor({x, y}) {
        this.x = x;
        this.y = y;
        this.frame = 0;

        this.type = "crab-red";
        this.spriteSheet = getSprite(`crab-red`);
        this.directionFacing = 'right';

        this.spriteWidth = 42;
        this.spriteHeight = 35;

        this.states = {
            idle: {
                type: 'idle',
                row: {direction: { left: 0, right: 0}},
                numberOfFrames: 1,
                spriteSpeed: 0.1,
                speed: 0.1,
            },
            walking: {
                type: 'walking',
                row: {direction: { left: 0, right: 0}},
                numberOfFrames: 5,
                spriteSpeed: 0.5,
                speed: 0.5,
            }
        };
        this.state = this.states.idle;
        this.nextState = this.states.idle;
        this.decide();
        // setInterval(this.interval.bind(this), randomIntFromInterval(1500, 2500));
        STORE.items.push(this);
    }
    decide()  {
        switch(this.state.type) {
            case 'walking':
                break;
            case 'idle':
                this.nextState = this.states.walking;
                this.nextDestinationX = randomIntFromInterval(STORE.areas.sand.left, STORE.areas.sand.right - this.spriteWidth);
                this.nextDestinationY = randomIntFromInterval(STORE.areas.sand.top, STORE.areas.sand.bottom - this.spriteHeight);
                break;
        }
    };
    useNextState() {
        // update to new state at correct time
        if (this.state.type === 'walking' && this.nextState.type !== 'walking'){ // going from walking to something else
            this.state = this.nextState; // dont wait for walk frames to finish
            this.decide();
            return;
        }
        if (this.state.type !== 'walking' && this.nextState.type === 'walking' && Math.trunc(this.frame) === 0) {// if going from something to walking, set destination
            this.destinationX = this.nextDestinationX;
            this.destinationY = this.nextDestinationY;
            this.state = this.nextState;// set the state
            this.decide();
            return;
        }
        if (Math.trunc(this.frame) === this.state.numberOfFrames) {// once animation complete
            this.state = this.nextState;// set the state
            this.decide();
        }
    }

    checkIfAtDestination(){
        if (this.destinationY === null && this.destinationX === null){
            this.nextState = this.states.idle;
        }
    }
    update()  {
        if (this.state.type === 'walking'){
            this.checkIfAtDestination();
        }
        this.useNextState();

    };
}
