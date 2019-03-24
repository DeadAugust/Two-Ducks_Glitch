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

// Default connection for players, just plain url, no namespace
let ducks = io.of('/');
// Listen for players to connect
ducks.on('connection', function (socket) {
  console.log('New Duck! Quacking from: ' + socket.id);
  
  socket.on('joined', function(data){
    socket.name = data.name; //need?
    socket.lean = data.lean;
    joinRoom(socket);
    // let room = socket.room;
    // let name = socket.name;
    // if (rooms[room]) {
    //   socket.to(room).emit('joined', name); 
    // }
    
    //send partner event message
    console.log(rooms);
  });

  
  // Listen for data messages
  socket.on('data', function (data) {
    let room = socket.room;
    let name = data.name;
    // if (rooms[room][name]) {
      // let ourLean = 0;
      // console.log(rooms[room]['ducks']);
    // if (rooms[room][name]) {
    //   console.log('test');
    //   rooms[room][name] = data.lean;
    // }
    rooms[room]['ducks'][name] = data.lean; //updating individual value
    
      // for (let duck in rooms[room]['ducks']){
        // console.log(duck);
        // if (data.name == duck['name']){
        //   duck['lean'] = data.lean;
        // }
        // ourLean += duck['lean'];
      // }      
    // console.log(rooms[room][name]);
    let ourLean = 0;
    for (let duck in rooms[room]['ducks']){
      ourLean += rooms[room]['ducks'][duck]; //so not strings but values...
    }
    // let ourLean = rooms[room][name];
      // Wrap up data in message
      let leanMsg = {
        // id : socket.id,
        // data : data,
        lean: ourLean
      }
      // console.log(data.lean);
      // console.log(leanMsg.lean);
      
      // Send lean update to ducks in that room
      ducks.to(room).emit('lean update', leanMsg);
      //send lean to screen
      screen.emit('lean combo', leanMsg);
    // }
  });

  // Listen for this player to disconnect
  // Tell all players this player disconnected
  socket.on('disconnect', function () {
    console.log("Duck has flown away: " + socket.id);
    ducks.emit('disconnected', socket.id);
    // outputs.emit('disconnected', socket.id);
    // let room = socket.room;
    //lets the other person in the room know they left
    // let name = socket.name;
    // if (rooms[room]) {
    //   socket.to(room).emit('leave room', name); 
    // }
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
  rooms[r].isPrivate = true;
  socket.room = r;
  let duckName = socket.name;
  //console.log(Object.keys(rooms[r])); //wtf, how is Room {} the value of r?
  // rooms[r].ducks += {name: duckName, lean: 0}; //+=????
  // rooms[r]['ducks'] += {name: duckName, lean: 0}; //+=????
  if (rooms[r]['ducks'] == undefined){
    // console.log('thisisisis');
    // Object.defineProperty(rooms[r], 'ducks', {
    //   zero: 0 //so doesn't matter if counts as a duck in ourLean
    // });
    rooms[r]['ducks'] = {zero: 0};
    // console.log(rooms[r]);
  }
  rooms[r]['ducks'][duckName] = socket.lean; //to store lean
  // console.log(rooms[r]); //oohhhhh so .ducks is assigning, 'ducks' is listing??
  /* hmm....
  if (rooms[r].ducks != undefined){ 
    let slots = Object.keys(rooms[r]['ducks']);
    let slotNum = 0;
    for (let slot in slots) {
      if (slotNum == slot) {
        slotNum++;
      }
    }
    Object.defineProperty(rooms[r]['ducks'], slotNum, {
      name: duckName, 
      lean: 0
    });
    console.log('next? \n'+ rooms[r].ducks);
  }
  else {
    rooms[r].ducks = {0: {name: duckName, lean: 0}};
    console.log('first?\n '+ rooms[r].ducks);
  }
  */
}