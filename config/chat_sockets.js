module.exports.chatSockets = function(socketServer){
	let io = require('socket.io')(socketServer);
	io.sockets.on('connection',function(socket){

		console.log('New User Connected',socket.id);
		
		socket.on('disconnect',function(){
			console.log('User disconnected',socket.id);
		})

		socket.on('join_room', function(data){
            console.log('Joining Room request received', data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined', data);
        })

        socket.on('send_message', function(data){
            io.in(data.chatroom).emit('receive_message', data);
        });

        socket.on('typing', function(data){
            socket.in(data.chatroom).broadcast.emit('typing_status', data);
        });
	})
}