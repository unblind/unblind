const say = require('say');

module.exports = {
  speak
};

function speak(text) {
  say.speak(text); // XXX ignore callback
}
