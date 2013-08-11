/*Deps.autorun(function () {
  Meteor.subscribe("queue"));
});
*/

Template.queue.meteorstatus = function () {
  return Meteor.status().connected;
};

Template.queue.getPlaylist = function () {
  if (Meteor.status().status == 'connecting') {
    return 'Loading ...'
  }else{
    var queue = Kouch.find({}).fetch()[0]
    if (typeof queue != 'undefined' ) {   
      var pl =  Playlist.find({
       '_id': { $in : queue.playlist }
      }).fetch();
      return pl 
    };
  };
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