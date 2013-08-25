Meteor.pages({
  '/': { to: 'queue', as: 'root', nav: 'queue' },
  '/queue': { to: 'queue', as: 'root', nav: 'queue' },
  '/search': { to: 'search', nav: 'search' },
  '/remote': { to: 'remote', nav: 'remote' },
  '/history': { to: 'history', nav: 'history' }
}, {
  // optional options to pass to the PageRouter
  defaults: {
    layout: 'layout'
  }
});

/*router.configure({
  layout: 'layout'
});

Meteor.map({
  this.route('queue', { path:'/'});
  this.route('queue', { path:'/queue'});
  this.route('search', { path:'/search'});
  this.route('remote', { path:'/remote'});
  this.route('history', { path:'/history'});
});*/