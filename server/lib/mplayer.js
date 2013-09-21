isStopped = function(data,playlistId){
  //mystery :D mplayer forks ? after several loadfile commands several EOF and on exit events happend if the player is closed 
  // --> reason for switch playerState.stop 

    if (data.toString('utf-8').trim().split(':').length >= 2 && playerState.stop == false) {
      if (data.toString('utf-8').trim().split(':')[2] == ' pcm closed') {
        //console.log(data.toString('utf-8').trim().split(':'));
        //cplayer.stdin.end();
          
        console.log('Stopped');
        playerState.stop = true;

        if (playerState.queue == true) {
          logger.info('[PlAYER][QUEUE] Start next Video');
          cplayer.stdin.write('\nosd_show_text "Next video" 10000 \n');
          setState('Next Video')
          NextQueue(playlistId);            
        }else{
          cplayer.stdin.write('\nosd_show_text "player stopped" 10000 \n');
        }

      } 
    }
  //end funtion
}

player = function(playlistId) {
  //highlighting the current played /selected item
  entry = Playlist.findOne(playlistId);
  logger.info('[ENTRY]',entry.title ,entry._id);
  updateIsPlaying(playlistId);
  playerState.stop = false;

  if (typeof entry.url != "undefined" ) {
    if(typeof cplayer != "undefined"){
      logger.info('PLAYER is present')
      logger.info('PID',cplayer.pid)
      setState('Play '+ entry.title);   
      logger.info('\nosd_show_text "LOADING : '+entry.title+'" 10000 \n')
      cplayer.stdin.write('\nosd_show_text "LOADING : '+entry.title+'" 10000 \n');
      cplayer.stdin.write('\nloadfile '+entry.url.trim()+'\n');
      playerState.play = true;

      cplayer.stdout.on('data', function (data) {
        //console.log(data.toString('utf-8').trim().split(':'));
        //give the the output of mplayer in list form 
        isStopped(data,playlistId)
      });

      cplayer.on('error',function(data) {
        logger.info('[PLAYER] error',data);
      });

      cplayer.on('close',function(data) {
        logger.info('[PLAYER] close ',cplayer.pid);
        cplayer.stdin.end();
      });

      cplayer.on('exit',function(data) {
        cplayer.stdin.write('\nosd_show_text "player stopped" 10000 \n');
        playerState.play = false;
        //the player shouldn't close --> -idle on mplayer call 
        logger.info('[PLAYER] exit ',cplayer.pid);
        cplayer.stdin.end();      
      });

    }else{
      logger.info(entry);
      //cplayer = cp.spawn('mplayer ',[entry.url.trim()]); 
      cplayer = cp.spawn('mplayer',['-idle','-fs',entry.url.trim()]);
      
      playerState.play = true;
      logger.info('PID',cplayer.pid)
      setState('Play '+ entry.title);   

      cplayer.stdout.on('data', function (data) {
        isStopped(data,playlistId)
      });
     
      cplayer.stdin.write('\nosd_show_text "Play : '+entry.title+'" 10000 \n')
     
      cplayer.stderr.on('data', function (data) {
        console.error(data.toString('utf-8'));
      });

      cplayer.on('error',function(data) {
        data.toString('utf-8').trim().split(':')
        //logger.info('[PLAYER] error',data);
      });

      cplayer.on('close',function(data) {
        logger.info('[PLAYER] close',cplayer.pid);
        cplayer.stdin.end();
      });

      cplayer.on('exit',function(data) {
        playerState.play = false;
        //the player shouldn't close --> -idle on mplayer call 
        logger.info('[PLAYER] exit',cplayer.pid);
        cplayer.stdin.end();
            
      });

    }
  } else {
    logger.error('DB ',entry)
  }

}