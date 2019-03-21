// Open and connect leaderboard
let socket = io('/screen');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Leaderboard connected");
});

// Keep track of players
let players = {};

//sockets on in here so that I don't get data before I'm ready to use them
function setup() {
  createCanvas(windowWidth, windowHeight);


  // Listen for message
  socket.on('message', function (message) {
    let id = message.id;
    let data = message.data;
  });


  // Remove disconnected users
  socket.on('disconnected', function (id) {
    delete players[id];
  });
}


function draw() {


}
