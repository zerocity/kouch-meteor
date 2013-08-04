if (Meteor.isClient){
  var Playlist = new Meteor.Collection("playlist");
  var Kouch = new Meteor.Collection("Kouch"); 
}

Template.remote.world = function () {
  return Session.get('q');
};

Template.remote.getPlaylist = function () {
/*    Meteor.call('getPlaylist', function(error,results) {
    console.log(results)
    return results
  });*/
  var pl = Playlist.find({},{sort:['date','asc']}).fetch()
  //console.log('[log]'+pl);
  return pl
};

Template.remote.events({
  'click #search' : function (data) {
      var query = $('#query').val();
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
  },
  'click .playStart' : function(data){
    //
    // ##### parseWeb
    // bug with this.youtubeID maybe is fixed
    Meteor.call('addToPlaylist',$('#query').val(),this);
    if (this.youtubeId) {
      Meteor.call('parseWeb',this.youtubeId);
    }else{
      console.log(this);
      Meteor.call('parseWeb',this.id);
    }
    console.log('[log][PLAY] ');
  },
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
  'click #kripp' : function(data){
    //
    // ##### START KRIPP STREAM 
    //
    Meteor.call('startStream');
    console.log('[log][PLAY STREAM]');
  },
  'click .fullscreen' : function(){
    Meteor.call('fullscreen');
  }
});