Meteor.Router.add('/api/url/:url*', 'GET', function(url) {
	console.log(url);
	Meteor.call('analyse','api',url)
	return [200, 'Success'];
});
