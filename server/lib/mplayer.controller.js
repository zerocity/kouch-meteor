// skipping current played video 
skipVideo = function(playlistId,queue){
  Fiber(function(){
    if (queue) {
      playerState.skip = true
      playerState.queue = false
      console.log('[SKIP][QUEUE] ',playlistId);
      Meteor.call('playerStop');
      Meteor.call('parseWeb',playlistId)
    }else{
      console.log('[SKIP] ',playlistId);
      Meteor.call('playerStop');
      Meteor.call('parseWeb',playlistId)
    }
  }).run();
}

// video finishes the next video in kk.playlist is played
NextQueue = function(playlistId){
  Fiber(function(){
    //todo add position list
    var kkId = Kouch.find({}).fetch()[0];
    console.log('[KKID][OLD][POSITION] ',kkId.currentPosition, Date());
    
    if (typeof playlistId != 'undefined') {
      var next = kkId.playlist[kkId.playlist.indexOf(playlistId) + 1]; 
    }else{
      console.log('[LOG]','no playlistid defined',Kouch.find({}).fetch()[0].currentPosition);
      var currentPosition = Kouch.find({}).fetch()[0].currentPosition
      if (currentPosition != ''){
        var next =  kkId.playlist[kkId.playlist.indexOf(currentPosition) + 1];
      }else{
        var next = undefined
      }
    }
    if (typeof next != undefined){
      console.log('[NEXT]',next);
      updateIsPlaying(next)
      Meteor.call('parseWeb',next)
    }else{
      playerState.queue = false;
      playerState.play = false;
      playerState.playerRun = false;
      console.log('[PlAYER][QUEUE][MODE] OFF');        
    }    
  }).run();
}

// reset the flag for playing video
updateIsPlaying  =function(nextPlaylistId){
  Fiber(function(){
    var kkId = Kouch.find({}).fetch()[0];
    Playlist.update({'_id':kkId.currentPosition},{ $set :{'isPlaying':false}});
    Kouch.update({'_id':kkId._id},{ $set :{'currentPosition':nextPlaylistId}});
    Playlist.update({'_id':nextPlaylistId},{ $set :{'isPlaying':true}});
    console.log('[UPDATE][ISPLAYING]');    
  }).run();
}