// Global in all files
Playlist = new Meteor.Collection("playlist");
Kouch = new Meteor.Collection("Kouch");

Meteor.publish('kouch_settings', function(){
    return Kouch.find({})
});

Meteor.publish('default_Playlist', function(){
    return Playlist.find({})
});