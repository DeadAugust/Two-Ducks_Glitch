// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

//according to https://socket.io/docs/rooms-and-namespaces/
// not sure what adapter is, since we're not using redis?
// but I get that this is supposed to be a running list of all rooms
let rooms = io.sockets.adapter.rooms;
let roomNum = 0;
//number of users that are in each game
let numPartners = 2;

// Default connection for players, just plain url, no namespace
let ducks = io.of('/');
// Listen for players to connect
ducks.on('connection', function (socket) {
  console.log('New Duck! Quacking from: ' + socket.id);
  
  socket.on('joined', function(data){
    socket.name = data.name; //need?
    joinRoom(socket);
    let room = socket.room;
    let name = socket.name;
    if (rooms[room]) {
      socket.to(room).emit('joined', name); 
    }
    console.log(rooms);
  });

  
  // Listen for data messages
  socket.on('data', function (data) {
    // Data comes in as whatever was sent, including objects
    //console.log("Received: 'message' " + data);
    let room = socket.room;
    // let names = [];
    if (rooms[room]) {
      // names = room.names;
      // Wrap up data in message
      let message = {
        id : socket.id,
        data : data,
        lean: data.lean
        // names: names
      }
      console.log(data.lean);
      // Send data to all clients
      ducks.to(room).emit('message', message);
    }
  });

  // Listen for this player to disconnect
  // Tell all players this player disconnected
  socket.on('disconnect', function () {
    console.log("Duck has flown away: " + socket.id);
    ducks.emit('disconnected', socket.id);
    // outputs.emit('disconnected', socket.id);
    let room = socket.room;
    //lets the other person in the room know they left
    let name = socket.name;
    if (rooms[room]) {
      socket.to(room).emit('leave room', name); 
    }
  });
});

// Shared screen with leaderboard stats
var screen = io.of('/screen');
// Listen for the leaderboards to connect
screen.on('connection', function (socket) {
  console.log('Leaderboard connected: ' + socket.id);

  // Listen for this output client to disconnect
  socket.on('disconnect', function () {
    console.log("Leaderboard has disconnected " + socket.id);
  });
});


function joinRoom(socket) {
//ahhh got it, so each "room" is an array of the socket ids of its occupants
//if you find a room with 0 or 1 users, you join it.
  for (let r in rooms) {
    let room = rooms[r];
    if (room.isPrivate) {
      if (room.length < numPartners) {
        addSocketToRoom(socket, r);
        return;
      }
    }
  }

  //so this is only if there are no rooms? since roomNum is 0? hmm....
  addSocketToRoom(socket, roomNum);
  //ahh, and it'll repeat and create new rooms in the case that the only rooms that exist have 2 people already?
  // oh because this is server, so roomNum is globalllllll duh
  roomNum++;
}
//so this is the actual function that adds the socket to the room
function addSocketToRoom(socket, r) {
  socket.join(r);
  //this is an arbitrary toggle, just to "open the room" ironically (i think?)
  //does this actually do anything in this sketch? because it doesn't matter if room is "private" since it'll only join...
  // unless this has something to do with the adapter.rooms (like maybe there are more rooms than is good? like everyone would start on own room and get stuck there)
  rooms[r].isPrivate = true;
  // rooms[r].names.push(socket.name); //can't assign?
  socket.room = r;
}