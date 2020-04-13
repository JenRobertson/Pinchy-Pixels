import { STORE } from '../store.js';
import { drawAsset, drawAssetRotated } from '../draw.js';
import { getSprite } from '../assetLoader.js';

export class Spool {
    constructor({x, y}) {
        this.x = x;
        this.y = y;

        this.meterAngle = 0;
        this.spoolAngle = 0;
        this.meterSpeed = 5;

        // How many degrees it extends to on each side of 0
        this.meterGreenArea = 45;
        this.meterYellowArea = 65;

        this.statuses = {
            green: 'GREEN',
            yellow: 'YELLOW',
            red: 'RED',
            idle: 'IDLE'
        }
        this.status = this.statuses.idle;

        this.meterSprite = getSprite('spool-meter');
        this.spoolSprite = getSprite('spool');
        // this.meterOutlineSprite = getSprite('spool-meter-outline');

        this.spoolDiameter = 51;
        this.meterDiameter = 65;
        this.meterThickness = (this.meterDiameter - this.spoolDiameter ) * 0.5;

    }

    draw({cursorX, cursorY}) {
        this.drawMeter();
        this.drawSpool({cursorX, cursorY});
        this.meterAngle = (this.meterAngle + this.meterSpeed) % 360;
        this.status = this.getStatus();
        console.log(this.status);
    }

    drawSpool({cursorX, cursorY}) {
        this.spoolAngle = this.getAngleFromMouse({
            centerX: (this.x + this.meterThickness + (this.spoolDiameter * 0.5)) * STORE.increase, 
            centerY: (this.y + this.meterThickness + (this.spoolDiameter * 0.5)) * STORE.increase, 
            cursorX,
            cursorY
        });
 
        drawAssetRotated(STORE.ctx, {
            spriteSheet: this.spoolSprite,
            x: this.x + this.meterThickness,
            y: this.y + this.meterThickness,
            width: this.spoolDiameter,
            height: this.spoolDiameter,
            localCenterX: this.spoolDiameter * 0.5,
            localCenterY: this.spoolDiameter * 0.5,
            rotation: this.spoolAngle
        });

    }

    drawMeter() {
        drawAssetRotated(STORE.ctx, {
            spriteSheet: this.meterSprite,
            x: this.x,
            y: this.y,
            width: this.meterDiameter,
            height: this.meterDiameter,
            localCenterX: this.meterDiameter * 0.5,
            localCenterY: this.meterDiameter * 0.5,
            rotation: this.meterAngle
        });

        // drawAsset(STORE.ctx, {spriteSheet: this.meterOutlineSprite, x: this.x - 3, y: this.y - 3});
    }

    /* Returns how much spool should rotate based on mouse position */
    getAngleFromMouse({centerX, centerY, cursorX, cursorY}) {
        // make center of circle 0
        const x = cursorX - centerX;
        const y = cursorY - centerY;
    
        // works out angle mouse as it, assuming center of circle is 0
        let angle = Math.atan2(y, x) * 180 / Math.PI;
        const roundAngleTo = 5;
        const value = (Math.ceil(angle / roundAngleTo) * roundAngleTo) + 90;
        // was going from 270 to -85 :(
        return value < 0 ? value + 360 : value;
    }

    /* Returns if knob is in green, yellow or red area */
    getStatus() {
        // remove differences for rotation
        const spoolVsMeterDiff = this.spoolAngle - this.meterAngle;
        // get angle diff as degrees either side of zero, e.g. -15 or +30
        const angleDiff = spoolVsMeterDiff > 180 ? spoolVsMeterDiff - 360 : spoolVsMeterDiff;

        if (angleDiff > -this.meterGreenArea && angleDiff < this.meterGreenArea) return this.statuses.green;
        if (angleDiff > -this.meterYellowArea && angleDiff < this.meterYellowArea) return this.statuses.yellow;
        return this.statuses.red;
    }
}