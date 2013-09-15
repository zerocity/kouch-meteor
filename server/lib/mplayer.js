isStopped = function(data,playlistId){
  //mystery :D mplayer forks ? after several loadfile commands several EOF and on exit events happend if the player is closed 
  // --> reason for switch playerState.stop 

    if (data.toString('utf-8').trim().split(':').length >= 2 && playerState.stop == false) {
      if (data.toString('utf-8').trim().split(':')[2] == ' pcm closed') {
        //console.log(data.toString('utf-8').trim().split(':'));
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

  if(cplayer){
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
    });

    cplayer.on('exit',function(data) {
      cplayer.stdin.write('\nosd_show_text "player stopped" 10000 \n');
      playerState.play = false;
      //the player shouldn't close --> -idle on mplayer call 
      logger.info('[PLAYER] exit ',cplayer.pid);
    });

  }else{
    logger.info(entry);
    //cplayer = cp.spawn('mplayer ',[entry.url.trim()]); 
    cplayer = cp.spawn('mplayer',['-idle','-fs',entry.url.trim()]);

    logger.info('PID',cplayer.pid)
    setState('Play '+ entry.title);   
    playerState.play = true;

    cplayer.stdout.on('data', function (data) {
      isStopped(data,playlistId)
    });
   
    cplayer.stdin.write('\nosd_show_text "Play : '+entry.title+'" 10000 \n')
   
    cplayer.stderr.on('data', function (data) {
      //console.error(data.toString('utf-8'));
    });

    cplayer.on('error',function(data) {
      logger.info('[PLAYER] error',data);
    });

    cplayer.on('close',function(data) {
      logger.info('[PLAYER] close',cplayer.pid);
    });

    cplayer.on('exit',function(data) {
      cplayer.stdin.write('\nosd_show_text "player stopped" 10000 \n');
      playerState.play = false;
      //the player shouldn't close --> -idle on mplayer call 
      logger.info('[PLAYER] exit',cplayer.pid);
    });

  }

}
/*
  if (playerState.play == false) {
    
    //Starts mplayer process with url , the mplayer parameters are saved in mplayer.conf --> /etc/mplayer/mplayer.conf
    cplayer = cp.spawn('mplayer',[entry.url.trim()]);     //-fs '-fixed-vo' <-- freez lastframe 
    // old mplayer parameters
    //cplayer = cp.spawn('mplayer',['-slave','-idle','-cache','4096','-fs',entry.trim()]);     //-fs '-fixed-vo'
    logger.info('[PID] ',cplayer.pid)
    logger.info('[CALL][Player] ',entry.title);
  
    playerState.play = true;
    
    //visualise on the web interface what the player is doing
    setState('Play '+ entry.title);   

    cplayer.stdout.on('data', function (data) {
      //console.log('[CALL][MPlayer]\n' +data);
      //send commands //player.stdin.write('\nmute\n')
    });

    cplayer.on('close',function(data) {
      logger.info('[PLAYER] close');
      playerState.play = false;
    });

    cplayer.on('exit',function(data) {
      //var url = "http://r1---sn-5go7dn7d.c.youtube.com/videoplayback?sparams=algorithm%2Cburst%2Ccp%2Cfactor%2Cid%2Cip%2Cipbits%2Citag%2Csource%2Cupn%2Cexpire&fexp=903309%2C916904%2C913562%2C929231%2C916625%2C929117%2C929121%2C929906%2C929907%2C929922%2C929127%2C929129%2C929131%2C929930%2C925726%2C925720%2C925722%2C925718%2C929917%2C929919%2C929933%2C912521%2C932306%2C913428%2C913563%2C904830%2C919373%2C930803%2C908536%2C904122%2C932211%2C938701%2C936308%2C909549%2C900816%2C912711%2C904494%2C904497%2C900375%2C906001&source=youtube&expire=1377477889&ip=2001%3A858%3A5%3A3a23%3A8603%3Aa5bd%3A5fca%3A80db&algorithm=throttle-factor&burst=40&ipbits=48&id=dc7130f90a2e5e58&cp=U0hWTFRSVV9NU0NONl9MTFlJOkVBWTI2Rll1Vk03&key=yt1&factor=1.25&upn=KK-azF-OFEw&ms=au&mv=u&mt=1377456423&sver=3&itag=34&signature=B7A8F34A1A00FB4F25DBBB1E0042C18E66D51059.850B9E21235CFF19F847AFAFE7C7057DDD328F15&ratebypass=yes"
      //cplayer.stdin.write('\nloadfile '+url.trim()+'\n');
      logger.info('[PLAYER] exit');

      if (playerState.queue == true) {
        logger.info('[PlAYER][QUEUE] Start next Video');
        setState('Next Video')
        NextQueue(playlistId);            
      }else{

      }


    });

  }else{
    logger.info('[PID] ',cplayer.pid)
    logger.info('[STATE]',playerState);

    if (playerState.queue == true) {
      logger.info('[PlAYER][QUEUE] Start next Video');
      setState('Next Video')
      NextQueue(playlistId);            
    }else{
      if (entry.url) {
        // if the user start a other video in the playlist
        cplayer.stdin.write('\nloadfile '+entry.url.trim()+'\n');
      } else{
        playerState.queue = false;
        playerState.play = false;
        logger.info('[PlAYER][QUEUE][MODE] OFF');
        logger.info('[Player] close');
        //reset visualisation on webinterface
        setState('')
      };
    }
  }
}*/