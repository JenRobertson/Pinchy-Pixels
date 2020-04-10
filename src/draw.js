import { STORE } from './store.js';
import { getSprite } from './assetLoader.js'

export function drawText(text, x, y, size, colour, font = 'Pixeled'){
    if (colour) {
        STORE.ctx.fillStyle = colour;
    }
    if (size) {
        setFontSize(size, font);
    }
    STORE.ctx.fillText(text, x * STORE.increase, y * STORE.increase);
}

export function setFontSize(size, font = 'Pixeled'){
    STORE.ctx.font = `${size * STORE.increase}px ${font}`;
}

export function drawRect(x, y, width, height, colour){
    if (colour) {
        STORE.ctx.fillStyle = colour;
    }
    STORE.ctx.fillRect(x * STORE.increase, y * STORE.increase, width * STORE.increase, height * STORE.increase);
}

export function animateAssets(container) {
    if (STORE.isPaused) return;
    container.forEach(function (asset) {
        if (asset.destinationX && Math.trunc(asset.x) < asset.destinationX){
            asset.x += asset.state.speed;
            asset.directionFacing = 'right';
            if ((asset.x - asset.destinationX) > asset.state.speed){
                asset.x = asset.destinationX;
                asset.destinationX = null;
            }
        }
        else if (asset.destinationX && Math.trunc(asset.x) > asset.destinationX){
            asset.x -= asset.state.speed;
            asset.directionFacing = 'left';
            if ((asset.x - asset.destinationX) < asset.state.speed){
                asset.x = asset.destinationX;
                asset.destinationX = null;
            }
        }
        if (asset.destinationY && asset.destinationY != null && Math.trunc(asset.y) < asset.destinationY){
            asset.y += asset.state.speed;
            if ((asset.y - asset.destinationY) > asset.state.speed){
                asset.y = asset.destinationY;
                asset.destinationY = null;
            }
        }
        else if (asset.destinationY && asset.destinationY != null && Math.trunc(asset.y) > asset.destinationY){
            asset.y -= asset.state.speed;
            if ((asset.y - asset.destinationY) < asset.state.speed){
                asset.y = asset.destinationY;
                asset.destinationY = null;
            }
        }
        // fix walking forever bug
        if (Math.trunc(asset.y) === asset.destinationY) {
            asset.destinationY = null;
        }

        if (Math.trunc(asset.x) === asset.destinationX) {
            asset.destinationX = null;
        }
        
    });
};

export function drawAsset(context, asset, small) {
    // small is used draw the assets at their small size on the ghost canvas. this helps performance.
    if (!asset.hasOwnProperty('spriteSheet')) return;
    if (!asset.spriteSheet) return;

    if (asset.hasOwnProperty('frame')){
        if (asset.frame >= asset.state.numberOfFrames){
            asset.frame = 0;
        }
        // if asset has direction data, use it to choose the row. Otherwise use the basic row data.
        var row = asset.state.row.direction ? asset.state.row.direction[asset.directionFacing] : asset.state.row ;
        // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
        context.drawImage(
            asset.spriteSheet,
            asset.spriteWidth * Math.trunc(asset.frame),//sx
            row * asset.spriteHeight,//sy
            asset.spriteWidth,//swidth
            asset.spriteHeight,//sheight
            Math.trunc(asset.x) * (small ? 1 : STORE.increase),//dx
            Math.trunc(asset.y) * (small ? 1 : STORE.increase),//dy
            asset.spriteWidth * (small ? 1 : STORE.increase),//dwidth
            asset.spriteHeight * (small ? 1 : STORE.increase)//dheight
        );

        // draw full body extras (fits on original spritesheet)
        if (asset.hasOwnProperty('fullBodyExtras')){
            for (var key in asset.fullBodyExtras){
                const extra = asset.fullBodyExtras[key];
                if (extra.active){
                    context.drawImage(
                        extra.spriteSheet,
                        asset.spriteWidth * Math.trunc(asset.frame),
                        row * asset.spriteHeight,
                        asset.spriteWidth,
                        asset.spriteHeight,
                        Math.trunc(asset.x) * (small ? 1 : STORE.increase),
                        Math.trunc(asset.y) * (small ? 1 : STORE.increase),
                        asset.spriteWidth * (small ? 1 : STORE.increase),
                        asset.spriteHeight * (small ? 1 : STORE.increase)
                    );
                }
            };
        };

        // draw small extras of different dimension (hats)
        if (asset.hasOwnProperty('activeExtras')){
            const settings = {
                spriteWidth: 68,
                spriteHeight: 55,
                offset: {
                    left: { x: -15, y: -15 },
                    right: { x: -15, y: -15 },
                }
            }
            for (var key in asset.activeExtras){
                const extraId = asset.activeExtras[key];
                if (extraId) {
                    context.drawImage(
                        STORE.extras[extraId].spriteSheet,
                        settings.spriteWidth * Math.trunc(asset.frame),
                        row * settings.spriteHeight,
                        settings.spriteWidth,
                        settings.spriteHeight,
                        Math.trunc(asset.x + settings.offset[asset.directionFacing].x) * (small ? 1 : STORE.increase),
                        Math.trunc(asset.y + settings.offset[asset.directionFacing].y) * (small ? 1 : STORE.increase),
                        settings.spriteWidth * (small ? 1 : STORE.increase),
                        settings.spriteHeight * (small ? 1 : STORE.increase)
                    );
                }
            };
        };

        if (!STORE.isPaused){
            asset.frame+=asset.state.spriteSpeed;
        }
        if (asset.doNotPause && STORE.isPaused){
            asset.frame+=asset.state.spriteSpeed;
        }
    }
    else {
        if (asset.spriteWidth) { // static things that need to be cut off using their spriteWidth / height
            context.drawImage(
                asset.spriteSheet,
                0,//sx
                0,//sy
                asset.spriteWidth,//swidth
                asset.spriteHeight,//sheight
                Math.trunc(asset.x) * (small ? 1 : STORE.increase),//dx
                Math.trunc(asset.y) * (small ? 1 : STORE.increase),//dy
                asset.spriteWidth * (small ? 1 : STORE.increase),//dwidth
                asset.spriteHeight * (small ? 1 : STORE.increase)//dheight
            );
        } else { // as static as you can get
            context.drawImage(
                asset.spriteSheet, 
                Math.trunc(asset.x) * (small ? 1 : STORE.increase), //dx 
                Math.trunc(asset.y) * (small ? 1 : STORE.increase), //dy
                asset.spriteSheet.width * (small ? 1 : STORE.increase),//dwidth
                asset.spriteSheet.height * (small ? 1 : STORE.increase)//dheight
            );
        }
    }
}

export function drawAssets (assetsObject) {
    //draggables
    if (Array.isArray(assetsObject)){
        for (var i = 0; i < assetsObject.length; i++) {
            var asset = assetsObject[i];
            drawAsset(STORE.ctx, asset);
            if (asset.update && (!STORE.isPaused || asset.type === 'button')) { // update menu button rollovers even when paused
                asset.update();
            }
            if (asset.delete){
                assetsObject.splice(i, 1);
            }
        }

    }
    else {
        //areas
        for (var key in assetsObject){
            if (assetsObject[key].spriteSheet){
                drawAsset(STORE.ctx, assetsObject[key]);
            }
            if (assetsObject[key].draw){
                assetsObject[key].draw()
            }
            if (assetsObject[key].update && !STORE.isPaused){
                assetsObject[key].update();
            }
        }
    }
}

export function drawLoadingBar(progress){
    drawText('hidden text to make the font load', 90, 90, 1, '#4a2a1b');
    //bg colour
    STORE.ctx.fillStyle = '#a25c35';
    drawRect(0, 0, 1000, 1000);

    // the 1 in the file names makes them load in first
    drawAsset(STORE.ctx, {spriteSheet: getSprite("1waving_walrus--still"), x: 102, y: 100});
    drawAsset(STORE.ctx, {spriteSheet: getSprite("1logo"), x: 107, y: 5});
    //grey outline
    STORE.ctx.fillStyle = '#686868';
    drawRect(41, 78, 204, 14);

    //white inside of bar
    STORE.ctx.fillStyle = 'white';
    drawRect(43, 80, 200, 10);

    //progress
    STORE.ctx.fillStyle = '#eb73cb';
    drawRect(43, 80, progress, 10);

    drawAsset(STORE.ctx, {spriteSheet: getSprite("1LOADING"), x: 92, y: 60});
    // drawText('LOADING', 110, 70, 10, '#654015');
}

// returns array of strings
export function wrapText(text, maxTextWidth, fontSize, font = 'Pixeled') {
    setFontSize(fontSize, font);
    maxTextWidth = maxTextWidth * STORE.increase;

    let lines = {remainingText: text};
    let arrayOfWrappedText = [];

    if (STORE.ctx.measureText(text).width < maxTextWidth) { // see if it already fits on one line
        // no need to wrap
        arrayOfWrappedText.push(text);
        return arrayOfWrappedText;
    }

    while (STORE.ctx.measureText(lines.remainingText).width > maxTextWidth) { // while remaining text does not fit on line
        lines = cutLine(lines.remainingText, maxTextWidth); // cut the line
        arrayOfWrappedText.push(lines.cutLine); // push the cut line to the array
    };
    arrayOfWrappedText.push(lines.remainingText); // remaining text does fit, add it on the end.
    return arrayOfWrappedText; 

    function cutLine(text, maxTextWidth) {
        setFontSize(fontSize, font);
        const splitText = text.split(' '); // put each word into an array element
        let testLine = ''; // create test line variable 

        let index = 0; 
        while (STORE.ctx.measureText(testLine).width < maxTextWidth) { // if line is too short
            testLine += splitText[index] + ' '; // add the next word on
            index++; // update the index
        }
        let remainingText = splitText.slice(index - 1, splitText.length).join(" ");
        let cutLine = splitText.slice(0, index - 1).join(" ");
        return {cutLine, remainingText}
    }
}

export function drawDisallowedHostScreen() {
    STORE.ctx.fillStyle = '#000000';
    drawRect(0, 0, 1000, 1000);
    drawText('This game has been stolen. If you would like ', 10, 90, 10, '#ffffff', 'arial');
    drawText('to host this game on your site please contact', 10, 100, 10, '#ffffff', 'arial');
    drawText('wavingwalrusgames@gmail.com ', 10, 110, 10, '#ffffff', 'arial');
}