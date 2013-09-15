// skipping current played video 
skipVideo = function(playlistId,queue){
  Fiber(function(){
    if (queue) {
      playerState.skip = true
      playerState.queue = false
      logger.info('[SKIP][QUEUE] ',playlistId);
      //Meteor.call('playerStop'); .... async ... player cant be closed like this ...
      logger.info('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');

      Meteor.call('playIt',playlistId)
    }else{
      //Meteor.call('playerStop'); .... async ... player cant be closed like this ...
      logger.info('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');
      logger.info('[SKIP] ',playlistId);
      Meteor.call('playIt',playlistId)
    }
  }).run();
}

// video finishes the next video in kk.playlist is played
NextQueue = function(playlistId){
  Fiber(function(){
    //todo add position list
    var kkId = Kouch.findOne();
    logger.info('[KKID][OLD][POSITION] ',kkId.currentPosition, Date());

    if (kkId.currentPosition == playlistId) {
      var nextSourceUrl = kkId.playlist[kkId.playlist.indexOf(playlistId) + 1]; 
      logger.info(kkId.playlist);
      logger.info(kkId.playlist.indexOf(playlistId) + 1);
    } else {
      var nextSourceUrl = kkId.playlist[kkId.playlist.indexOf(kkId.currentPosition) + 1];
      logger.info(kkId.playlist);
      logger.info(kkId.playlist.indexOf(kkId.currentPosition) + 1);
    }

    //old stuff remove it later
/*    if (typeof playlistId != 'undefined') {
    }else{
      logger.info('[LOG]','no playlistid defined',Kouch.find({}).fetch()[0].currentPosition);
      var currentPosition = Kouch.find({}).fetch()[0].currentPosition
      if (currentPosition != ''){
        var next =  kkId.playlist[kkId.playlist.indexOf(currentPosition) + 1];
      }else{
        var next = undefined
      }
    }*/
    if (typeof next != undefined){
      logger.info('[PID] ',cplayer.pid)
      logger.info('[NEXT]',nextSourceUrl);
      updateIsPlaying(nextSourceUrl)
      //cplayer.stdin.write('\nloadfile '+entry.url.trim()+'\n');
      Meteor.call('playIt',nextSourceUrl)
    }else{
      playerState.queue = false;
      playerState.play = false;
      playerState.playerRun = false;
      logger.info('[PlAYER][QUEUE][MODE] OFF');        
    }    
  }).run();
}

// reset the flag for playing video
updateIsPlaying  =function(nextPlaylistId){
  Fiber(function(){
    var kkId = Kouch.findOne();
    //Set the last played video to false
    Playlist.update({'_id':kkId.currentPosition},{ $set :{'isPlaying':false}});
    //Set playersetting to the current position
    Kouch.update({'_id':kkId._id},{ $set :{'currentPosition':nextPlaylistId}});
    //Update the video to is playing
    Playlist.update({'_id':nextPlaylistId},{ $set :{'isPlaying':true}});
    logger.info('[UPDATE][ISPLAYING]');    
  }).run();
}


setState = function(state){
  Fiber(function(){
    kk = Kouch.findOne();
    Kouch.update({'_id':kk._id},{ $set :{'state':state}});  
    }).run();
}