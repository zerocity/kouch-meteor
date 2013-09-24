Deps.autorun(function () {
 var queue = Kouch.findOne({});
  if (typeof queue != "undefined") {
    if (typeof queue.playlist != 'undefined') {
      var pl =  Playlist.find({
       '_id': { $in : queue.playlist }
      }).fetch();
      Session.set('getList',pl);
    }       
  }
});
/*
  Meteor.call('getList',function (error,results){
    if (error)
      console.log(error);
      Session.set('getList',results)
  });
});*/

Template.queue.settings = function () {
  if (Session.get('data_loaded')) {
    return Kouch.findOne({})
  };
};

Template.queue.meteorstatus = function () {
  return Meteor.status().connected;
};

Template.queue.getPlaylist = function () {
  return Session.get('getList')
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