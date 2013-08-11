/*Meteor.publish("Queue", function () {

	  var queue = Kouch.find({}).fetch()[0]

	  if (queue.playlist == '') {
	  	return Playlist.find({}).fetch();
	  }else{
			return Playlist.find({
      	'_id': { $in : queue.playlist }
    	}).fetch();
	  }

});*/