Template.search.searchQueryResults = function () {
  return Session.get('q');
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
  'click .addToPlaylist' : function(data){
    //
    // ##### parseWeb
    //
    var query = $('#query').val();
    console.log('[QUERY] ',query);

    Meteor.call('addToPlaylist',query,this,function(err,res){
      console.log('[ADD][TO][QUEUE] ',res);
    });
  },
  'click .play' : function(data){
    var query = $('#query').val();
    console.log('[QUERY] ',query);

    var video = Meteor.call('addToPlaylist',query,this,function(err,res){
      console.log('[ADD][TO][QUEUE] and play ',res);
      Meteor.call('parseWeb',res);
    });
  }
});
/*    Meteor.call('addToPlaylist',query,this,function (error,playlist) {
      if (data.toElement.dataset.id) {
        console.log('[log][Playlist] '+ data.toElement.dataset.id,' [DB][RESULTS] ',playlist);
        Meteor.call('parseWeb',data.toElement.dataset.id,playlist._id);
      }else{
        console.error('[log][addToPlaylist] no dataset set',playlist);
        //Meteor.call('parseWeb',data.toElement.dataset.id,results);
      }
    });*/
