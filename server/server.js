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
    playerRun : false,
    stop : true
  }
  Fiber = Npm.require("fibers");

  var fs = Npm.require('fs');
  var path = Npm.require('path');
  var base = path.resolve('../../../../../');

  console.log(base);

  winston = Winston;

  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console) (),
      new (winston.transports.File) ({filename: base+'/logger.log' })
    ]
  });

/*  logo = base +'/logo.jpg';
  console.log(logo);

  var startscreen = function(logo){
    //mplayer logo.jpg -slave -idle "mf://*.jpg" -fs -loop 0 -fixed-vo -cache 4096
    cplayer = cp.exec('mplayer '+ logo +' -slave -idle "mf://*.jpg" -fs -loop 0 -fixed-vo -cache 4096 ',function (error, stdout, stderr) {
    }); 
   
    cplayer.stdout.on('data', function (data) {
      console.log(data);
        //console.log('[CALL][MPlayer]\n' +data);
        //send commands //player.stdin.write('\nmute\n')
    });

    cplayer.stderr.on('data', function (data) {
      console.log(data);
        //console.log('[CALL][MPlayer]\n' +data);
        //send commands //player.stdin.write('\nmute\n')
    });
  }

  startscreen(logo);*/


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