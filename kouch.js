if (Meteor.isClient) {
  Template.hello.playlist = function () {
    Meteor.call('youtubeQuery',Session.get('query'), function(error, result){
      return result
    });
  };

  Template.hello.events({
    'click input' : function () {
      if (typeof console !== 'undefined')
        console.log('test');
        Session.set("query",this);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cp = Npm.require('child_process');

    Meteor.methods({
      youtubeQuery: function(query){
      console.log('###Youtube');
      check(query, String);
      this.unblock();
      var max_videos = 12;
      var result = Meteor.http.call("GET", "http://gdata.youtube.com/feeds/api/videos",
        {params: {q: query,'max-results':max_videos,alt:'json'}});
        if (result.statusCode === 200)
           return JSON.parse(result.content);
        return false;
      
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