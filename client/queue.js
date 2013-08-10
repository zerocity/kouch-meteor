var Playlist = new Meteor.Collection("playlist");

Template.queue.getPlaylist = function () {
  var pl = Playlist.find({},{sort:['date','asc']}).fetch()
  return pl
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