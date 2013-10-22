// skipping current played video 
// playlistId is the next played video , queue is a switch if its enabled or not 
skipVideo = function(playlistId,queue){
  //Fiber(function(){
    if (queue) {
      playerState.skip = true
      //playerState.queue = false
      logger.info('[SKIP][QUEUE] ',playlistId);
      //Meteor.call('playerStop'); .... async ... player cant be closed like this ...
      logger.info('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');
      cplayer.stdout.removeAllListeners('data');
      player(playlistId); 
      //Meteor.call('playIt',playlistId)
    }else{
      //Meteor.call('playerStop'); .... async ... player cant be closed like this ...
      logger.info('[SKIP] to ',playlistId);
      cplayer.stdin.write('\nstop\n');
      cplayer.stdout.removeAllListeners('data');
      player(playlistId); 
      //Meteor.call('playIt',playlistId)
    }
  //}).run();
}

// video finishes the next video in kk.playlist is played
NextQueue = function(){
  Fiber(function(){
    //todo add position list
    var kkId = Kouch.findOne();
    logger.info('[KKID][CURRENT POSITION] ',kkId.currentPosition, Date());

    var nextPlaylistId = kkId.playlist[kkId.playlist.indexOf(kkId.currentPosition) + 1];

    console.log(kkId.playlist);
    logger.info(kkId.playlist.indexOf(kkId.currentPosition) + 1);


    if (typeof nextPlaylistId != "undefined"){
      logger.info('[PID] ',cplayer.pid)
      logger.info('[NEXT]',nextPlaylistId);
      updateIsPlaying(nextPlaylistId)
      //cplayer.stdin.write('\nloadfile '+entry.url.trim()+'\n');
      Meteor.call('playIt',nextPlaylistId)
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