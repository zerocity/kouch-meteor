Meteor.startup(function () {
  //global
  log = true;
  cp = Npm.require('child_process');
  //os = Npm.require('os');
  Fiber = Npm.require("fibers");
  var os=Npm.require('os');
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
    volume : 65
  }
  console.log(base);
  winston = Winston;
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console) (),
      new (winston.transports.File) ({filename: base+'/logger.log' })
    ]
  });



var ifaces=os.networkInterfaces();
for (var dev in ifaces) {
  var alias=0;
  ifaces[dev].forEach(function(details){
    if (details.family=='IPv4') {
      console.log(dev+(alias?':'+alias:''),details.address);
      if (dev == 'eth0' || dev == 'wlan0'){
        playerState.ip = details.address+':3000';
        console.log('kouch on: ',details.address);
      }
      ++alias;
    }
  });
}

//playerState.ip = '10.20.30.51'//os.networkInterfaces()['wlan0'][0]['address'];

});