Meteor.startup(function () {
  var Fiber = Npm.require("fibers")
    , cp = Npm.require('child_process')
    , cplayer
    , playerState = {
        play : false,
        mute : false,
        queue : false,
        playerRun : false
      }
    , Kouch = new Meteor.Collection("Kouch") 
    , Playlist = new Meteor.Collection("playlist");


  if (Kouch.find().count() === 0) {
    var jsonQueue = {
      currentPosition :''
    }
    
    Kouch.insert(jsonQueue);
    console.log('[CREATE] kk');
    var kkId = Kouch.findOne({});
  }else{
    var kkId = Kouch.findOne({});
    //console.log('[QUEUE][CURRENT]\n',kkId.playlist);
  }

  var NextQueue = function(playlistId){
    Fiber(function(){
      //todo add position list
      var kkId = Kouch.find({}).fetch()[0];
      console.log('[KKID][OLD][POSITION] ',kkId.currentPosition, Date());
      
      if (typeof playlistId != 'undefined') {

        var next = kkId.playlist[kkId.playlist.indexOf(playlistId) + 1]; 

      }else{

        console.log('[LOG]','no playlistid defined',Kouch.find({}).fetch()[0].currentPosition);
/*      console.log(Kouch.find({}).fetch()[0].currentPosition);
        console.log(kkId);
        console.log(kkId.currentPosition);*/
        var currentPosition = Kouch.find({}).fetch()[0].currentPosition
        if (currentPosition != ''){
          var next =  kkId.playlist[kkId.playlist.indexOf(currentPosition) + 1];
        }else{
          var next = undefined
        }
      }
      if (typeof next != undefined){
        console.log('[NEXT]',next);
        Playlist.update({'_id':kkId.currentPosition},{ $set :{'isPlaying':false}});
        Kouch.update({'_id':kkId._id},{ $set :{'currentPosition':next}});
        Playlist.update({'_id':next},{ $set :{'isPlaying':true}});

        //console.log(Kouch.find({}).fetch()[0]);
        Meteor.call('parseWeb',next)
      }else{
        playerState.queue = false;
        playerState.play = false;
        playerState.playerRun = false;
        console.log('[PlAYER][QUEUE][MODE] OFF');        
      }    
    }).run();
  }
  // Debuf mode for QUEUE

  //Kouch.update(kkId,{'$set':{currentPosition:'paNRbxEgyCNoxFWRa'}});
/*  playerState.queue = true;
  NextQueue();*/

  var getKouch = function(){
    Fiber(function(){
      var kkId = Kouch.find().fetch()[0]
      console.log('[FIND][Kouch] ',kkId);
    }).run();
  }

  var player = function(sourceUrl,playlistId) {

    if (playerState.play == false) {

      cplayer = cp.spawn('mplayer',['-slave','-cache','4096','-fs',sourceUrl.trim()]);
      
      console.log('[CALL][Player] ');//,sourceUrl);
      playerState.play = true;

      cplayer.stdout.on('data', function (data) {
        console.log('[CALL][MPlayer]\n' +data);
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

  Meteor.methods({
    addToQueue : function(searchQuery,entry){
      console.log('\n[CALL][ADD][TO]QUEUE][INSERT] ',searchQuery);
      var pl = Playlist.insert({searchQuery:searchQuery,
        youtubeId:entry.youtubeId,
        title:entry.title,
        thumbnail:entry.thumbnail,
        description:entry.description,
        duration:entry.duration,
        date:Date.now(),
        isPlaying:false
      });

      Kouch.update(kkId,{'$push':{ 'playlist':pl}}); 

      return pl

    },
    queueMode : function(){
      if (playerState.queue == false) {
        playerState.queue = true;
        console.log('[PlAYER][QUEUE][MODE] ON');
      }else{
        playerState.queue = false
        console.log('[PlAYER][QUEUE][MODE] OFF');
      }
    },
    playerMute : function(){
      if (playerState.mute == false) {
        playerState.mute = true
        cplayer.stdin.write('\nmute 1\n');
        console.log('[CALL][PlAYER] Mute ON');
      }else{
        cplayer.stdin.write('\nmute 0\n');
        console.log('[CALL][PlAYER] Mute OFF');
        playerState.mute = false
      }
    },
    playerPause : function(){
      if (playerState.play == true) {
        console.log('[CALL][PlAYER] Pause');
        cplayer.stdin.write('\npause\n');
      }else{
        if (playerState.playerRun == false) {
          NextQueue();
        }else{
          console.log('[CALL][PlAYER] Play');
          cplayer.stdin.write('\npause\n');
        }
      }
    },
    playerStop : function(){
      console.log('[CALL][PlAYER] Stop');
      cplayer.stdin.write('\nstop\n');
    },
    'volume' : function(slider){
        console.log('[CALL][PlAYER] Vol set to:',slider);
        cplayer.stdin.write('\nvolume '+slider +' 1\n');
        console.log(playerState);
      //cplayer.stdin.write('\nvolume 10\n');      
    },
    volDown : function(){
      console.log('[CALL][PlAYER] Vol Down');
      cplayer.stdin.write('\nvolume -10\n');
    },    
    volUp : function(){
      console.log('[CALL][PlAYER] Vol Up');
      cplayer.stdin.write('\nvolume 10\n');
    },
    playerLeft : function(){
      console.log('[CALL][PlAYER] Seek -15 sec');
      cplayer.stdin.write('\nseek -15 0\n');
    },    
    playerRight : function(){
      console.log('[CALL][PlAYER] Seek + 15');
      cplayer.stdin.write('\nseek 15 0\n');
    },   
    playerFullscreen : function(){
      console.log('[CALL] Fullscreen');
      cplayer.stdin.write('\nf\n');
    },
    getQueue : function(){
      console.log('[CALL][QUEUE] Next');
      getQueue();
      //return Queue.find({}).fetch()
    },
    delPlaylistEntry : function(id){
      console.log('[DEL][ENTRY] ',id);
      console.log(typeof id);
      check(id, String)
      Playlist.remove({_id:id});
    },
    addToPlaylist : function(searchQuery,data){
      //TODO do check if the video is allready in the playlist + 1 score
      console.log('[CALL][ADDTOPLAYLIST][INSERT] '+searchQuery);

      var pl = Playlist.find({}).fetch()
      console.log(pl[pl.length-1]);
      console.log(data);

      return Playlist.insert({searchQuery:searchQuery,
        youtubeId:data.youtubeId,
        title:data.title,
        thumbnail:data.thumbnail,
        description:data.description,
        duration:data.duration,
        date:Date.now()
      });
    },
    getPlaylist : function(){
      var pl = Playlist.find({}).fetch();   
      return pl
    },
    startStream : function(){
      console.log('[CALL]Start Stream: ');
      cp.exec('livestreamer twitch.tv/nl_kripp 480p --player mplayer',function (error, stdout, stderr,stdin) {
        // parameter bug
        // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
       if (error) {
         console.log(error.stack);
         console.log('Error code: '+error.code);
         console.log('Signal received: '+error.signal);
       }
       if (stdout) {
          console.log(stdout);
          player(stdout);
          cplayer.stdin.write('\nf');
       };
     });
    },
    volumeSlider : function(slider) {
      console.log('[CALL] ',slider);
      cplayer.stdin.write('\nvolume '+slider +' 1\n');
    }, 
    getPlayerState : function(){
      return playerState;
    },
    setPlayerState : function(key,value){
      console.log(playerState[key])
      console.log('[NEW][value] ',value);
    },
    getList : function(){
       var queue = Kouch.findOne({});
       var pla = Playlist.find({'_id': { $in : queue.playlist } }).fetch(); 
       return pla
    },
    parseWeb : function(playlistId) {
      if (playerState.playerRun == true) {
        console.log('[CALL][NEW][VIDEO] ',playlistId);
        playerState.playerRun = false
        cplayer.stdin.write('\nstop\n');
        Meteor.call('parseWeb',playlistId);
/*      playerState.queue = true    
        console.log('[CALL][INSERT][QUEUE] '+sourceUrl);
        Playlist.insert({sourceUrl:sourceUrl}); */
      }else{
        if (typeof playlistId !== "undefined") {
          console.log('[CALL][Parse]' + playlistId);
          var sourceUrl = Playlist.findOne({'_id':playlistId}).youtubeId
          console.log('[SOURCE]',sourceUrl);
          cp.exec('youtube-dl -g -f 34/35/45/84/102 '+sourceUrl.toString(),function (error, stdout, stderr,stdin) {
            // parameter bug
            // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
            if (error) {
              if (error.code) {
                console.log('[CODEX ERROR] ',error.code);
                NextQueue(playlistId);
              }
            }else{
              if (stdout) {
                player(stdout,playlistId);
              }            
            }
  /*        if (error) {
            console.log(error.stack);
            console.log('Error code: '+error.code);
            console.log('Signal received: '+error.signal);
          }*/      
         });
        }else{ 
          console.log(playlistId);

        };   
      }
    }
  });
});