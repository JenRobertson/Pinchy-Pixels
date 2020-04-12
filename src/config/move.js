const fs = require('fs-extra');

const originalImg = './src/assets/originalImg';
const originalImgGenerated = './src/assets/originalImg/generated';

const OUTPUT_path = 'src/assets/img/';

fs.remove('./' + OUTPUT_path).then(() => {
  fs.mkdirSync('./' + OUTPUT_path);
  fs.copy(originalImg, OUTPUT_path)
    .then(() => console.log('Moved assets/originalImg --> img'))
    .catch(err => console.error(err));

  fs.copy(originalImgGenerated, OUTPUT_path)
  .then(() => console.log('Moved assets/originalImg/generated --> img'))
    .catch(err => console.error(err));
});
