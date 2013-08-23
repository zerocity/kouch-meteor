Meteor.startup(function () {
  //global
  log = true;
  cp = Npm.require('child_process');
  cplayer = undefined;
  playerState = {
      skip : false, 
      play : false,
      mute : false,
      queue : false,
      playerRun : false
  }
  Fiber = Npm.require("fibers");

  // Debuf mode for QUEUE

  //Kouch.update(kkId,{'$set':{currentPosition:'paNRbxEgyCNoxFWRa'}});
/*  playerState.queue = true;
  NextQueue();*/

/*  var getKouch = function(){
    Fiber(function(){
      var kkId = Kouch.find().fetch()[0]
      console.log('[FIND][Kouch] ',kkId);
    }).run();
  }*/

});