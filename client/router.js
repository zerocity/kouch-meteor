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
