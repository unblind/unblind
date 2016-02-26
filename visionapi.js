'use strict';

const talker = require('./talker');
const firebaser = require('./firebaser');

const ENABLE_GOOGLE = false;
const ENABLE_MS = true;

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
        new vision.Feature('FACE_DETECTION', 5),
        new vision.Feature('LABEL_DETECTION', 5)
      ]
    });

    vision.annotate(req).then((res) => {
      console.log(JSON.stringify(res.responses));
    }, (e) => {
      console.log('Error: ', e);
    });
  }

  //
  // MS Oxford
  //
  if (ENABLE_MS) {
    var oxford = require('project-oxford');

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

    clientFaces.face.detect({
        path: photoFileName,
        analyzesAge: true,
        analyzesGender: true,
        analyzesSmile: true,
        analyzesFacialHair: true
    }).then((res) => {
      console.log('Faces found %d', res.length);

      firebaser.uploadImage(photoFileName, res); // best effort: fire and forget

      if (res.length > 0) {
        // process people

        let generalDescription = 'Ahora mismo tienes a ' + (res.length === 1 ? 'una persona' : res.length + ' personas') + ' delante.';

        talker.speak(generalDescription, function () {
          if (res.length < 4) { // avoid parsing too many people
            let description = describeOxfordPeople(res);
            talker.speak(description);
          } else {
            talker.speak('Su edad media es de unos 22 anyos y son casi todos hombres');
          }

          /**
          // TODO pass faceRectangles to make emotion recognitzion even faster
          clientEmotions.emotion.analyzeEmotion({
            path: photoFileName
          }).then((emotionRes) => {

            console.log(emotionRes);
          }, (e) => {
            console.log('Error analyze emotions: ', e);
          });
          */

          console.log(res);
        });
      } else {
        talker.speak('Lo siento. No he encontrado nada.');
      }
    }, (e) => {
      console.log('Error: ', e);
    });
  }
});

function describeOxfordPeople(people) {
  let description = '';

  people.forEach(person => {
    let personDescription = 'Hay ' +
            (person.faceAttributes.gender === 'male' ? 'un hombre' : 'una mujer') +
            ' de unos ' + (person.faceAttributes.age).toFixed(0) + ' anyos';

    if (person.faceAttributes.gender === 'male') {
      if (person.faceAttributes.facialHair.beard >= 0.25 && person.faceAttributes.facialHair.beard < 0.5) {
        personDescription += ', que no se afeita mucho';
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
