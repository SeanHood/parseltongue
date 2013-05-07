var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

// routing
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/game.html');
});
app.get('/parseltongue', function(req,res) {
	res.sendfile(__dirname + '/index.html');
});

server.listen(8080);

// usernames which are currently connected to the chat
var usernames = {};

io.sockets.on('connection', function (socket) {
	socket.on('play', function() {
		io.sockets.emit('snakes');
	});

	// when the client emits 'adduser', this listens and executes
	socket.on('newplayer', function(username){
		// we store the username in the socket session for this client
		socket.username = username;
		// add the client's username to the global list
		usernames[username] = username;
		// echo to client they've connected
		//socket.emit('updatechat', 'SERVER', 'you have connected');
		// echo globally (all clients) that a person has connected
		//socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
		// update the list of users in chat, client-side
		io.sockets.emit('updateplayers', usernames);
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
	});
});
