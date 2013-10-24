var cp = require('child_process'),
  playerState = {
    skip : false, 
    play : false,
    mute : false,
    queue : false,
    playerRun : false,
    stop : true,
    volume : 65
  },
	cplayer = cp.spawn('mplayer',['-idle','-slave','-fs']);

getData = function(cplayer){
  console.log('is playing')
  cplayer.stdout.on('data', callbackOnData);
};

callbackOnData = function(data){
  if (typeof data != "undefined") {
  	console.log('DATA defined');
  } else {
    console.log('DATA not defined ');
  }
  //playlistId
};

osd = function(message){
  cplayer.stdin.write('\nosd_show_text "'+ message +'" 10000 \n');
};

isStopped = function(data){
  if (typeof data != "undefined") {
    // TODOD regex 
    if (data.toString('utf-8').trim().split(':').length >= 2 && playerState.stop == false) {
      if (data.toString('utf-8').trim().split(':')[2] == ' pcm closed') {
        //console.log(data.toString('utf-8').trim().split(':'));        
        console.log('Stopped');
        playerState.stop = true;
        return true
      }
    }else{
      return false
    }
  }
  //end funtion
};

setNextVideo = function(playlistId){
  if (playerState.queue == true) {
    console.log('[PlAYER][QUEUE] Start next Video');
    cplayer.stdin.write('\nosd_show_text "Next video" 10000 \n');
    setState('Next Video');         
    NextQueue();  
  }else{
    cplayer.stdin.write('\nosd_show_text " O_O " 10000 \n');
  }
};

getError = function(cplayer){
  cplayer.on('error',function(data) {
    logger.error('[PLAYER] error',data);
  });
};

getData = function(cplayer){
  console.log('is playing')
  cplayer.stdout.on('data', callbackOnData);
};

getExit = function(cplayer){
  cplayer.on('exit',function(data) {
    playerState.play = false;
    console.log('[PLAYER] exit ',cplayer.pid);
  });
};

getClose = function(cplayer){
  cplayer.on('close',function(data) {
    console.log('[PLAYER] close ',cplayer.pid);
  });
};

console.log('MPLAYER SERVER STARTED ',cplayer.pid);
getData(cplayer)

function func(input) {
  process.send('Hello ' + input.hello);
}

process.on('message', function(m) {
  func(m);
});