var sys = require('util')
,io = require('socket.io').listen(8080);


io.set('log level', 1); 

var customers = [ ];
var socketIDs = [ ];
var i = 0
var connections = 0
io.sockets.on('connection', function (socket) {
	console.log('ID SET TO: ' + socket.id);
	
	connections++;
	socket.emit('getName');
	socket.on('newCust', function (custName) {
		socket.nickname = custName;
		customers.push(socket.nickname);
		socketIDs.push(socket.id);
		io.sockets.emit('customerLogin', socket.nickname, socket.id);
		console.log('LOGIN FUNCTION');
		console.log(customers);
		console.log(socketIDs);
		io.sockets.emit('updateCustList', customers, socketIDs, connections);
		//socket.emit('identify', socket.id);
	});
	
	socket.on('setAdminName', function(){
		socket.nickname = 'Admin';
		adminID = socket.id;
		socketIDs.splice(socketIDs.indexOf(adminID), 1);
		connections--;
	});
	
	socket.on('orderComplete', function (custName) {
		io.sockets.emit('customerComplete', custName, socket.id);
	});
	
	socket.on('disconnect', function () {
		connections--;
		if (socket.nickname != 'Admin'){
			customers.splice(customers.indexOf(socket.nickname), 1);
			console.log('LOGOUT');
			console.log(customers);
			console.log(socketIDs);
			socketIDs.splice(socketIDs.indexOf(socket.id), 1);
			io.sockets.emit('updateCustList', customers, connections);
			io.sockets.emit('customerLogoff', socket.nickname, socket.id);
		}
	})
	

});