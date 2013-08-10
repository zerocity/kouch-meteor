if (Meteor.isClient){
  var Playlist = new Meteor.Collection("playlist");
  var Kouch = new Meteor.Collection("Kouch"); 
  
  Meteor.pages({

    // Page values can be an object of options, a function or a template name string

    '/': { to: 'queue', as: 'root', nav: 'queue' },
    '/queue': { to: 'queue', as: 'root', nav: 'queue' },
    '/search': { to: 'search', nav: 'search' },
    '/remote': { to: 'remote', nav: 'remote' },
    '/playlist': { to: 'playlist', nav: 'playlist' },
    '*': 'notFound'
  }, {
    // optional options to pass to the PageRouter
    defaults: {
      layout: 'layout'
    }
  });



  Template.search.searchQueryResults = function () {
    return Session.get('q');
  };

  Template.queue.getPlaylist = function () {
    var pl = Playlist.find({},{sort:['date','asc']}).fetch()
    return pl
  };

  Template.search.events({
    'keyup, click #search' : function (data) {
        var query = $('#query').val();
        if (query.length >= 4) {
          console.log('[log][QUERY] '+query);
          check(query, String);
          var max_videos = 12;
          Meteor.http.call("GET", "http://gdata.youtube.com/feeds/api/videos",
            {params: {q: query,'max-results':max_videos,alt:'json'}}, function(error,result) {
              var simpleJson = JSON.parse(result.content).feed.entry ;
              var data = _.map(simpleJson, function (num,key){
                var a = num.id.$t.split("/"),
                  id = a[6],
                  title = num.title.$t,
                  thumbnail = num.media$group.media$thumbnail[1].url,
                  description = num.media$group.media$description.$t,
                  totalSec = num.media$group.yt$duration.seconds,
                  hours = parseInt( totalSec / 3600 ) % 24,
                  minutes = parseInt( totalSec / 60 ) % 60,
                  seconds = totalSec % 60,
                  duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
                       
                  return {
                    youtubeId:id,
                    title:title,
                    thumbnail:thumbnail,
                    description:description,
                    duration:duration};
                  });
              Session.set("q",data);
              return true
            });
        }      
      },  
      'click .playStart' : function(data){
      //
      // ##### parseWeb
      //
      var query = $('#query').val();

      console.log('[QUERY] ',query);

      Meteor.call('addToPlaylist',query,this,function (error,playlist) {
        if (data.toElement.dataset.id) {
          console.log('[log][Playlist] '+ data.toElement.dataset.id,' [DB][RESULTS] ',playlist);
          Meteor.call('parseWeb',data.toElement.dataset.id,playlist._id);
        }else{
          console.error('[log][addToPlaylist] no dataset set',playlist);
          //Meteor.call('parseWeb',data.toElement.dataset.id,results);
        }
      });
    },
  });


  Template.queue.events({
    'click .playStart' : function(data){
      //
      // ##### parseWeb
      //

        if (data.toElement.dataset.id) {
          console.log('[Q][play] '+ data.toElement.dataset.id);
          Meteor.call('parseWeb',data.toElement.dataset.id);
        }else{
          console.error('[log][addToPlaylist] no dataset set',playlist);
        }
  
    },
    'click .del' :function(data){
        console.log(this);
        Meteor.call('delPlaylistEntry',this._id);
    }
  });

  
  Template.remote.events({
    'click .mute' :function(data){
      //
      // ##### playerMute
      //
      Meteor.call('playerMute');
      console.log('[log][MUTE] ');
    },
    'click .pause' :function(data){
      //
      // ##### playerPause
      //
      Meteor.call('playerPause');
      console.log('[log][PAUSE] ');
    },
    'click .pause' :function(data){
      //
      // ##### playerStart
      //
      Meteor.call('playerPause');
      console.log('[log][START] ');
    },
    'click .stop' :function(data){
      //
      // ##### playerStop
      //
      Meteor.call('playerStop');
      console.log('[log][STOP] ');
    },
    'click .vol-down' :function(data){
      //
      // ##### playerStop
      //
      Meteor.call('volDown');
      console.log('[log][vol-down] ');
    },
    'click .vol-up' :function(data){
      //
      // ##### playerStop
      //
      Meteor.call('volUp');
      console.log('[log][vol-up] ');
    },
    'click .left' :function(data){
      //
      // ##### playerStop
      //
      Meteor.call('playerLeft');
      console.log('[log][Left] ');
    },
    'click .right' :function(data){
      //
      // ##### playerStop
      //
      Meteor.call('playerRight');
      console.log('[log][Seek] ');
    },
    'click #kripp' : function(data){
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
      console.log(event.toElement.valueAsNumber);
      check(event.toElement.valueAsNumber,Number)
      Meteor.call('volume',event.toElement.valueAsNumber)
    },
    'change .progress':function(){
      var mchange = $('.progress').val();
      console.log(mchange);
      Meteor.call('eventTest',mchange);
    }
  });
};