Meteor.methods({
  getIP : function(){
    return playerState.ip
  },
  addToPlaylist : function(type,entry){
    if (type == 'youtube') {
      var pl = Playlist.insert({
        type:type,
        url:entry.url,
        youtubeId:entry.youtubeId,
        title:entry.title,
        thumbnail:entry.thumbnail,
        description:entry.description,
        duration:entry.duration,
        date:Date.now(),
        isPlaying:false
      });

      logger.info('[CALL][ADD][TO]QUEUE][INSERT][YOUTUBE] ',pl);
      Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
      return pl
    } else if (type == 'api'){
      var pl = Playlist.insert({type:type,
        url:entry,
        title:entry.title,
        date:Date.now(),
        isPlaying:false
      });
      logger.info('[CALL][ADD][TO]QUEUE][INSERT]['+type+']',pl);
      Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
      return pl      
    };
  },
  playIt : function(playlistId){
    if (typeof cplayer == "undefined") {
      // mplayer is not started
      logger.info('[URL]',playlistId)
      player(playlistId); 
      playerState.stop == false
    } else {

      logger.info(playlistId)
      logger.info(playerState) 

      if (playerState.skip == true) {
        playerState.skip = false
        playerState.queue = true
      }
      if (playerState.stop == true && typeof playlistId == "undefined" ) {
        logger.info('[CALL][PlAYER] next QUEUE');
        playerState.stop == false 
        NextQueue();
      }else{
        logger.info('playit')
        player(playlistId); 
      }
    
    }
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
    Kouch.update({'_id':kk._id},{ $set :{'playlist':kk.playlist}});
  },/*
  getPlaylist : function(){
    var pl = Playlist.find({}).fetch();   
    return pl
  },*/
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
     return Playlist.find({'_id': { $in : queue.playlist } }).fetch(); 
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

        cp.exec('youtube-dl -g -f 34/35/45/84/102/135/136 '+sourceUrl.toString(),function (error, stdout, stderr,stdin) {
          // parameter bug
          // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
          if (error) {
          logger.info(error.stack);
          logger.info('Error code: '+error.code);
          logger.info('Signal received: '+error.signal);
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
  },
  analyse : function(api,sourceUrl){
    if (api=='youtube') {
    logger.info(api)
      if (typeof sourceUrl !== undefined) {

        logger.info('[YouTube]',sourceUrl);
        Meteor.call('setState','add to playlist ...'+ sourceUrl.title);
        var parse = cp.spawn('youtube-dl',['-g','-f 34/35/45/84/102/141/135/136/',sourceUrl.url.toString()])
        //ge --get-thumbnail -f 34/35/45/84/102/135/136 '+sourceUrl.toString() 
        result = [] 

        parse.stdout.on('data', function (data) {
          result += data.toString()
        });
       
        parse.stderr.on('data', function (error) {
          logger.error('stderr: ' + error);

        });

        parse.on('close', function (code) {

          logger.info('result from YouTube ',result)

          Fiber(function(){
            var pl = Playlist.insert({type:api,
              url:result,
              originUrl:sourceUrl.url,
              youtubeId:sourceUrl.youtubeId,
              title:sourceUrl.title,
              thumbnail:sourceUrl.thumbnail,
              description:sourceUrl.description,
              duration:sourceUrl.duration,
              date:Date.now(),
              isPlaying:false
            });
            logger.info('[CALL][ADD][TO]QUEUE][INSERT][YouTube]',pl);
            Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}}); 
          }).run();
        });
      //end of typeof IF 
      }
    } else if (api == 'api') {
      if (typeof sourceUrl !== undefined) {
        logger.info('[API]',sourceUrl);
        Meteor.call('setState','get api call ...'+sourceUrl);
        var parse = cp.spawn('youtube-dl',['-ge','--get-thumbnail','-f 34/35/45/84/102/141/135/136',sourceUrl.toString()])
        //ge --get-thumbnail -f 34/35/45/84/102/135/136 '+sourceUrl.toString()
        result = [] 

        parse.stdout.on('data', function (data) {
          result += data.toString()
        });
       
        parse.stderr.on('data', function (error) {
          logger.error('stderr: ' + error);

        });

        parse.on('close', function (code) {
          result = result.split('\n')
          logger.info('[START INSERT]')
          holder = []
          for (i=0;i<result.length;i+=3){
            if (result[i].length > 0){
              var json = {title:result[i], url:result[i+1],originUrl:sourceUrl, thumbnail:result[i+2]}
              holder.push(json)
            }
          }
          
          logger.info(holder ,typeof holder, holder.length)
          
          Fiber(function(){
            for (i=0;i<holder.length;i++){
              pl = Playlist.insert(holder[i])
              logger.info('[CALL][ADD][TO]QUEUE][INSERT][API]',pl);
              Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}}); 
            }
          }).run();

          logger.info('child process exited with code ' + code);
        });
      };
    }

  }

  //end of Meteror.methods
});

/*        if (error) {
          logger.info(error.stack);
          logger.info('Error code: '+error.code);
          logger.info('Signal received: '+error.signal);
        }*/  