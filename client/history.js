Template.history.meteorstatus = function () {
  return Meteor.status().connected;
};

Template.history.list = function () {
  return Playlist.find({},{ sort :{'date':-1}});
};

Template.history.events({
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


  }
});