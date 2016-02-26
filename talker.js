const say = require('say');

module.exports = {
  speak
};

function speak(text, callback) {
  var isRPi = process.arch === 'arm';

  const voice = isRPi ? 'voice_el_diphone' : 'Diego';
  say.speak(text, voice, 1.0, function (err) {
    if (callback) {
      return callback(err);
    }
  });
}
