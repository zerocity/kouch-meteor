if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to kouch.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        Meteor.call('youtubeQuery');
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var cp = Npm.require('child_process');

    Meteor.Router.add('/bookmarklet/:web', 'GET', function(web) {
      //db things
      console.log('test');
      // Checks Play mode

      console.log(web);

    });

    Meteor.Router.add('/404', [404, "There's nothing here!"]);

    Meteor.Router.add('/bookmarklet/', 'GET', function() {
      return [204, 'LALALALLA No Content'];
    });


    Meteor.methods({
      youtubeQuery: function(){
          console.log('###Youtube');
          parseWeb('http://www.youtube.com/watch?v=duezioB0mxc')
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