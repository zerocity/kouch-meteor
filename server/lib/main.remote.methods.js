Meteor.methods({
  backward : function(){
    if (playerState.play) {
      var kkId = Kouch.find({}).fetch()[0];
      var next = kkId.playlist.indexOf(kkId.currentPosition) - 1      
      var nextVideo = kkId.playlist[next];
      logger.info(nextVideo);
      if (next >=0 && next <= kkId.playlist.length ) {
        if (playerState.queue == true) {
          skipVideo(nextVideo,true);      
        }else{
          skipVideo(nextVideo,false);
        }
      }
    }
  },
  forward : function(){
    if (playerState.play) {
      var kkId = Kouch.find({}).fetch()[0];
      var next = kkId.playlist.indexOf(kkId.currentPosition) + 1      
      var nextVideo = kkId.playlist[next];
      logger.info(next);
      logger.info(kkId.playlist.length);
      if (next >=0 && next <= kkId.playlist.length ) {
        if (playerState.queue == true) {
          skipVideo(nextVideo,true);      
        }else{
          skipVideo(nextVideo,false);
        }
      }
    }
  },
  playerMute : function(){
    if (playerState.play) {
      if (playerState.mute == false) {
        playerState.mute = true
        cplayer.stdin.write('\nmute 1\n');
        logger.info('[CALL][PlAYER] Mute ON');
      }else{
        cplayer.stdin.write('\nmute 0\n');
        logger.info('[CALL][PlAYER] Mute OFF');
        playerState.mute = false
      }
    }
  },
  playerPause : function(){
    if (playerState.play == true) {
      logger.info('[CALL][PlAYER] Pause');
      cplayer.stdin.write('\npause\n');
    }else{
      if (playerState.playerRun == false) {
        NextQueue();
      }else{
        logger.info('[CALL][PlAYER] Play');
        cplayer.stdin.write('\npause\n');
      }
    }
  },
  playerStop : function(){
    if (playerState.play == true) {
      logger.info('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');
      //var url = "http://r1---sn-5go7dn7d.c.youtube.com/videoplayback?sparams=algorithm%2Cburst%2Ccp%2Cfactor%2Cid%2Cip%2Cipbits%2Citag%2Csource%2Cupn%2Cexpire&fexp=903309%2C916904%2C913562%2C929231%2C916625%2C929117%2C929121%2C929906%2C929907%2C929922%2C929127%2C929129%2C929131%2C929930%2C925726%2C925720%2C925722%2C925718%2C929917%2C929919%2C929933%2C912521%2C932306%2C913428%2C913563%2C904830%2C919373%2C930803%2C908536%2C904122%2C932211%2C938701%2C936308%2C909549%2C900816%2C912711%2C904494%2C904497%2C900375%2C906001&source=youtube&expire=1377477889&ip=2001%3A858%3A5%3A3a23%3A8603%3Aa5bd%3A5fca%3A80db&algorithm=throttle-factor&burst=40&ipbits=48&id=dc7130f90a2e5e58&cp=U0hWTFRSVV9NU0NONl9MTFlJOkVBWTI2Rll1Vk03&key=yt1&factor=1.25&upn=KK-azF-OFEw&ms=au&mv=u&mt=1377456423&sver=3&itag=34&signature=B7A8F34A1A00FB4F25DBBB1E0042C18E66D51059.850B9E21235CFF19F847AFAFE7C7057DDD328F15&ratebypass=yes"
      //cplayer.stdin.write('\nloadfile '+url.trim()+ loop 2 '\n');


    }else{
      if (playerState.queue == true) {
        logger.info('[CALL][PlAYER] Stop');
        cplayer.stdin.write('\nstop\n');
      }
    }
  },
  volume : function(slider){
    if (playerState.play) {
      logger.info('[CALL][PlAYER] Vol set to:',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }
    //cplayer.stdin.write('\nvolume 10\n');      
  },
  volDown : function(){
    if (playerState.play) {
      logger.info('[CALL][PlAYER] Vol Down');
      cplayer.stdin.write('\nvolume -10\n');
    }
  },    
  volUp : function(){
    if (playerState.play) {
      logger.info('[CALL][PlAYER] Vol Up');
      cplayer.stdin.write('\nvolume 10\n');
    }
  },
  playerLeft : function(){
    if (playerState.play) {
      logger.info('[CALL][PlAYER] Seek -15 sec');
      cplayer.stdin.write('\nseek -15 0\n');
    }
  },    
  playerRight : function(){
    if (playerState.play) {
      logger.info('[CALL][PlAYER] Seek + 15');
      cplayer.stdin.write('\nseek 15 0\n');
    }
  },
  volumeSlider : function(slider) {
    if (playerState.play == true) {
      logger.info('[CALL] ',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }
  } 
});