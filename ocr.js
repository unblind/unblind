'use strict';

const talker = require('./talker');
const firebaser = require('./firebaser');

const vision = require('node-cloud-vision-api');

const GOOGLE_VISION_API_TOKEN = process.env.GOOGLE_VISION_API_TOKEN;

if (!GOOGLE_VISION_API_TOKEN) {
  console.error('You need to set a GOOGLE_VISION_API_TOKEN env var');
  process.exit(1);
}

vision.init({auth: GOOGLE_VISION_API_TOKEN});

var photographer = require('./photographer.js');

photographer.takePhoto(function(err, photoFileName) {
  if (err) {
    talker.speak('No puedo hacer una foto ahora. Lo siento.', () => process.exit(1));
    return;
  }

  console.log('File: ' + photoFileName);

  const req = new vision.Request({
    image: new vision.Image(photoFileName),
    features: [
      new vision.Feature('TEXT_DETECTION', 10)
    ]
  });

  firebaser.uploadImage(photoFileName, {}); // best effort: fire and forget

  vision.annotate(req).then((res) => {
    console.log(JSON.stringify(res.responses));

    // use the first response
    if (Array.isArray(res.responses) && res.responses.length > 0) {
      let response = res.responses[0];

      if (Array.isArray(response.textAnnotations) && response.textAnnotations.length > 0) {
        let spokenText = response.textAnnotations[0].description;
        spokenText = spokenText.replace(/\n/g, ". ");
        spokenText = fixString(spokenText);
        console.log('speak %s', spokenText);
        talker.speak('Atiende, este es el texto que he leido: ' + spokenText, () => process.exit(0));
      } else {
        console.log('No text annotations');
        talker.speak('No consigo entender ese texto.', () => process.exit(0));
      }
    } else {
      console.log('No responses');
      talker.speak('Lo siento, no consigo entender ese texto.', () => process.exit(0));
    }
  }, (e) => {
    console.log('Error: ', e);
    process.exit(1);
  }).catch((e) => {
    console.log('ERROR FATAL', e);
    process.exit(1);
  });
});

// see http://stackoverflow.com/a/20444401/12388
function fixString(str) {
  var temp = "",
      count = 0;
  str.split("").forEach(function (value, index, array) {
      var next = array[index + 1],
          x = value.charCodeAt(),
          isChar = ((x >= 65 && x <= 90) || (x >= 97 && x <= 122));
      if (value === " ") {
          count++;
      } else if (count > 0 && value !== " ") {
          temp += ((next && next !== " ") || (temp.length > 0 && isChar) ? " " : "") + value;
          count = 0;
      } else {
          temp += value;
      }
  });
  return temp;
}
