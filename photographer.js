'use strict';

var RaspiCam = require('raspicam');

module.exports = {
  takePhoto
};

function takePhoto(callback) {
  var isRPi = process.arch === 'arm';

  if (isRPi) {
    var currentTime = new Date().getTime();
    var pictureFilename = '/tmp/' + currentTime + '.jpg';

    var opts = {
      mode: 'photo',
      quality: 65,
      width: 640, // 1024,
      height: 480, // 768,
      output: pictureFilename,
      rotation: 270
    };

    var camera = new RaspiCam(opts);
    camera.start(opts);

    camera.on('read', function(err, timestamp, filename) {
      // XXX Read event is called twice taking one photo. Avoid to stop the cam process at the first event.
      if (filename.indexOf('~') < 0) {
        camera.removeListener('read', function() {
          console.log('Remove camera listener.');
        });
        camera.stop();
        console.log('Camera stopped.');
        callback(err, pictureFilename);
      }
    });
  } else {
    // Non raspberry environments. Use test image.
    callback(null, './test.jpg');
  }
};
