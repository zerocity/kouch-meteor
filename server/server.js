Meteor.startup(function () {
  var cplayer;
  var cp = Npm.require('child_process');

  var playerState = {
    play : false,
    mute : false,
    queue : false
  }

  var Playlist = new Meteor.Collection("playlist");
  var Kouch = new Meteor.Collection("Kouch"); 
  var Queue = new Meteor.Collection("queue");

  var player = function(sourceUrl) {
    if (playerState.play == false) {   
      cplayer = cp.spawn('mplayer',['-slave','-cache','4096','-fs',sourceUrl.trim()]);
      //var player = cp.spawn('omxplayer',[sourceUrl.trim()]);16384
      console.log('[CALL][Player]');
      playerState.play = true;
      cplayer.stdout.on('data', function (data) {
        //console.log('[CALL][MPlayer]\n' +data);
        // send commands //player.stdin.write('\nmute')
      });

      cplayer.on('close',function(data) {
        playerState.play = false;
        console.log('[Player] close');
        if (playerState.queue == true) {
          console.log('[PlAYER][QUEUE] Start next Video');
          playerState.queue = false;
          var qq = Meteor.call('getQueue')
          console.log('[PlAYER][QUEUE][MODE] OFF');
        }
      });
    }
  }

  Meteor.methods({
    playerMute : function(){
      if (playerState.mute == false) {
        playerState.mute = true
        cplayer.stdin.write('\nmute 1\n');
        console.log('[CALL][PlAYER] Mute ON');
      }else{
        cplayer.stdin.write('\nmute 0\n');
        console.log('[CALL][PlAYER] Mute OFF');
        playerState.mute = false
      }
      //cplayer.stdin.write('\nosd_show_progression');
    },
    playerPause : function(){
      if (playerState.play == true) {
        console.log('[CALL][PlAYER] Pause');
        cplayer.stdin.write('\npause\n');
      }else{
        console.log('[CALL][PlAYER] Play');
        cplayer.stdin.write('\npause\n');
      }
    },
    playerStop : function(){
      console.log('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');
    },
    volDown : function(){
      console.log('[CALL][PlAYER] Vol Down');
      cplayer.stdin.write('\nvolume -10\n');
    },    
    volUp : function(){
      console.log('[CALL][PlAYER] Vol Up');
      cplayer.stdin.write('\nvolume 10\n');
    },
    playerLeft : function(){
      console.log('[CALL][PlAYER] Seek -15 sec');
      cplayer.stdin.write('\nseek -15 0\n');
    },    
    playerRight : function(){
      console.log('[CALL][PlAYER] Seek + 15');
      cplayer.stdin.write('\nseek 15 0\n');
    },   
    playerFullscreen : function(){
      console.log('[CALL] Fullscreen');
      cplayer.stdin.write('\nf\n');
    },
    getQueue : function(){
      this.unblock();
      console.log('query');
      //return Queue.find({}).fetch()
    },
    addToPlaylist : function(searchQuery,data){
      //TODO do check if the video is allready in the playlist + 1 score
      console.log('[CALL][INSERT] '+searchQuery);
      return Playlist.insert({searchQuery:searchQuery,
        youtubeId:data.youtubeId,
        title:data.title,
        thumbnail:data.thumbnail,
        description:data.description,
        duration:data.duration,
        date:Date.now()
      });
    },
    getPlaylist : function(){
      var pl = Playlist.find({}).fetch();   
      return pl
    },
    startStream : function(){
      console.log('[CALL]Start Stream: ');
      cp.exec('livestreamer twitch.tv/nl_kripp 480p --player mplayer',function (error, stdout, stderr,stdin) {
        // parameter bug
        // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
       if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       if (stdout) {
          console.log(stdout);
          player(stdout);
          cplayer.stdin.write('\nf');
       };
     });
    },  
    parseWeb : function(sourceUrl,playlistId) {
      if (playerState.play == true) {
        console.log('[CALL][INSERT][QUEUE] '+playlistId);
        Queue.insert({sourceUrl:sourceUrl,playlistId:playlistId}); 
        playerState.queue = true    
      }else{
        console.log('[CALL][Parse]' + sourceUrl);
        cp.exec('youtube-dl -g -f 34/35/45/84 '+sourceUrl.toString(),function (error, stdout, stderr,stdin) {
          // parameter bug
          // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs

        if (error) {
          console.log(error.stack);
          console.log('Error code: '+error.code);
          console.log('Signal received: '+error.signal);
        }

        if (stdout) {
          player(stdout,playlistId);
        }
       
       });
    
      }
    }
  });
});