'use strict';

const firebase = require('firebase'),
      talker = require('./talker'),
      utils = require('./utils');

module.exports = {
  uploadImage
};

const myFirebaseRef = new Firebase('https://myeyes.firebaseio.com/screenshots');

function uploadImage(photoFileName, facesInfo) {
  const imageb64 = utils.encodeFileToB64(photoFileName);
  var screenshotsImagesRef = myFirebaseRef.push();
  screenshotsImagesRef.set({data: imageb64, faceInfo: facesInfo}, function(err) {
    if (err) {
      console.log('Error when upload the image.');
      return;
    }

    console.log('Image uploaded.');
  });
}
