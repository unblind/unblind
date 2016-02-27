#!/usr/bin/env python

import time
import RPi.GPIO as GPIO
import subprocess

def main():

    # tell the GPIO module that we want to use the
    # chip's pin numbering scheme
    GPIO.setmode(GPIO.BCM)

    # setup pin 25 as an output
    GPIO.setup(17,GPIO.IN)
    GPIO.setup(18,GPIO.IN)

    while True:
        if GPIO.input(17):
            try:
                rc = subprocess.call("cd /home/pi/unblind && sh /home/pi/unblind/visionapi.sh && cd -", shell=True)
            except OSError as e:
                print( e )
            print "button17 true"
        if GPIO.input(18):
            try:
                rc = subprocess.call("cd /home/pi/unblind && sh /home/pi/unblind/ocr.sh && cd -", shell=True)
            except OSError as e:
                print( e )
            print "button18 true"
        time.sleep(0.1)

    GPIO.cleanup()


if __name__=="__main__":
    main()
