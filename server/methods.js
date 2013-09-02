Meteor.methods({
  addToPlaylist : function(searchQuery,entry){
    var pl = Playlist.insert({searchQuery:searchQuery,
      youtubeId:entry.youtubeId,
      title:entry.title,
      thumbnail:entry.thumbnail,
      description:entry.description,
      duration:entry.duration,
      date:Date.now(),
      isPlaying:false
    });
    logger.info('\n[CALL][ADD][TO]QUEUE][INSERT] ',pl)
    Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
    return pl
  },
  queueMode : function(){
    if (playerState.queue == false) {
      playerState.queue = true;
      logger.info('[PlAYER][QUEUE][MODE] ON');
    }else{
      playerState.queue = false
      logger.info('[PlAYER][QUEUE][MODE] OFF');
    }
  },   
  playerFullscreen : function(){
    if (playerState.play) {
      logger.info('[CALL] Fullscreen');
      cplayer.stdin.write('\nf\n');
    }
  },
  getQueue : function(){
    logger.info('[CALL][QUEUE] Next');
    getQueue();
    //return Queue.find({}).fetch()
  },
  delPlaylistEntry : function(id){
    logger.info('\n[DEL][ENTRY] ',id);
    check(id, String)

    var kk = Kouch.findOne({})
    var pos = kk.playlist.indexOf(id)

    kk.playlist.splice(pos,1)
   
    /*logger.info('POS',pos);
    logger.info('OLD',kk.playlist);
    logger.info('new',kk.playlist);*/
    Kouch.update({'_id':kk._id},{ $set :{'playlist':kk.playlist}});

  },
  getPlaylist : function(){
    var pl = Playlist.find({}).fetch();   
    return pl
  },
  startStream : function(){
    logger.info('[CALL]Start Stream: ');
    cp.exec('livestreamer twitch.tv/nl_kripp 480p --player mplayer',function (error, stdout, stderr,stdin) {
      // parameter bug
      // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
     if (error) {
       logger.info(error.stack);
       logger.info('Error code: '+error.code);
       logger.info('Signal received: '+error.signal);
     }
     if (stdout) {
        logger.info(stdout);
        player(stdout);
        cplayer.stdin.write('\nf');
     };
    });
  },
  getPlayerState : function(){
    return playerState;
  },
  setPlayerState : function(key,value){
    logger.info(playerState[key])
    logger.info('[NEW][value] ',value);
  },
  getList : function(){
     var queue = Kouch.findOne({});
     var pla = Playlist.find({'_id': { $in : queue.playlist } }).fetch(); 
     return pla
  },
  setState : function(state){
    kk = Kouch.findOne({})
    Kouch.update({'_id':kk._id},{ $set :{'state':state}});
  },
  parseWeb : function(playlistId) {

    if (playerState.play == true) {
      logger.info('[CALL][NEW][VIDEO] ',playlistId);
      if (playerState.queue) {
        logger.info('[In queue mode]');        
        skipVideo(playlistId,true);
      }else{
        playerState.play = false;
        skipVideo(playlistId,false);
      }
    }else{
      if (typeof playlistId !== "undefined") {
        var sourceUrl = Playlist.findOne({'_id':playlistId}).youtubeId;
        logger.info('[SOURCE]',sourceUrl);
        Meteor.call('setState','Parsing ...'+sourceUrl);

        cp.exec('youtube-dl -g -f 34/35/45/84/102 '+sourceUrl.toString(),function (error, stdout, stderr,stdin) {
          // parameter bug
          // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
          if (error) {
            if (error.code) {
              logger.info('[CODEX ERROR] ',error.code);
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
        logger.info(playlistId);
      };   
    }
  }
});

/*        if (error) {
          logger.info(error.stack);
          logger.info('Error code: '+error.code);
          logger.info('Signal received: '+error.signal);
        }*/  