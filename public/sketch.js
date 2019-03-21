// Open and connect player socket
let socket = io('/');

// Listen for confirmation of connection
socket.on('connect', function () {
  console.log("Hello yes you are duck");
});

// Keep track of players
// let players = {};
let names = [];

//start screen variables
let title, intro; //for intro paragraphs
let nameInput; //for dom Input text box thing
let randoDuck, duck0, duck1, duck2, duck3, duck4; //unsolicited duck pics
let startGame = false; //not sure if needed, toggles start of game
let joinGame; //button that starts game 
//game variables
let trenchcoat; //the players sprite (ellipse for testing)
let leanSpeed = 100; //to scale the leftRight movement speed
let ourLean = 0;
let yourLean = 0;
let myLean = 0;
// let leftRightCenter; //starting Zrotation calibration
// let adjustedLeftRight = 0;
let prevLean; //to be able to compare current lean to past
let prevDiff; //in case no difference, continues movement
//preloaded graphics
//duck icons made by https://www.flaticon.com/authors/freepik
function preload(){
  //worried about urls here.... wish glitch would allow for asset folders.
  //if worst comes to worst, i'll host a node server in class
  duck0 = loadImage('https://cdn.glitch.com/e378a87d-9084-4714-be43-1006708681b3%2Fduck1.png?1553031638794')
  duck1 = loadImage('https://cdn.glitch.com/e378a87d-9084-4714-be43-1006708681b3%2Fduck2.png?1553031642745')
  duck2 = loadImage('https://cdn.glitch.com/e378a87d-9084-4714-be43-1006708681b3%2Fduck3.png?1553031646917')
  duck3 = loadImage('https://cdn.glitch.com/e378a87d-9084-4714-be43-1006708681b3%2Fduck4.png?1553031651198')
  duck4 = loadImage('https://cdn.glitch.com/e378a87d-9084-4714-be43-1006708681b3%2Fduck0.png?1553031814417')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //this was just for dom text stuff, prob shouldn't use it
  // let canvas = createCanvas(windowWidth, windowHeight);
  // canvas.parent('canvas');
  
  //on connect, will display intro, rando duck face, and name input
  
  /* had trouble with text, coming back to it later
  textAlign(CENTER);
  //could include better font than default
  // and/or font color
  textSize(width/20);
  text('Welcome to Two Ducks!', width/2, height/10);
  textSize(width/40);
  title = createP('Welcome to Two Ducks!')
  title.parent('canvas');
  intro = createP('You and a partner are two ducks in a trenchcoat trying to run through a bakery and collect as much bread as you can before being discovered. Be careful not to run into any of the bakers!');
  intro.parent('canvas');
  text('You and a partner are two ducks in a trenchcoat trying to run through a bakery and collect as much bread as you can before being discovered. Be careful not to run into any of the bakers!', width/2, 2*height/10);
  text('Tilt your phone left and right to control, but you\'ll have to coordinate with the other duck!', width/2, 3*height/10);
  */
  textAlign(CENTER);
  textSize(width/20);
  text('Welcome to Two Ducks!', width/2, height/10);
  imageMode(CENTER);
  randoDuck = random([duck0, duck1, duck2, duck3, duck4]);
  image(randoDuck, width/2, height/2);
  nameInput = createInput('What is your name?');
  nameInput.position(width/2 - nameInput.width/2, 8*height/10); //had to call these separately because needs to be defined before using .width
  joinGame = createButton('Click Here to Join Game');
  joinGame.position(width/2 - joinGame.width/2, 9*height/10);           
  joinGame.mousePressed(function(){ //should include something that happens if they click before inputting name
      // if(nameInput.value() != 'What is your name?'){ 
        let duckName = nameInput.value();
        // names[duckName] = {};
        data = {
          name: duckName,
          id: socket.id
        }
         //after submit, will emit and display the game
        socket.emit('joined', data);
        startGame = true;
        console.log('joining game!');
        nameInput.hide();
        joinGame.hide();
        trenchcoat = new Trenchcoat();
        prevLean = floor(rotationZ); //starting orientation
        
      // }
  });
  
 
  //collecting player name for room
  socket.on('joined', function(name){
    // names[data.name] = {};
    for (let i = names.length -1; i >=0; i--){
      console.log('test' + i);
      if (name != names[i]){
        names.push(name);
        return;
      }
    }
  });
  
  // Listen for message
  socket.on('message', function (message) {
    let id = message.id;
    let data = message.data;
    yourLean = data.lean;
  });
  
  
  socket.on('leave room', function (name) {
    // display('(they left...)');
   // delete names[name];
    for (let i = names.length -1; i >=0; i--){
      if (name == names[i]){
        names.splice(i, 1);
      }
    }
    //need to display a message where the other player's name is or in the center where the countdown would be
  });

  // Remove disconnected users
  socket.on('disconnected', function (id) {
    // delete players[id];
    
  });  
}


function draw() {
 if (startGame){
   background(255);
   //test names
   let nameTest = 1;
   // for (let n in names){
   for (let i = names.length -1; i >=0; i--){
     text(names[i], nameTest*width/4, 9*height/10);
     nameTest++;
   }
  ourLean = myLean + yourLean;
  trenchcoat.move(ourLean);
  trenchcoat.display();
  
  /* 3/19 issue 
  // rotationZ gives you numbers from 0 to 360. 
  // not reliable where 0 is though....
  // start calibrated to center?
  let leftRight = floor(rotationZ); //Z so that they have to lean left and right
  //should realistically be 180 degrees of lean...
  //so checking for weird jump to 360
  if (abs(leftRight - leftRightCenter) > 90){ //if it jumps past 360
    let fix = 360 - leftRight; //find how far over it went
    adjustedLeftRight = 0 - fix; //and just make the new value go past 0 instead of jump to 360
  }
  else {
    adjustedLeftRight = leftRight;
  }
  constrainedLeftRight = constrain(adjustedLeftRight, -90, 90);
  //now need to figure out how to map the new range of values to the leanSpeed
  // myLean = constrainedLeftRight; // to test
  myLean = map(constrainedLeftRight, -90, 90, leanSpeed, leanSpeed * -1); //reversed because leaning right gives negative values
  */
   
 //Mimi's rotation code
  if (rotationZ > 180) {
    leftRight = rotationZ - 360; // This will yield a negative number.
  }
	else {
    leftRight = rotationZ;
  }
  //okay so now what happens is it's based on lean difference now, and will continue to lean if held
  let leanDifference = prevLean - leftRight; //so that leaning more right = positive, more left = negative
  if (abs(leanDifference - prevDiff) < 1) { //if not moving much, will keep moving slightly in prev. direction
    leanDifference = prevDiff; //will never be still, better to wobble, it's ducks
  }
  else prevDiff = leanDifference;
  if (abs(leanDifference) < 180) { //to account for jumps from 360
    prevLean = leftRight; 
    myLean = map(leanDifference, -180, 180, leanSpeed * -1, leanSpeed); //not reveresed anymore
  }
  let data = {
    lean: myLean
  };
  socket.emit('data', data);
 }
}


class Trenchcoat {
  constructor(){
    this.x = width/2;
    this.y = 9*width/10;
    this.diameter = 50;
  }
  move(combinedLean){
    this.x += combinedLean;
    this.x = constrain(this.x, 0 + this.diameter, width - this.diameter);
  }
  display(){
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}