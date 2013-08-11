Meteor.methods({
  addToPlaylist : function(searchQuery,entry){
    l('\n[CALL][ADD][TO]QUEUE][INSERT] ',searchQuery)
    var pl = Playlist.insert({searchQuery:searchQuery,
      youtubeId:entry.youtubeId,
      title:entry.title,
      thumbnail:entry.thumbnail,
      description:entry.description,
      duration:entry.duration,
      date:Date.now(),
      isPlaying:false
    });

    Kouch.update(kkId,{'$push':{ 'playlist':pl}}); 
    return pl
  },
  queueMode : function(){
    if (playerState.queue == false) {
      playerState.queue = true;
      l('[PlAYER][QUEUE][MODE] ON');
    }else{
      playerState.queue = false
      l('[PlAYER][QUEUE][MODE] OFF');
    }
  },   
  playerFullscreen : function(){
    if (playerState.play) {
      l('[CALL] Fullscreen');
      cplayer.stdin.write('\nf\n');
    }
  },
  getQueue : function(){
    l('[CALL][QUEUE] Next');
    getQueue();
    //return Queue.find({}).fetch()
  },
  delPlaylistEntry : function(id){
    l('[DEL][ENTRY] ',id);
    l(typeof id);
    check(id, String)
    Playlist.remove({_id:id});
  },
  getPlaylist : function(){
    var pl = Playlist.find({}).fetch();   
    return pl
  },
  startStream : function(){
    l('[CALL]Start Stream: ');
    cp.exec('livestreamer twitch.tv/nl_kripp 480p --player mplayer',function (error, stdout, stderr,stdin) {
      // parameter bug
      // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
     if (error) {
       l(error.stack);
       l('Error code: '+error.code);
       l('Signal received: '+error.signal);
     }
     if (stdout) {
        l(stdout);
        player(stdout);
        cplayer.stdin.write('\nf');
     };
    });
  },
  getPlayerState : function(){
    return playerState;
  },
  setPlayerState : function(key,value){
    l(playerState[key])
    l('[NEW][value] ',value);
  },
  getList : function(){
     var queue = Kouch.findOne({});
     var pla = Playlist.find({'_id': { $in : queue.playlist } }).fetch(); 
     return pla
  },
  parseWeb : function(playlistId) {
    l(playerState);
    if (playerState.play == true) {
      l('[CALL][NEW][VIDEO] ',playlistId);
      if (playerState.queue) {
        l('[In queue mode]');        
        skipVideo(playlistId,true);
      }else{
        playerState.play = false;
        skipVideo(playlistId,false);
      }

    }else{
      if (typeof playlistId !== "undefined") {
        var sourceUrl = Playlist.findOne({'_id':playlistId}).youtubeId
        l('[SOURCE]',sourceUrl);
        cp.exec('youtube-dl -g -f 34/35/45/84/102 '+sourceUrl.toString(),function (error, stdout, stderr,stdin) {
          // parameter bug
          // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
          if (error) {
            if (error.code) {
              l('[CODEX ERROR] ',error.code);
              NextQueue(playlistId);
            }
          }else{
            if (stdout) {
              if (playerState.skip == true) {
                playerState.skip = false
                playerState.queue = true
              }

              player(stdout,playlistId);
            }            
          }    
       });
      }else{ 
        l(playlistId);
      };   
    }
  }
});

/*        if (error) {
          l(error.stack);
          l('Error code: '+error.code);
          l('Signal received: '+error.signal);
        }*/  