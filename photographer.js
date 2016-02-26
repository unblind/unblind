'use strict';

var RaspiCam = require("raspicam");

module.exports.takePhoto = function takePhoto(err, callback) {

  var isRPi = process.arch === 'arm';

  if (isRPi) {
    var currTime = new Date().getTime();
    var pictureFilename = "/home/pi/pictures/" + currTime + ".jpg";

    var opts = {
      mode: "photo",
      quality: 10,
      width: 1024,
      height: 768,
      output: pictureFilename
    };

    var camera = new RaspiCam(opts);
    camera.start(opts);
    camera.on('read', function(err, timestamp, filename){
      // Read event is called twice taking one photo. Avoid to stop the cam process at the first event.
      if (filename.indexOf('~') < 0) {
        camera.removeListener('read', function() {
          console.log('Removed listener.');
        });
        camera.stop();
        console.log('Camera stopped.');
        callback(err, filename);
      }
    });
  } else {
    // Non raspberry environments.
    callback(null, './test.jpg');
  }
};
