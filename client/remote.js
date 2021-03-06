Deps.autorun(function () {
  Meteor.setInterval(function() {
    // the data source isn't reactive therfore a new call is set all 1 sec 
    Meteor.call('getPlayerState',function(error,result){
        Session.set('getState',result) 
    });
  }, 1000);
});

Template.remote.playerState = function() {
  return Session.get('getState')
}

Template.remote.currentVideo = function() {
  Session.set('currentVideo',Playlist.findOne({'isPlaying' :true}))
  return Session.get('currentVideo')
}

Template.remote.events({
  'click .toggle-sound' : function(event){
    console.log('test');
    $('.volslider').toggleClass('hide');
  },
  'click .toggle-controller' : function(event){
    $('.controller').toggleClass('hide');
  },
  'click .backward':function(event){
    Meteor.call('backward');
  },
  'click .forward':function(event){
    Meteor.call('forward');
  },
  'click .queueMode':function(event){
    Meteor.call('queueMode');
  },
  'click .mute' :function(event){
    //
    // ##### playerMute
    //
    Meteor.call('playerMute');
    console.log('[log][MUTE] ');
  },
  'click .pause' :function(event){
    //
    // ##### playerPause
    //
    Meteor.call('playerPause');
    console.log('[log][PAUSE] ');
  },
  'click .playThis' : function(event){
    //
    // ##### playerStart
    //
    Meteor.call('playIt',Session.get('currentVideo')._id);
  },
  'click .stop' :function(event){
    //
    // ##### playerStop
    //
    Meteor.call('playerStop');
    console.log('[log][STOP] ');
  },
  'click .vol-down' :function(event){
    //
    // ##### playerStop
    //
    Meteor.call('volDown');
    console.log('[log][vol-down] ');
  },
  'click .vol-up' :function(event){
    //
    // ##### playerStop
    //
    Meteor.call('volUp');
    console.log('[log][vol-up] ');
  },
  'click .left' :function(event){
    //
    // ##### playerStop
    //
    Meteor.call('playerLeft');
    console.log('[log][Left] ');
  },
  'click .right' :function(event){
    //
    // ##### playerStop
    //
    Meteor.call('playerRight');
    console.log('[log][Seek] ');
  },
  'click #kripp' : function(event){
    //
    // ##### START KRIPP STREAM 
    //
    Meteor.call('startStream');
    console.log('[log][PLAY STREAM]');
  },
  'click .fullscreen' : function(){
    Meteor.call('fullscreen');
  },
  'click .progress' : function(event){
    check(event.toElement.valueAsNumber,Number)
    Meteor.call('volume',event.toElement.valueAsNumber)
  },
  'change .progress':function(){
    var mchange = $('.progress').val();
    Meteor.call('volumeSlider',mchange);
  }
});