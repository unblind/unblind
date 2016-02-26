'use strict';

const firebase = require('firebase'),
      talker = require('./talker'),
      utils = require('./utils');

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
};
const myFirebaseRef2 = new Firebase('https://myeyes.firebaseio.com/screenshots');

function uploadImage(photoFileName, facesInfo) {
  const imageb64 = utils.encodeFileToB64(photoFileName);
  var screenshotsImagesRef = myFirebaseRef2.push();
  screenshotsImagesRef.set({data: imageb64, faceInfo: facesInfo}, function(err) {
    if (err) {
      console.log('Error when upload the image.');
      return;
    }

    console.log( 'Image uploaded.');
  });
}
