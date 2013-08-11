Meteor.methods({
  backward : function(){
    if (playerState.play) {
      var kkId = Kouch.find({}).fetch()[0];
      var next = kkId.playlist.indexOf(kkId.currentPosition) - 1      
      var nextVideo = kkId.playlist[next];
      console.log(nextVideo);
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
      console.log(next);
      console.log(kkId.playlist.length);
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
        console.log('[CALL][PlAYER] Mute ON');
      }else{
        cplayer.stdin.write('\nmute 0\n');
        console.log('[CALL][PlAYER] Mute OFF');
        playerState.mute = false
      }
    }
  },
  playerPause : function(){
    if (playerState.play == true) {
      console.log('[CALL][PlAYER] Pause');
      cplayer.stdin.write('\npause\n');
    }else{
      if (playerState.playerRun == false) {
        NextQueue();
      }else{
        console.log('[CALL][PlAYER] Play');
        cplayer.stdin.write('\npause\n');
      }
    }
  },
  playerStop : function(){
    if (playerState.play == false) {
      console.log('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');
    }
  },
  volume : function(slider){
    if (playerState.play) {
      console.log('[CALL][PlAYER] Vol set to:',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }
    //cplayer.stdin.write('\nvolume 10\n');      
  },
  volDown : function(){
    if (playerState.play) {
      console.log('[CALL][PlAYER] Vol Down');
      cplayer.stdin.write('\nvolume -10\n');
    }
  },    
  volUp : function(){
    if (playerState.play) {
      console.log('[CALL][PlAYER] Vol Up');
      cplayer.stdin.write('\nvolume 10\n');
    }
  },
  playerLeft : function(){
    if (playerState.play) {
      console.log('[CALL][PlAYER] Seek -15 sec');
      cplayer.stdin.write('\nseek -15 0\n');
    }
  },    
  playerRight : function(){
    if (playerState.play) {
      console.log('[CALL][PlAYER] Seek + 15');
      cplayer.stdin.write('\nseek 15 0\n');
    }
  },
  volumeSlider : function(slider) {
    if (playerState.play == true) {
      console.log('[CALL] ',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }
  } 
});