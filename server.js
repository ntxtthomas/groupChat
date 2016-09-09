// 1. set up the view(s)/index
// 2. on the client side, code that asks for data and stores it in a variable
// 3. user submits the data
// 4. server listens for the data and pass name to server
// (4.1) have the server broadcast an event called "new_user" to the clients with the name of the new user attached to this event, 
// 		app.io.route('got_a_new_user', function(req){
// 		req.data.name
//		app.io.broadcast('new_user', {new_user_name: req.data.name});
//		});
//	(4.2) store the name/session ID of the new user in a variable/array/hash called "users",
// 		var users = {};
//		<=!--users[] some way to store new users-->
//	(4.3) to the person who sent this request we EMIT an event called 'existing_users' with all the users data. 
//
//		app.io.route{'got_a_new_user', function(req){}}

// 5. server broadcasts that new user has joined and passes new user name
// 6. server listens for new user event.. when this gets triggered server renders
// this information in the jquery user box
// 7. have the server listen for a "disconnect" event and when it occurs, 
// broadcoast an event "disconnect_user" with some data (ie; name or id)..
// probably need to pass session ID to identify a user
// 8. have client listen for event "disconnect user", and when its 
// triggered have client remove proper jquery box from client

var express = require('express');
var app = express();

app.use(express.static(__dirname + "/static"));

var server = app.listen(7000, function(){
	console.log('Port 7000 is ALIVE!');
});
var io = require('socket.io').listen(server);

var users = [];

io.sockets.on('connection', function(socket){// on connection

	socket.on('newUser', function(userData){
		users.push({
			socketID: socket.id,
			name: userData.userName
		});
		io.emit('updateUserList', users);
		io.emit('updateMessageBoard', {msg: ('<p>' + userData.userName + ' has entered.</p>' )});

	})

	socket.on('newMessage', function(userdata){
		io.emit('updateMessageBoard', userdata);

	})
// 	// (Action) Emit to Client - Response to Client who emitted 'button-clicked'
// 	// socket.emit('server_response', {response: "working"});

// 	// (Action) Broadcast to all except Client (who emitted 'button_clicked')
// 	// io.emit('server_response', {response: "Working"});

// 	// (Action) Broadcast to all including (who emitted 'button_clicked')
// 	// io.emit('server_response', {response: "Working"});

	socket.on('disconnect', function() {
		for(index in users){
			if(users[index].socket == socket.id){
				users.splice(index, 1);
				io.emit('updateUserList', users);
				io.emit('updateMessageBoard', {msg: ('<p>' + userData.userName + ' has left. </p>' )});

			} 
		}
	});
});
