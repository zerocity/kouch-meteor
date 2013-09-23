Meteor.startup(function () {
  //global
  log = true;
  cp = Npm.require('child_process');
  //os = Npm.require('os');
  Fiber = Npm.require("fibers");

  var fs = Npm.require('fs');
  var path = Npm.require('path');
  var base = path.resolve('../../../../../');
  cplayer = undefined;
  playerState = {
    skip : false, 
    play : false,
    mute : false,
    queue : false,
    playerRun : false,
    stop : true,
  }
  console.log(base);
  winston = Winston;
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console) (),
      new (winston.transports.File) ({filename: base+'/logger.log' })
    ]
  });

playerState.ip = '10.20.30.51'//os.networkInterfaces()['wlan0'][0]['address'];

/*cplayer = cp.spawn('mplayer',['-slave','-idle','-fs','-cache-min','50']);

cplayer.stderr.on('data', function (data) {
  console.error(data.toString('utf-8'));
});

logger.info(cplayer.pid);
var urr = "http://r5---sn-cxg7en7k.c.youtube.com/videoplayback?itag=37&gcr=at&id=e4d57a45dbf56b72&mv=m&fexp=924606%2C929117%2C929121%2C929906%2C929907%2C929922%2C929923%2C929127%2C929129%2C929131%2C929930%2C936403%2C925724%2C925726%2C936310%2C925720%2C925722%2C925718%2C925714%2C929917%2C906945%2C929933%2C929935%2C939604%2C906842%2C913428%2C912715%2C919811%2C932309%2C913563%2C919373%2C930803%2C908536%2C938701%2C931924%2C934005%2C940501%2C936308%2C909549%2C901608%2C900816%2C912711%2C934507%2C907231%2C936312%2C906001&sver=3&cp=U0hWTlhLTl9JS0NONl9QRVJBOmtNRXlpTmtyamtW&expire=1379800041&key=yt1&ip=2001%3A858%3A5%3A3a23%3A8603%3Aa5bd%3A5fca%3A80db&upn=_7L1I49j3jM&mt=1379776299&ms=au&sparams=cp%2Cgcr%2Cid%2Cip%2Cipbits%2Citag%2Cratebypass%2Csource%2Cupn%2Cexpire&source=youtube&ratebypass=yes&ipbits=48&signature=B846747CE9D44D9043A420392E18F12960F2138C.3A363456A2B41BB36F546310421F7FE6B19BDAB8"
cplayer.stdin.write('\nloadfile '+urr.trim()+'\n');

*/
//var test = cplayer.stdout.removeListener('data', callback);

//logger.info(test)

/*isStopped = function(playlistId){
      
  cplayer.stdout.on('data', function (data) {
    logger.info(data)
  });
//end funtion
}
*/




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