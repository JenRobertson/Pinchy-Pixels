import { drawLoadingBar } from './draw';

let progress = 0;
let numberOfImagesToLoad = 0;
let progressToAdd;

document.fonts.load('1px "smallest-pixel-7"'); // preload font

const sprites = importAllImages([
    require.context('./assets/img', false, /\.(png|jpe?g|svg)$/),
    // require.context('./assets/img/generated', false, /\.(png|jpe?g|svg)$/),
]);
const audio = importAllAudio(require.context('./assets/audio', false, /\.(wav|mp3)$/));

export function getSprite(spriteId) {
    return sprites[spriteId];
}

export function getAudio(audioId) {
    return audio[audioId];
}

function createImageObjectFromSource(importedImage){
    const imageObject = new Image();
    imageObject.src = importedImage;
    imageObject.onload = function(){
        drawLoadingBar(progress += progressToAdd);
    }
    return imageObject;
} 

function importAllAudio(r) {
    let audio = {};
    r.keys().forEach(element => {
        let audioId = element.replace('./', '');
        audioId = audioId.replace('.wav', '');
        audioId = audioId.replace('.mp3', '');
        audio[audioId] = new Audio(r(element));
        audio[audioId].preload = "auto";
        audio[audioId].load();
    });
    return audio;
}
  
function importAllImages(arrayOfImageDirectories) {
    let images = {};
    arrayOfImageDirectories.forEach((r) => {
        numberOfImagesToLoad += r.keys().length;
        progressToAdd = 200 / numberOfImagesToLoad;
        r.keys().forEach(element => {
            let spriteId = element.replace('./', '');
            spriteId = spriteId.replace('.png', '');
            images[spriteId] = createImageObjectFromSource(r(element));
        });
    });
    return images;
}