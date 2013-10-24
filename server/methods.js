getParseData = function(parse){
  parse.stdout.on('data', function (data) {
    result += data.toString()
  });
};

getParseDataError = function(parse){
  parse.stderr.on('data', function (error) {
    logger.error('stderr: ' + error);
  });
};  

getParseResults = function(parse,api,sourceUrl){
  // save parse results in the DB and close eventListens
  parse.on('close', function (code) {
    if (typeof api != "undefined") {
      if (typeof result != "undefined" ) {            
        
        if (api == 'youtube') {
          logger.info('[METHODS] result from YouTube ',result)
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
            logger.info('[METHODS][INSERT][YouTube]',pl);
            Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}}); 
          }).run();
        }

        if (api == 'api'){
          logger.info('[METHODS][START INSERT]')

          if (typeof result == "string") {
            result = result.split('\n')
            holder = []

            console.log('test');
            // if it is a playlist 
            for (i=0;i<result.length;i+=3){
              if (result[i].length > 0){
                var json = {title:result[i], url:result[i+1],originUrl:sourceUrl, thumbnail:result[i+2]}
                holder.push(json)
              }
            }

            //logger.info(holder ,typeof holder, holder.length)
            Fiber(function(){
              for (i=0;i<holder.length;i++){
                pl = Playlist.insert(holder[i])
                logger.info('[METHODS][INSERT][API]',pl);
                Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}}); 
              }
            }).run();

          } else {
            logger.info('[METHODS] result is not a string',result,typeof result)
          }

          logger.info('child process exited with code ' + code);
        }
      }
    }
  });
}

Meteor.methods({
  getPlayerState : function(){
    return playerState
  },
  getIP : function(){
    //
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

      logger.info('[METHODS][YOUTUBE] ',pl);
      Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
      return pl
    } else if (type == 'api'){
      var pl = Playlist.insert({type:type,
        url:entry,
        title:entry.title,
        date:Date.now(),
        isPlaying:false
      });
      logger.info('[METHODS][INSERT]['+type+']',pl);
      Kouch.update({'_id':kkId._id},{'$push':{ 'playlist':pl}});    
      return pl      
    };
  },
  playIt : function(playlistId){
    if (typeof cplayer == "undefined") {
      // mplayer is not started
      logger.info('[METHODS][PLAYIT][URL]',playlistId)
      player(playlistId); 
      playerState.stop == false
    } else {

      if (playerState.skip == true) {
        playerState.skip = false
        playerState.queue = true
      }

      if (playerState.stop == true && typeof playlistId == "undefined" ) {
        logger.info('[METHODS][PLAYIT] next QUEUE');
        playerState.stop == false 
        NextQueue();
      }else{
        logger.info('[METHODS] Start mplayer ')
        player(playlistId); 
      }
    
    }
  },
  queueMode : function(){
    if (playerState.queue == false) {
      playerState.queue = true;
      logger.info('[METHODS][QUEUE][MODE] ON');
    }else{
      playerState.queue = false
      logger.info('[METHODS][QUEUE][MODE] OFF');
    }
  },
  delPlaylistEntry : function(id){
    logger.info('[METHODS][DEL][ENTRY] ',id);
    check(id, String)
    var kk = Kouch.findOne({})
    var pos = kk.playlist.indexOf(id)
    kk.playlist.splice(pos,1)
    Kouch.update({'_id':kk._id},{ $set :{'playlist':kk.playlist}});
  },
  startStream : function(){
    logger.info('[METHODS]Start Stream: ');
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
  getList : function(){
    // return the playlist with only queue elements
    var queue = Kouch.findOne({});//have only the playlist ids not the full entry --> This cann be found under playlist collection .... bad name i now 
    if (typeof queue != "undefined") {
      if (typeof queue.playlist != 'undefined') {
        var pl =  Playlist.find({
         '_id': { $in : queue.playlist }
        }).fetch();
        return pl 
      }       
    }
  },
  setState : function(state){
    kk = Kouch.findOne({})
    Kouch.update({'_id':kk._id},{ $set :{'state':state}});
  },
/*  parseWeb : function(playlistId) {

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
  },*/
  analyse : function(api,sourceUrl){
    result = [] 
    var videoCodexs = '-f 34/35/43/45/84/102/141/135/136/'

    if (typeof sourceUrl !== undefined ) {
        logger.info('[METHODS] ',api,sourceUrl);

      if(api == 'youtube'){
        Meteor.call('setState','add to playlist ...'+ sourceUrl.title); // frontent notification
        var options = ['-g'];
        options.push(sourceUrl.url.toString().trim());
        var parse = cp.spawn('youtube-dl',[options[0],videoCodexs,options[1]]);
      }

      if(api == 'api'){
        Meteor.call('setState','add to playlist ...'+ sourceUrl); // frontent notification
        var options = ['-ge','--get-thumbnail'];
        options.push(sourceUrl.toString().trim());
        var parse = cp.spawn('youtube-dl',[options[0],options[1],videoCodexs,options[2]]);
      }
        getParseData(parse);
        getParseDataError(parse);
        getParseResults(parse,api,sourceUrl,result)
      }
  }
  //end of Meteror.methods
});