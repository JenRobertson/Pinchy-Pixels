import { STORE } from '../store.js';
import { drawAsset, drawAssetRotated } from '../draw.js';
import { getSprite } from '../assetLoader.js';

export class Spool {
    constructor({x, y}) {
        this.meterAngle = 0;
        this.meterSpeed = 5;

        this.spoolSprite = getSprite('spool');
        this.meterSprite = getSprite('spool-meter');
        this.meterOutlineSprite = getSprite('spool-meter-outline');

        this.spoolDiameter = 51;
        this.meterDiameter = 65;
        this.drawDiff = (this.meterDiameter - this.spoolDiameter ) * 0.5; // 6

    }
    draw({x, y, cursorX, cursorY}) {
        this.x = x;
        this.y = y;

        this.drawMeter();
        this.drawSpool({cursorX, cursorY});
        this.meterAngle += this.meterSpeed;
    }
    drawSpool({cursorX, cursorY}) {
        const angle = this.getAngleFromMouse({
            centerX: (this.x + this.drawDiff + (this.spoolDiameter * 0.5)) * STORE.increase, 
            centerY: (this.y + this.drawDiff + (this.spoolDiameter * 0.5)) * STORE.increase, 
            cursorX,
            cursorY
        });
 
        drawAssetRotated(STORE.ctx, {
            spriteSheet: this.spoolSprite,
            x: this.x + this.drawDiff,
            y: this.y + this.drawDiff,
            width: this.spoolDiameter,
            height: this.spoolDiameter,
            localCenterX: this.spoolDiameter * 0.5,
            localCenterY: this.spoolDiameter * 0.5,
            rotation: angle
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
    getAngleFromMouse({centerX, centerY, cursorX, cursorY}) {
        const opposite = cursorX - centerX;
        const adjacent = centerY - cursorY;
    
        // if mouse is in bottom half then add 180 degrees
        const orientationFix = cursorY > centerY ? 180 : 0;
        const angle = (Math.atan(opposite / adjacent) * (180 / Math.PI)) + orientationFix;
        const roundAngleTo = 5;
        return Math.ceil(angle / roundAngleTo) * roundAngleTo;
    }
}