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