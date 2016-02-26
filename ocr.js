'use strict';

const talker = require('./talker');
const firebaser = require('./firebaser');

const ENABLE_GOOGLE = true;
const ENABLE_MS = false;

var photographer = require('./photographer.js');

photographer.takePhoto(function(err, photoFileName) {
  if (err) {
    talker.speak('I can not take a foto now. Sorry.');
    return;
  }

  console.log('File: ' + photoFileName);

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
      image: new vision.Image(photoFileName),
      features: [
        new vision.Feature('TEXT_DETECTION', 10)
      ]
    });

    vision.annotate(req).then((res) => {
      console.log(JSON.stringify(res.responses));

      res.textAnnotations.forEach((text) => {
        talker.speak(text.description.replaceAll('\n', '. '));
      })
    }, (e) => {
      console.log('Error: ', e);
    });
  }

  //
  // MS Oxford
  //
  if (ENABLE_MS) {
    var oxford = require('project-oxford');

    const MS_VISION_COMPUTER_API_TOKEN = process.env.MS_VISION_COMPUTER_API_TOKEN;

    if (!MS_VISION_COMPUTER_API_TOKEN) {
      console.error('You need to set a MS_VISION_COMPUTER_API_TOKEN env vars');
      process.exit(1);
    }

    const clientComputer = new oxford.Client(MS_VISION_COMPUTER_API_TOKEN);

    clientComputer.vision.ocr({
      path: photoFileName,
      language: 'es'
    }).then(function (visionResponse) {
      firebaser.uploadImage(photoFileName, visionResponse); // best effort: fire and forget

      if (visionResponse.regions) {
        visionResponse.regions.forEach((region) => {
          console.log(region.lines.words);
        });
      }

      if (visionResponse.words) {
        console.log('HAY WORDS');
        visionResponse.words.forEach((word) => {
          console.log(word.text);
        });
      }
    }, (e) => {
      console.log('Error: ', e);
    });;
  }
});
