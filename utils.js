'use strict';

var fs = require('fs');

module.exports.encodeFileToB64 = function encodeFileToB64(filename) {
  // read binary data
  var bitmap = fs.readFileSync(filename);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
};
