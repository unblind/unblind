# unblind

Unblind. Be my eyes. HackForGood Valladolid, 2016

```
export GOOGLE_VISION_API_TOKEN=<your google vision api token>
export MS_OXFORD_API_TOKEN=<your oxford api token>
npm install
node visionapi
```

## Install in the Raspberry Pi

```
sudo apt-get install libasound2-dev

# Enable analog output (not needed in my raspbian in RPi B+)
amixer cset numid=3 1  # 0=auto, 1=analog, 2=hdmi
```