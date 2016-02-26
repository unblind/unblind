'use strict';

const talker = require('./talker');
const firebaser = require('./firebaser');

const photographer = require('./photographer.js');

const vision = require('node-cloud-vision-api');
const oxford = require('project-oxford');

const GOOGLE_VISION_API_TOKEN = process.env.GOOGLE_VISION_API_TOKEN;

if (!GOOGLE_VISION_API_TOKEN) {
  console.error('You need to set a GOOGLE_VISION_API_TOKEN env var');
  process.exit(1);
}

vision.init({auth: GOOGLE_VISION_API_TOKEN});

const MS_VISION_FACE_API_TOKEN = process.env.MS_VISION_FACE_API_TOKEN;
const MS_VISION_EMOTION_API_TOKEN = process.env.MS_VISION_EMOTION_API_TOKEN;
const MS_VISION_COMPUTER_API_TOKEN = process.env.MS_VISION_COMPUTER_API_TOKEN;

if (!MS_VISION_FACE_API_TOKEN || !MS_VISION_EMOTION_API_TOKEN || !MS_VISION_COMPUTER_API_TOKEN) {
  console.error('You need to set a MS_VISION_FACE_API_TOKEN and MS_VISION_EMOTION_API_TOKEN and MS_VISION_COMPUTER_API_TOKEN env vars');
  process.exit(1);
}

const clientFaces = new oxford.Client(MS_VISION_FACE_API_TOKEN),
      clientEmotions = new oxford.Client(MS_VISION_EMOTION_API_TOKEN),
      clientComputer = new oxford.Client(MS_VISION_COMPUTER_API_TOKEN);

photographer.takePhoto(function(err, photoFileName) {
  if (err) {
    talker.speak('No puedo hacer una foto ahora. Lo siento.', () => process.exit(1));
    return;
  }

	console.log('File: ' + photoFileName);

  firebaser.uploadImage(photoFileName, {}); // best effort: fire and forget

  clientFaces.face.detect({
      path: photoFileName,
      analyzesAge: true,
      analyzesGender: true,
      analyzesSmile: true,
      analyzesFacialHair: true
  }).then((res) => {
    console.log(JSON.stringify(res));

    if (res.length > 0) {
      // process people
      let generalDescription = 'Ahora mismo tienes a ' + (res.length === 1 ? 'una persona' : res.length + ' personas') + ' delante.';

      talker.speak(generalDescription, function () {
        if (res.length < 4) { // avoid parsing too many people
          let description = describeOxfordPeople(res);
          talker.speak(description, () => process.exit(0));
        } else {
          let age = 0;
          people.forEach(person => {
            age += person.faceAttributes.age;
          });
          let averageAge = (age / res.length).toFixed(0);

          talker.speak('Su edad media es de unos ' + averageAge + ' anyos y son casi todos hombres', () => process.exit(0));
        }
      });
    } else {
      const req = new vision.Request({
        image: new vision.Image(photoFileName),
        features: [
          new vision.Feature('LABEL_DETECTION', 10),
          new vision.Feature('LANDMARK_DETECTION', 5),
          new vision.Feature('LOGO_DETECTION', 5)
        ]
      });

      vision.annotate(req).then((res) => {
        console.log(JSON.stringify(res));

        if (Array.isArray(res.responses) && res.responses.length > 0) {
          let response = res.responses[0];

          if (Array.isArray(response.logoAnnotations) && response.logoAnnotations.length > 0) {
            let brand = response.logoAnnotations[0].description;
            talker.speak('Tienes delante un producto de la marca ' + brand, () => process.exit(0));
          } else {
            talker.speak('Lo siento. No he encontrado nada interesante.', () => process.exit(0));
          }
        } else {
          talker.speak('Lo siento. No he encontrado nada.', () => process.exit(0));
        }
      }, (e) => {
        console.log('Error: ', e);
        process.exit(1);
      });
    }
  }, (e) => {
    console.log('Error: ', e);
    process.exit(1);
  });
});

function describeOxfordPeople(people) {
  let description = '';

  people.forEach(person => {
    let personDescription = 'Hay ' +
            (person.faceAttributes.gender === 'male' ? 'un hombre' : 'una mujer') +
            ' de unos ' + (person.faceAttributes.age).toFixed(0) + ' anyos';

    if (person.faceAttributes.gender === 'male') {
      if (person.faceAttributes.facialHair.beard >= 0.3 && person.faceAttributes.facialHair.beard < 0.5) {
        personDescription += ', que tiene barba de unos dias';
      } else if (person.faceAttributes.facialHair.beard >= 0.7) {
        personDescription += ', con mucha barba';
      }
    }

    if (person.faceAttributes.smile > 0.6) {
      personDescription += ', y que esta sonriendo.'
    } else {
      personDescription += '.';
    }
    description += personDescription + ' ';
  });

  console.log('speak %s', description);
  return description;
}
