Template.history.meteorstatus = function () {
  return Meteor.status().connected;
};

Template.history.list = function () {
  return Playlist.find({},{ sort :{'date':-1}});
};

Template.history.events({
  'click .playStart' : function(event){
    console.log('[H][play] '+ this._id);
    Meteor.call('playIt',this._id);
    console.log('[THIS] :',this);
  },
  'click .del' :function(event){
    console.log(this);
    Meteor.call('delPlaylistEntry',this._id);
  }
});