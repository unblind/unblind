const say = require('say');

module.exports = {
  speak
};

function speak(text) {
  say.speak(text, 'voice_el_diphone'); // XXX ignore callback
}
