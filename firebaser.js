'use strict';

const firebase = require('firebase'),
      talker = require('./talker');

const myFirebaseRef = new Firebase('https://myeyes.firebaseio.com/');

myFirebaseRef.child('message').on('value', (snapshot) => {
  let text = snapshot.val();
  if (text) {
    console.log('New message: %s', text);
    talker.speak(text);
  }
});
