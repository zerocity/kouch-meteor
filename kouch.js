if (Meteor.isClient) {
  
  Meteor.call('youtubeQuery','test', function(error, result){
    Session.set('q', result);
  });
  
  Template.hello.world = function () {
    return Session.get('q');
  };

  Template.hello.events({
    'click input' : function () {
      if (typeof console !== 'undefined')
        console.log(this);
        Session.set("query",this);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cp = Npm.require('child_process');

    Meteor.methods({
      youtubeQuery: function(query){
      console.log('###Youtube\n');
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
      }
    });

      var player = function(sourceUrl) {
          console.log('###Player');
          var player = cp.spawn('mplayer',['-slave','-cache','4096','-fs',sourceUrl.trim()]);
          //var player = cp.spawn('omxplayer',[sourceUrl.trim()]);16384
          console.log('### START PLAYER ###');
          player.stdout.on('data', function (data) {
            // send commands
            //mplayer.stdin.write('\nmute')
          });
      };
    
      var parseWeb = function(sourceUrl) {
        console.log('###Parse');
        cp.exec('youtube-dl -g -f 34/35/45/84 '+sourceUrl,function (error, stdout, stderr,stdin) {
          // -f choise prefeard video format http://en.wikipedia.org/wiki/YouTube#Quality_and_codecs
         if (error) {
           console.log(error.stack);
           console.log('Error code: '+error.code);
           console.log('Signal received: '+error.signal);
         }
         if (stdout) {
            //console.log(stdout);
            player(stdout);
         };
       });
      };

  });
}