'use strict';

const gpio = process.arch === 'arm' ? null : require('node-gpio');

const BUTTON_IMAGE_PIN = '17';
const BUTTON_OCR_PIN = '18';
const INIT_EVENTS = 2;

module.exports.run = function run() {

  if (gpio) {
    let buttonImage = new GPIO(BUTTON_IMAGE_PIN);
    let buttonOCR = new GPIO(BUTTON_OCR_PIN);
    let initProcess = 0;
    buttonImage.open();
    buttonImage.setMode(gpio.IN);
    buttonOCR.open();
    buttonOCR.setMode(gpio.IN);
    buttonImage.on("changed", function (value) {
      if (value === gpio.LOW) {
        if (initProcess === INIT_EVENTS ) {
          console.log('Do image process');
        } else {
          initProcess ++;
        }
      }
    });
    buttonOCR.on("changed", function (value) {
      if (value === gpio.LOW) {
        if (initProcess === INIT_EVENTS ) {
          console.log('Do ocr process');
        } else {
          initProcess ++;
        }
      }
    });
    buttonImage.listen();
    buttonOCR.listen();
  } else {
    console.log('No Raspberry Pi interface');
  }

};
