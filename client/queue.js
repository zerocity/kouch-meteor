Template.queue.settings = function () {
  if (Session.get('data_loaded')) {
    return Kouch.findOne({})
  };
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

Template.queue.playerState = function() {
  var kk = Kouch.findOne({});   
  console.log(kk);
  return kk
}

Template.queue.events({
  'click .playStart' : function(event){
    console.log('[Q][play] '+ this._id);
    Meteor.call('playIt',this._id);
    console.log('[THIS] :',this);
  },
  'click .del' :function(event){
    console.log(this);
    Meteor.call('delPlaylistEntry',this._id);
  }
});