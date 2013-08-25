Template.queue.settings = function () {
  return Kouch.findOne({})
};

Template.queue.meteorstatus = function () {
  return Meteor.status().connected;
};

Template.queue.getPlaylist = function () {
  if (Session.get('data_loaded')) {
    var kk = Kouch.findOne({});   

    if (typeof kk.playlist != 'undefined') {
      var pl =  Playlist.find({
       '_id': { $in : kk.playlist }
      }).fetch();
      return pl 
    }
      
  };
};

Template.queue.events({
  'click .playStart' : function(event){
    //
    // ##### parseWeb
    //
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