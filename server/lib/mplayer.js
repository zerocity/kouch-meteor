player = function(sourceUrl,playlistId) {
  updateIsPlaying(playlistId);
  if (playerState.play == false) {
    cplayer = cp.spawn('mplayer',['-slave','-cache','4096','-fs',sourceUrl.trim()]);     //-fs
    console.log('[CALL][Player] ');//,sourceUrl);
    playerState.play = true;

    cplayer.stdout.on('data', function (data) {
      //console.log('[CALL][MPlayer]\n' +data);
      //send commands //player.stdin.write('\nmute\n')
    });

    cplayer.on('close',function(data) {
      playerState.play = false;
      if (playerState.queue == true) {
        console.log('[PlAYER][QUEUE] Start next Video');
        NextQueue(playlistId);            
      }else{
        playerState.queue = false;
        playerState.play = false;
        console.log('[PlAYER][QUEUE][MODE] OFF');
        console.log('[Player] close');
      }
    });
  }
}