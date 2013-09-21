// shared lib for client and server side
//
// meteor specials --> no var --> GLOBAL
// not used at the moment

getGlobalSettings = function(){
	return Kouch.findOne({});   
}

getPlaylist = function (kk) {

	var queue =	getGlobalSettings().playlist

	return	Playlist.find({
   '_id': { $in : queue }
  }).fetch();

}