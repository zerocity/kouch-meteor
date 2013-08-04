#!/bin/bash

. /lounge/triggers/functions.sh
function parse_query() {

  IFS="&"
  KEY=$2
  array=($@)

  for i in "${array[@]}";
    do IFS="=";
    set -- $i;
    #PARAMS[$1]=$2;
    if [ "$1" == "$KEY" ]
    then
      echo $2
      return 0
    fi
  done

}

ID="`echo "$1" | sed 's/.*v=//g' | sed 's/&.*$//g'`"
INFO=$(wget -qO- "http://www.youtube.com/get_video_info?&video_id=$ID&el=detailpage")
STREAMS="$(l_urldecode "`parse_query $INFO "url_encoded_fmt_stream_map"`")"
TITLE=$(l_urldecode "`parse_query $INFO "title"`")

IFS=","

set -- $STREAMS

SELECTED=
for s in $@; do 
	f=$(l_urldecode "`parse_query $s "type"`"|cut -d ';' -f1)

	if [ "$f" != "video/x-flv" ]; then
		SELECTED="$SELECTED,$s"
	fi
done

if [ -z "$SELECTED" ]; then
	SELECTED="$STREAMS"
fi

set -- $SELECTED

large=
medium=
small=

for s in $@; do
	q=`parse_query $s "quality"`
	if [ -z "$large" -a "$q" == "large" ]; then
		large="$s"
	elif [ -z "$medium" -a "$q" == "medium" ]; then
		medium="$s"
	elif [ -z "$small" -a "$q" == "small" ]; then
		small="$s"
	fi
done  

SELECTED="$large"

if [ -z "$SELECTED" ]; then
  SELECTED="$medium"
fi

if [ -z "$SELECTED" ]; then
  SELECTED="$small"
fi

SURL=$(l_urldecode "`parse_query $SELECTED "url"`")
SIG="`parse_query $SELECTED "sig"`"
URL="$SURL&signature=$SIG"

echo $URL
echo $TITLE