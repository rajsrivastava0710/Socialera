class chatEngine{
	constructor(chatBoxId, userName, userEmail){
		// this.chatBox = $(`#${chatBoxId}`);
		this.userName = userName.split(" ")[0];
		this.socket = io.connect('http://localhost:5000');
        this.userEmail = userEmail;
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
                user_name:self.userName,
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
                    user_name:self.userName,
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

            newMessage.append($('<div>', {
                'html': data.user_name
            }));
            newMessage.append($('<div>', {
                'html': data.message
            }));

            newMessage.addClass(messageType);

            $('#chat-list-container').append(newMessage);
        })

        // $("#chat-list-container .notify").css({
        //     display:'none'
        // });

        var timer_id;

        $('#msg-text').keyup(function(){
        	self.socket.emit('typing',{
        		user_email: self.userEmail,
                user_name: self.userName,
                chatroom: 'socialera_1'
        	})
        })

        
        self.socket.on('typing_status',function(data){
            clearInterval(timer_id)
        	$("#chat-list-container .notify .typing").html(`${data.user_name} is typing ..</li>`);
        	$("#chat-list-container .notify").fadeIn(200);
        	timer_id = setTimeout(function(){
        	// $("#chat-list-container .notify").hide();
            $("#chat-list-container .notify").fadeOut(100);
        	}, 1500);

        })
    }

}