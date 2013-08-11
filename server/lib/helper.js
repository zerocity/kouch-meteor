l = function(Identifier,message,typ){
	if (typeof typ == 'undefined' ){
		// default is log
		if (log) {
			return console.log(Identifier,message);
		}		
	}
}