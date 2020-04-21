class chatEngine{
	constructor(chatBoxId,userEmail){
		// this.chatBox = $(`#${chatBoxId}`);
		this.userEmail = userEmail.split(" ")[0];
		this.socket = io.connect('http://localhost:5000');

		if(this.userEmail){
			this.connectionHandler();
		}
	}
	connectionHandler(){
		let self = this;
		this.socket.on('connect',function(){
			console.log('Connection established using sockets');

			self.socket.emit('join_room', {
                user_email: self.userEmail,
                chatroom: 'socialera_1'
            });

            self.socket.on('user_joined', function(data){
                console.log('A user joined!', data);
            })
		})
	$('#msg-send').click(function(){
            let msg = $('#msg-text').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'socialera_1'
                });
                $('#msg-text').val('');
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-msg';

            if (data.user_email == self.userEmail){
                messageType = 'self-msg';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-list-container').append(newMessage);
        })

        $("#chat-list-container .notify").css({
            display:'none'
        });
        $('#msg-text').keyup(function(){
        	self.socket.emit('typing',{
        		user_email: self.userEmail,
                chatroom: 'socialera_1'
        	})
        })

        
        self.socket.on('typing_status',function(data){
        	$("#chat-list-container .notify .typing").html(`${data.user_email} is typing ..</li>`);
        	$("#chat-list-container .notify").fadeIn(200);
        	setTimeout(function(){
        	$("#chat-list-container .notify").hide();
        	$("#chat-list-container .notify .typing").html('');
        	}, 2000);
        })
    }

}