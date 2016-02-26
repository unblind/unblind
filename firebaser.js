'use strict';

const firebase = require('firebase'),
      talker = require('./talker');

const myFirebaseRef = new Firebase('https://myeyes.firebaseio.com/');

// XXX firebase notifies the current value after subscription. we ignore it here
let firstMessage = true;
myFirebaseRef.child('message').on('value', (snapshot) => {
  let text = snapshot.val();
  if (!firstMessage && text) {
    console.log('New message: %s', text);
    talker.speak(text);
  }

  firstMessage = false;
});

module.exports = {
  uploadImage
}

function uploadImage(photoFileName, facesInfo) {
  // convert to base64 http://stackoverflow.com/a/28835460/12388
  /**
  [
    {
      "faceRectangle": {
        "top": 379,
        "left": 738,
        "width": 335,
        "height": 335
      },
      "faceAttributes": {
        "smile": 0.547,
        "gender": "male",
        "age": 33,
        "facialHair": {
          "moustache": 0.4,
          "beard": 0.4,
          "sideburns": 0.3
        }
      }
    },
    {
      "faceRectangle": {
        "top": 250,
        "left": 248,
        "width": 236,
        "height": 236
      },
      "faceAttributes": {
        "smile": 0.059,
        "gender": "male",
        "age": 28.2,
        "facialHair": {
          "moustache": 0.1,
          "beard": 0.2,
          "sideburns": 0.2
        }
      }
    }
  ]
  */
}
