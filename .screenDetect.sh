#!/bin/bash
# edit according to your laptop and monitor specifications
LAPTOP_OUTPUT=LVDS
MONITOR_OUTPUT=VGA-0
MONITOR_OUTPUT_MODE=1280x1024
MONITOR_OUTPUT_RATE=60
MODE=`xrandr | grep "$MONITOR_OUTPUT connected" -c`
if [ "$MODE" == '1' ]
   then
   # external monitor connected
   xrandr --output MONITOR_OUTPUT --primary && xrandr --output LAPTOP_OUTPUT --off && xrandr --output MONITOR_OUTPUT --mode MONITOR_OUTPUT_MODE --rate MONITOR_OUTPUT_RATE
   else
   # external monitor not connected, default for the laptop's monitor
   xrandr --output LAPTOP_OUTPUT --auto
fi
exit