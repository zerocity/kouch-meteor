Playlist = new Meteor.Collection("playlist");
Kouch = new Meteor.Collection("Kouch") ;

Meteor.startup(function() {
   Session.set('data_loaded', false); 
}); 


Deps.autorun(function () {
	Meteor.subscribe('kouch_settings', function(){
		Session.set('data_loaded', true);		
	});
	Meteor.subscribe('default_Playlist');
});