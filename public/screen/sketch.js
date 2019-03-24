// Open and connect leaderboard
let socket = io('/screen');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Leaderboard connected");
});

// Keep track of players
let players= {};

//sockets on in here so that I don't get data before I'm ready to use them
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Listen for message
  socket.on('data', function (message) {
    let data = message;
  });


  // Remove disconnected users
  socket.on('disconnected', function (id) {
    delete players[id];
  });
}


function draw() {
  background(255,200,200);
}