# My Eyes

La documentación del proyecto MyEyes, desarrollado en el HackForGood Valladolid de 2016, está recogida en [unblind-doc](https://github.com/unblind/unblind-doc).

## Configuración del software

Es necesario conseguir un token de Google Cloud Vision API y del Microsoft Project Oxford, y exportarlas como variables de entorno en vuestra Raspberry Pi.

```
export GOOGLE_VISION_API_TOKEN=<your-token>
export MS_VISION_FACE_API_TOKEN=<your-token>
export MS_VISION_EMOTION_API_TOKEN=<your-token>
export MS_VISION_COMPUTER_API_TOKEN=<your-token>
```

La mayor parte del código está desarrollado con nodejs 4. Recomendamos usar [nvm](https://github.com/creationix/nvm), un gestor de versiones de node para instalar la versión 4 de nodejs. A continuación, clona el repositorio e instala las dependencias.

```
git clone git@github.com:unblind/unblind.git
cd unblind

npm install
```

## Configuración de la Raspberry Pi

```
# Alsa
sudo apt-get install libasound2-dev

# For text-to-speech
sudo apt-get install festival festvox-kallpc16k
sudo apt-get install festlex-cmu festlex-poslex libestools1.2 festvox-ellpc11k

# Enable analog output (not needed in my raspbian in RPi B+)
amixer cset numid=3 1  # 0=auto, 1=analog, 2=hdmi
```

## Instalar Jasper

Sigue las [instrucciones oficiales del proyecto Jasper](http://jasperproject.github.io/documentation/installation/). Nosotros utilizamos Raspbian.

Para incluir voces en español, edita el fichero `~/.festivalrc` y añade la siguiente línea:

```
(set! voice_default 'voice_el_diphone)
```

## Instalar el controlador de los botones hardware

La Raspberry se puede controlar tanto por voz (con Jasper) o a través de botones hardware conectados a los pines gpio 17 y 18 de la Raspberry. Arranca el proceso Python que controla esos botones:

```
python ./buttons.py
```

## Instalar el proceso que escucha mensajes desde el portal

```
node ./messenger.js
```

# Licencia

Ver [LICENSE](./LICENSE)
