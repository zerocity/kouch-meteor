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

});