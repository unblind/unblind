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
