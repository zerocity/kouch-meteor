Meteor.methods({
  backward : function(){
    if (cplayer.pid) {
      var kkId = Kouch.findOne();
      var next = kkId.playlist.indexOf(kkId.currentPosition) - 1      
      var nextVideo = kkId.playlist[next];

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
    if (cplayer.pid) {
      var kkId = Kouch.findOne();
      var next = kkId.playlist.indexOf(kkId.currentPosition) + 1      
      var nextVideo = kkId.playlist[next];

      logger.info(kkId.playlist)
      logger.info('currentPosition',kkId.currentPosition)
      logger.info('Next',next)
      logger.info('playlistid',nextVideo)
      
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
    if (cplayer.pid) {
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

    if (typeof cplayer != "undefined") {
      if (playerState.play == true) {
          playerState.play = false
          cplayer.stdin.write('\nosd_show_text "player pause" 10000 \n');
          cplayer.stdin.write('\npause\n');
      }else{
        if (playerState.stop == true) {
          logger.info('[CALL][PlAYER] stopped next video');
          NextQueue();
        }else{
          playerState.play = true
          cplayer.stdin.write('\nosd_show_text "player play" 10000 \n');
          cplayer.stdin.write('\nplay\n');
        }
      }
    }
  },
  playerStop : function(){
    if (typeof cplayer.pid != "undefined") {
      cplayer.stdin.write('\nosd_show_text "player stoped" 10000 \n');
      logger.info('[CALL][PlAYER] Stop',cplayer.pid);
      cplayer.stdin.write('\nstop\n');      
    } else {
      logger.info('[CALL][PlAYER] Stop ','no player');
    }
  },
  volume : function(slider){
    if (cplayer.pid) {
      logger.info('[CALL][PlAYER] Vol set to:',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }
    //cplayer.stdin.write('\nvolume 10\n');      
  },
  volDown : function(){
    if (cplayer.pid) {
      logger.info('[CALL][PlAYER] Vol Down');
      cplayer.stdin.write('\nvolume -10\n');
    }
  },    
  volUp : function(){
    if (cplayer.pid) {
      logger.info('[CALL][PlAYER] Vol Up');
      cplayer.stdin.write('\nvolume 10\n');
    }
  },
  playerLeft : function(){
    if (cplayer.pid) {
      logger.info('[CALL][PlAYER] Seek -15 sec');
      cplayer.stdin.write('\nseek -15 0\n');
    }
  },    
  playerRight : function(){
    if (cplayer.pid) {
      logger.info('[CALL][PlAYER] Seek + 15');
      cplayer.stdin.write('\nseek 15 0\n');
    }
  },
  volumeSlider : function(slider) {
    if (cplayer.pid) {
      logger.info('[CALL] ',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }
  } 
});