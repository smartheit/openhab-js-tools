#!/bin/bash
led=$1
val=$2
echo $val > /sys/devices/platform/leds/leds/$led/brightness
