'use strict';

const firebase = require('firebase'),
      speaker = require('speaker');

const myFirebaseRef = new Firebase('https://myeyes.firebaseio.com/');

myFirebaseRef.child('messages').on('value', (snapshot) => {
  let text = snapshot.val();
  if (text) {
    console.log('New message: %s', text);
    speaker.speak(text);
  }
});
