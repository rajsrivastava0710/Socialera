class notifyEngine{
	constructor(friend,userEmail){
		this.friend = friend;
		this.userEmail = userEmail.split(" ")[0];
		this.socket = io.connect('http://localhost:3000');

		if(this.userEmail){
			this.connectionHandler();
		}
	}
	connectionHandler(){
		let self = this;
		this.socket.on('connect',function(){
		console.log('Notification Connection established using sockets');

		});
		//Todo a lot of task for notification :
		// notify_engine
		// notify_sockets
		// profile.ejs last lines
	}
}