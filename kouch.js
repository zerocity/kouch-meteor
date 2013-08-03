if (Meteor.isClient) {
  
/*  Meteor.call('youtubeQuery',Session.get('query'), function(error, result){
    Session.set('q', result);
  });*/
  
  Template.hello.world = function () {
    return Session.get('q');
  };

  Template.hello.events({
    'click #search' : function (data) {
        var query = $('#query').val();
        console.log('### QUERY: '+query);
        check(query, String);
        var max_videos = 12;
        Meteor.http.call("GET", "http://gdata.youtube.com/feeds/api/videos",
          {params: {q: query,'max-results':max_videos,alt:'json'}}, function(error,result) {
            var simpleJson = JSON.parse(result.content).feed.entry ;
            var data = _.map(simpleJson, function (num,key){
              var a = num.id.$t.split("/"),
                id = a[6],
                title = num.title.$t,
                thumbnail = num.media$group.media$thumbnail[0].url,
                description = num.media$group.media$description.$t,
                totalSec = num.media$group.yt$duration.seconds,
                hours = parseInt( totalSec / 3600 ) % 24,
                minutes = parseInt( totalSec / 60 ) % 60,
                seconds = totalSec % 60,
                duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
                     
                return {
                  id:id,
                  title:title,
                  thumbnail:thumbnail,
                  description:description,
                  duration:duration};
                });
            Session.set("q",data);
            return true
          });
    },
    'click .play' : function(data){
      Meteor.call('parseWeb',this.id);
      console.log('### PLAY: '+ this.title);
    },
    'click .mute' :function(data){
      Meteor.call('mute');
      console.log('### mute: '+ this.title);
    }
  });
}

if (Meteor.isServer) {
  var cplayer;
  Meteor.startup(function () {
    var cp = Npm.require('child_process');

    var player = function(sourceUrl) {
      console.log('###Player');
      cplayer = cp.spawn('mplayer',['-slave','-cache','4096','-fs',sourceUrl.trim()]);
      //var player = cp.spawn('omxplayer',[sourceUrl.trim()]);16384
      console.log('### START PLAYER ###');
      cplayer.stdout.on('data', function (data) {
        // send commands
        //player.stdin.write('\nmute')
        });
      };


    Meteor.methods({
      youtubeQuery: function(query){
        //is not nessesary
      console.log('### '+query);
      check(query, String);
      this.unblock();
      var max_videos = 12;
      var result = Meteor.http.call("GET", "http://gdata.youtube.com/feeds/api/videos",
        {params: {q: query,'max-results':max_videos,alt:'json'}});
        if (result.statusCode === 200){
          var simpleJson = JSON.parse(result.content).feed.entry ;

          var data = _.map(simpleJson, function (num,key){
            var a = num.id.$t.split("/"),
              id = a[6],
              title = num.title.$t,
              thumbnail = num.media$group.media$thumbnail[0].url,
              description = num.media$group.media$description.$t,
              totalSec = num.media$group.yt$duration.seconds,
              hours = parseInt( totalSec / 3600 ) % 24,
              minutes = parseInt( totalSec / 60 ) % 60,
              seconds = totalSec % 60,
              duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
                   
              return {
                id:id,
                title:title,
                thumbnail:thumbnail,
                description:description,
                duration:duration};
              });

          return data

        }else{
          return false;
        }
      //parseWeb('http://www.youtube.com/watch?v=duezioB0mxc')
      //Meteor.call('parse','http://www.youtube.com/watch?v=duezioB0mxc');
      },
      mute : function(){
        console.log('Mute');
        cplayer.stdin.write('\nmute')
      },      
      parseWeb : function(sourceUrl) {
        console.log('###Parse');
        cp.exec('youtube-dl -g -f 34/35/45/84 '+sourceUrl.toString(),function (error, stdout, stderr,stdin) {
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
         };
       });
      }
    });
  });
}