osd = function(message){
  cplayer.stdin.write('\nosd_show_text "'+ message +'" 10000 \n');
};

isStopped = function(data){
  // give mplayer output console.log(data.toString('utf-8'));
  if (typeof data != "undefined") {
    // TODOD regex 
    if (data.toString('utf-8').trim().split(':').length >= 2 && playerState.stop == false) {
      if (data.toString('utf-8').trim().split(':')[2] == ' pcm closed') {
        //console.log(data.toString('utf-8').trim().split(':'));        
        console.log('Stopped');
        playerState.stop = true;
        return true
      }
    }else{
      return false
    }
  }
  //end funtion
};

callbackOnData = function(data){
  if (typeof data != "undefined") {
    if (isStopped(data)) {
      // remove the event listener cplayer.stdout.on DATA 
      this.removeListener('data', callbackOnData);
      //console.log('callback ',this);
      setNextVideo();
    }
  } else {
    console.log('DATA not defined ');
  }
  //playlistId
};

setNextVideo = function(playlistId){
  if (playerState.queue == true) {
    logger.info('[PlAYER][QUEUE] Start next Video');
    cplayer.stdin.write('\nosd_show_text "Next video" 10000 \n');
    setState('Next Video');         
    NextQueue();  
  }else{
    cplayer.stdin.write('\nosd_show_text " O_O " 10000 \n');
  }
};

getError = function(cplayer){
  cplayer.on('error',function(data) {
    console.log(data);
    logger.error('[PLAYER] error',data);
  });
};

getData = function(cplayer){
  logger.info('is playing')
  cplayer.stdout.on('data', callbackOnData);
};

getExit = function(cplayer){
  cplayer.on('exit',function(data) {
    playerState.play = false;
    logger.info('[PLAYER] exit ',cplayer.pid);
  });
};

getClose = function(cplayer){
  cplayer.on('close',function(data) {
    logger.info('[PLAYER] close ',cplayer.pid);
  });
};

player = function(playlistId) {
  //highlighting the current played /selected item
  entry = Playlist.findOne(playlistId);
  console.log(entry);
  logger.info('[ENTRY]',entry.title ,entry._id);
  updateIsPlaying(playlistId);
  playerState.stop = false;

  if (typeof entry.url != "undefined" ) {
    if(typeof cplayer != "undefined"){
      // remove previous event listeners
      cplayer.removeAllListeners('error');
      cplayer.removeAllListeners('exit');
      cplayer.removeAllListeners('close');

      setState('Play '+ entry.title);   

      cplayer.stdin.write('\nosd_show_text "LOADING : '+entry.title+'" 10000 \n');
      // load next / new video
      cplayer.stdin.write('\nloadfile '+entry.url.trim()+'\n');
      cplayer.stdin.write('\nvo_fullscreen 1 \n');

      playerState.play = true;

      getData(cplayer);
      getError(cplayer);
      getClose(cplayer);
      getExit(cplayer);

    }else{
      logger.info(entry);
      //cplayer = cp.spawn('mplayer ',[entry.url.trim()]); '-cache-min','20' 
      cplayer = cp.spawn('mplayer',['-idle','-fs',entry.url.trim()]);
/*
      logger.info('[MPLAYER]',entry.date)
      logger.info('[MPLAYER]',entry.date)*/
      
      playerState.play = true;
      logger.info('PID',cplayer.pid)
      setState('Play '+ entry.title);   

      getData(cplayer);

      osd('Play :' + entry.title);

      getError(cplayer);
      getClose(cplayer);
      getExit(cplayer);

    }
  } else {
    logger.error('DB ',entry)
  }
}