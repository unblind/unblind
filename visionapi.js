'use strict';

const talker = require('./talker');

const isRPi = process.arch === 'arm';

let IMAGE_FILE = './test.jpg';
if (isRPi) {
  // TODO
}

const ENABLE_GOOGLE = true;
const ENABLE_MS = true;

//
// Google Vision API
//
if (ENABLE_GOOGLE) {
  const vision = require('node-cloud-vision-api');

  const GOOGLE_VISION_API_TOKEN = process.env.GOOGLE_VISION_API_TOKEN;

  if (!GOOGLE_VISION_API_TOKEN) {
    console.error('You need to set a GOOGLE_VISION_API_TOKEN env var');
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
    talker.speak('Acabo de procesar la foto con google');
    console.log(JSON.stringify(res.responses))
  }, (e) => {
    console.log('Error: ', e)
  });
}

//
// MS Oxford
//
if (ENABLE_MS) {
  var oxford = require('project-oxford');

  const MS_VISION_API_TOKEN = process.env.MS_VISION_API_TOKEN;

  if (!MS_VISION_API_TOKEN) {
    console.error('You need to set a MS_VISION_API_TOKEN env var');
    process.exit(1);
  }

  const client = new oxford.Client(MS_VISION_API_TOKEN);
  client.face.detect({
      path: IMAGE_FILE,
      analyzesAge: true,
      analyzesGender: true
  }).then((res) => {
      talker.speak('Acabo de procesar la foto con microsoft');
      console.log(res);
      console.log('The age is: ' + res[0].faceAttributes.age);
      console.log('The gender is: ' + res[0].faceAttributes.gender);
  });
}
