module.exports.notifySockets = function(socketServer){
	let io = require('socket.io')(socketServer);
	io.sockets.on('connection',function(socket){

		console.log('Notify:New User Connected',socket.id);
	})
}