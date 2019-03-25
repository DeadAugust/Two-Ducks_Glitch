// Open and connect leaderboard
let socket = io('/screen');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Leaderboard connected");
});

// Keep track of scores
// let players= {};
let duckRanks = [];

//sockets on in here so that I don't get data before I'm ready to use them
function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);
  // Listen for message
  // socket.on('data', function (message) {
  //   let data = message;
  // });
  
  socket.on('new score', function(newRanks){
    duckRanks = newRanks;
  });


  // Remove disconnected users
//   socket.on('disconnected', function (id) {
//     delete players[id];
//   });
}


function draw() {
  background (225, 255, 0, 175);
  textSize(height/8);
  noStroke();
  fill(0);
  text("Top Teams: ", width/2, height/8);
  if (duckRanks != []){ //if this doesn't work, will need to have demo score
    if (duckRanks.length < 8) {
      textSize(height/(8 + duckRanks.length));
      hLine = (height-100)/(duckRanks.length + 1);
      for(let i = 0; i < duckRanks.length; i++){
          let place = i +1;
          text(place + ". " + duckRanks[i].duckNames + ": " + duckRanks[i].points, width/2, ((i+1) * hLine) + 100);
      }     
    }
    else { //max 8 scores on leaderboard
      textSize(height/16);
      hLine = (height-100)/9;
      for(let i = 0; i < 8; i++){
          let place = i +1;
          text(place + ". " + duckRanks[i].duckNames + ": " + duckRanks[i].points, width/2, ((i+1) * hLine) + 100);
      } 
    }
  }
}
/*
   //for server
  
   
   
  socket.on('end game', function(count){
    let room = socket.room;
    let nameArray = Object.keys(rooms[room]['ducks']); //need to make string
    let duckNames ="";
    for (var name in nameArray){
      duckNames += (nameArray[name] + " ");
    }
    let final = {
      duckNames: duckNames,
      points: count //from event**
    }
    let repeat = false;
    for (let i = duckRanks.length - 1; i >= 0; i--){
      if (duckRanks[i] == final){
        repeat = true;
      }
    }
    if (!repeat){
      duckRanks.push(final);
      duckRanks.sort(function (a, b) {
        return b.points - a.points;
      }
      screen.emit('new score', duckRanks); //right?
      // break; // or return?
    }
  }

          
    */