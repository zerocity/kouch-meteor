// First Start of the server 
// Create the document for handling playlist

if (Kouch.find().count() === 0) {
  var jsonQueue = {
  	state:'',
    currentPosition :''
  }
  
  Kouch.insert(jsonQueue);
  console.log('[CREATE] kk');
  kkId = Kouch.findOne({});
}else{
  kkId = Kouch.findOne({});
  //console.log('[QUEUE][CURRENT]\n',kkId.playlist);
}