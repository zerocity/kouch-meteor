Meteor.call('getIP',function (error,results){
  if (error)
    console.log(error);
	Session.set('getIP',results)
});


Template.layout.getIP = function () {
	return Session.get('getIP')
}