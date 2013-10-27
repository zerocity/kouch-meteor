#!/bin/bash
# edit according to your laptop and monitor specifications
LAPTOP_OUTPUT=LVDS1
MONITOR_OUTPUT=VGA1
MONITOR_OUTPUT_MODE=--auto
MONITOR_OUTPUT_RATE=60
MODE=`xrandr | grep "$MONITOR_OUTPUT connected" -c`
if [ "$MODE" == '1' ]
   then
   # external monitor connected
   xrandr --output $MONITOR_OUTPUT --primary && xrandr --output $LAPTOP_OUTPUT --off && xrandr --output $MONITOR_OUTPUT --auto
   else
   # external monitor not connected, default for the laptop's monitor
   xrandr --output $LAPTOP_OUTPUT --auto
fi
exit