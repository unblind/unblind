'use strict';

var gpio = process.arch === 'arm' ? require('node-gpio') : null;

var BUTTON_IMAGE_PIN = '17';
var BUTTON_OCR_PIN = '18';
var INIT_EVENTS = 2;

module.exports = {
  run: run
};

function run() {

  if (!gpio) {
    console.log('No Raspberry Pi interface');
    return;
  }

  var GPIO = gpio.GPIO;
  var buttonImage = new GPIO(BUTTON_IMAGE_PIN);
  var buttonOCR = new GPIO(BUTTON_OCR_PIN);
  var initProcess = 0;

  buttonImage.open();
  buttonImage.setMode(gpio.IN);

  buttonOCR.open();
  buttonOCR.setMode(gpio.IN);

  buttonImage.on('changed', function (value) {
    if (value === gpio.LOW) {
      if (initProcess === INIT_EVENTS ) {
        console.log('Do image process');
        require('child_process').exec('sh ./visionapi.sh');
      } else {
        initProcess++;
      }
    }
  });

  buttonOCR.on('changed', function (value) {
    if (value === gpio.LOW) {
      if (initProcess === INIT_EVENTS ) {
        console.log('Do ocr process');
        require('child_process').exec('sh ./ocr.sh');
      } else {
        initProcess++;
      }
    }
  });
  buttonImage.listen();
  buttonOCR.listen();
};

run();
