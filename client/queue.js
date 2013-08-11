var Playlist = new Meteor.Collection("playlist");
var Kouch = new Meteor.Collection("Kouch") ;

Template.queue.getPlaylist = function () {
//  var queue = Kouch.find({}).fetch()[0].playlist


  /*if (typeof queue.playlist != undefined) {
    var pla = Playlist.find({
      '_id': { $in : queue.playlist }
    }).fetch();
    return pla
  }else{
    //bug somethimes Playlist cant be loaded ...
  }*/
    return Playlist.find({}).fetch();

  //var pl = Playlist.find({'_id':queue[0]}).fetch()

};

Template.queue.events({
  'click .playStart' : function(event){
    //
    // ##### parseWeb
    //

    console.log('Event',event);
    console.log('This',this);

    if (this.youtubeId) {
      console.log('[Q][play] '+ this._id);
      Meteor.call('parseWeb',this._id);
    }else{
      console.log('[ERROR] :',this);
      console.log('[ERROR] :',event);
    }


  },
  'click .del' :function(event){
      console.log(this);
      Meteor.call('delPlaylistEntry',this._id);
  }
});