# unblind

Unblind. Be my eyes. HackForGood Valladolid, 2016

```
export GOOGLE_VISION_API_TOKEN=<your-token>
export MS_VISION_FACE_API_TOKEN=<your-token>
export MS_VISION_EMOTION_API_TOKEN=<your-token>
export MS_VISION_COMPUTER_API_TOKEN=<your-token>

npm install
node visionapi
```

## Install in the Raspberry Pi

```
# Alsa
sudo apt-get install libasound2-dev

# For text-to-speech
sudo apt-get install festival festvox-kallpc16k
sudo apt-get install festlex-cmu festlex-poslex libestools1.2 festvox-ellpc11k

# Enable analog output (not needed in my raspbian in RPi B+)
amixer cset numid=3 1  # 0=auto, 1=analog, 2=hdmi
```
```
# install nvm
npm install -g node-gpio
```

## Install Jasper

Follow the official instructions.

Spanish voices

Edit ~/.festivalrc to add:

```
(set! voice_default 'voice_el_diphone)
```


#Init pushbutton mode:
```
sudo ./buttons.py
```
