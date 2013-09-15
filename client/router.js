/*

Disabeld router <--- tooo slow

Router.configure({
  layout: 'layout',
  notFoundTemplate: 'notFound',
  loadingTemplate: 'loading',
  renderTemplates: { 
   	'header': { to : 'header'},
    'footer': { to: 'footer' },
  }
});

Router.map(function() { 

  this.route('home', { 
  	path:'/',
  	controller: 'QueueController',
	});
  
  this.route('delQueueItem', { 
  	path:'/queue/del/:id',
		controller: 'QueueController',
		action: 'del'
  });

  this.route('playQueueItem', { 
  	path:'/queue/play/:id',
		controller: 'QueueController',
		action: 'play'
  });

  this.route('search', { path:'/search'});
  this.route('remote', { path:'/remote'});
  this.route('history', { path:'/history'});
});

QueueController = RouteController.extend({
  template: 'queue',

  	waitOn: function () {
    return Meteor.subscribe('kouch_settings');
  	},

  	data: function() { 
  		var kk = Kouch.findOne({});
      var pl =  Playlist.find({
       '_id': { 
       	$in : kk.playlist 
       }
      }).fetch();
  		return {
  			getPlaylist:pl
  		}
  	},

  	del:function(){
      if (this.params.id) {
        console.log(this.params.id);
        Meteor.call('delPlaylistEntry',this.params.id);
        Router.go('home')
      } else{
        console.log(this.params);
  		  Router.go('home')
      };
      //console.log(this.params._id);
  	},

  	play:function(){
      if (this.params.id) {
        console.log(this.params.id);
        Meteor.call('playIt',this.params.id);
        Router.go('home')
      } else{
        console.log(this.params);
        Router.go('home')
      };
  	},
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound'
});*/

Router.configure({
  layout: 'layout'
});

Router.map(function() { 
  this.route('queue', { path:'/'});
  this.route('queue', { path:'/queue'});
  this.route('search', { path:'/search'});
  this.route('remote', { path:'/remote'});
  this.route('history', { path:'/history'});
});