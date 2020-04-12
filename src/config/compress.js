const fs = require('fs-extra');
var compress_images = require('compress-images'), INPUT_path_to_your_images, OUTPUT_path;
 
INPUT_path_to_your_images = 'src/assets/originalImg/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
INPUT_path_to_your_images_GENERATED = 'src/assets/originalImg/generated/*.{jpg,JPG,jpeg,JPEG,png,svg,gif}';
OUTPUT_path = 'src/assets/img/';

console.log('Compressing images...');

fs.remove('./' + OUTPUT_path).then(() => {
    fs.mkdirSync('./' + OUTPUT_path);
    compress_images(INPUT_path_to_your_images, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
        {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
        {png: {engine: 'optipng', command: ['']}},
        {svg: {engine: 'svgo', command: '--multipass'}},
        {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(error, completed, statistic){
        error ? console.log(error) : null;
        // console.log(completed);
        // console.log(statistic);
        // console.log('-------------');                                   
    });
    compress_images(INPUT_path_to_your_images_GENERATED, OUTPUT_path, {compress_force: false, statistic: true, autoupdate: true}, false,
        {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
        {png: {engine: 'optipng', command: ['']}},
        {svg: {engine: 'svgo', command: '--multipass'}},
        {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}}, function(error, completed, statistic){
        error ? console.log(error) : null;                              
    });
});