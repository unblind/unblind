'use strict';

const vision = require('node-cloud-vision-api');

const IMAGE_FILE = '/Users/guido/_tmp_image.jpg';

const GOOGLE_VISION_API_TOKEN = process.env.GOOGLE_VISION_API_TOKEN;

if (!GOOGLE_VISION_API_TOKEN) {
  console.error('You need set a GOOGLE_VISION_API_TOKEN env var in google vision api token');
  process.exit(1);
}

vision.init({auth: GOOGLE_VISION_API_TOKEN});

const req = new vision.Request({
  image: new vision.Image(IMAGE_FILE),
  features: [
    new vision.Feature('FACE_DETECTION', 5),
    new vision.Feature('LABEL_DETECTION', 5)
  ]
});

vision.annotate(req).then((res) => {
  console.log(JSON.stringify(res.responses))
}, (e) => {
  console.log('Error: ', e)
});
