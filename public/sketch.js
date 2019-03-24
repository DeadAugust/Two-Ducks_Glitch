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
let duckName;
let randoDuck, duck0, duck1, duck2, duck3, duck4; //unsolicited duck pics
let startGame = false; //not sure if needed, toggles start of game
let joinGame; //button that starts game 

//game variables
let trenchcoat; //the players sprite (ellipse for testing)
let leanSpeed = 500; //to scale the leftRight movement speed
let ourLean = 0;
let yourLean = 0;
let myLean = 0;
let prevLean; //to be able to compare current lean to past
let prevDiff; //in case no difference, continues movement

//colors for something, do not remember what
let testColors = {
  r: 255,
  g: 0,
  b: 0
};

let omgColors = {
  r: 255,
  g: 255,
  b: 255
};

//falling cake bread variables
let tests = {
  angle:0.0,
  number:3,
  wow:[],
  speed:[],
  hitByDucks:[],
  x:[],
  y:[],
  count:0,
};

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
  
  //header
  textAlign(CENTER);
  textSize(width/20);
  text('Welcome to Two Ducks!', width/2, height/10);
  
  //duck face
  imageMode(CENTER);
  randoDuck = random([duck0, duck1, duck2, duck3, duck4]);
  image(randoDuck, width/2, height/2);
  
  //input and start button
  nameInput = createInput('What is your name?');
  nameInput.position(width/2 - nameInput.width/2, 8*height/10); //had to call these separately because needs to be defined before using .width
  joinGame = createButton('Click Here to Join Game');
  joinGame.position(width/2 - joinGame.width/2, 9*height/10);           
  joinGame.mousePressed(function(){ //should include something that happens if they click before inputting name
      // if(nameInput.value() != 'What is your name?'){ 
        duckName = nameInput.value();
        prevLean = floor(rotationZ); //starting orientation
        let data = {
          name: duckName,
          lean: prevLean,
          id: socket.id
        }
         //after submit, will emit and display the game
        socket.emit('joined', data);
        startGame = true;
        console.log('joining game!');
        nameInput.hide();
        joinGame.hide();
        trenchcoat = new Trenchcoat();
        
      // }
    
    //initializing all bread during game
    initialShape();
  });
  
 //change to partner event
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
  
  // Listen for lean update from server
  socket.on('lean update', function (leanMsg) {
    // let id = leanMsg.id;
    // let data = message.data;
    // yourLean = data.lean;
    ourLean = leanMsg.lean;
  });
  
  //when the partner leaves
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
   background(255,200,200);
   testsStay(); //moving the cake breads, making sure they stay on the screen
   breadCaught(); //bread gets caught by trenchcoat
   cakeCount(); //counter for amount of bread caught
   
   //test names
   // let nameTest = 1;
   // // for (let n in names){
   // for (let i = names.length -1; i >=0; i--){
   //   text(names[i], nameTest*width/4, 9*height/10);
   //   nameTest++;
   // }
  
  //moving to server to make sure display is same for both
  // ourLean = myLean + yourLean;
  trenchcoat.move(ourLean);
  trenchcoat.display();

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
    name: duckName,
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

//shape of cake breads
function drawShape(x,y,speed) {
  noStroke();
  //last layer
  fill(252, 228, 196);
  for (o=0;o<10;o++) {
    triangle(x,y+15+o, x+50,y+15+o, x+9,y+15+15+o);
  }
  //middle layer
  fill(255);
  for (m=0;m<5;m++) {
    triangle(x,y+10+m, x+50,y+10+m, x+9,y+15+10+m);
  }
  //first layer
  fill(252, 228, 196);
  for (g=0;g<10;g++) {
    triangle(x,y+g, x+50,y+g, x+9,y+15+g);
  }
  //top
  fill(255);
  triangle(x,y, x+50,y, x+9,y+15);
  //strawberry
  stroke(255, 144, 104);
  fill(255,0,0);
  ellipse(x+15,y+3,12,16);
  //strawberry-tip
  noStroke();
  fill(0,255,0);
  rect(x+15,y-5,1.5,5);
  //rect(x+12,y-5,1.5,5);
  //frosting
  stroke(255);
  fill(238);
  ellipse(x+4,y-1,12,12);
  fill(247);
  ellipse(x+7,y+3,12,12);
  fill(255);
  ellipse(x+10,y+8,12,12);
}

function initialShape() {
  noStroke();
  for (i=0; i<tests.number; i++) {
    tests.x[i] = random(-50, width); //random starting x
    tests.y[i] = random(-50,height-100); //random starting y 
    tests.speed[i] = random(0.50,1); //speed of cakes
    tests.hitByDucks[i] = false; //not yet hit by thing
    drawShape(tests.x[i],tests.y[i],tests.speed[i]); //drawing the shapes
  }
}

function testsStay() {
  for (i=0; i<tests.number; i++) {
    if(tests.hitByDucks[i] === false) {
      tests.y[i] += tests.speed[i];
      if (tests.y[i] > height) {
      tests.y[i] = random(-150,300);
      }
      if (tests.y[i] < -150) {
      tests.y[i] = -150;
      }
      if(tests.x[i] > width) {
      tests.x[i] = random(0,width);
      }
      if(tests.x[i] < 0) {
      tests.x[i] = 0;
      }
      drawShape(tests.x[i],tests.y[i],tests.speed[i]);
    }
  }
}

function breadCaught() {
  for (i=0; i<tests.number; i++) {
    let d = dist(trenchcoat.x,trenchcoat.y,tests.x[i],tests.y[i])
    if (d < 50) {
      	tests.hitByDucks[i] = true;
				//splice(tests.wow[i],1);
      	// splice(tests.speed[i],1);
      	// splice(tests.x[i],1);
      	// splice(tests.y[i],1);

      	tests.count += 1;
    }
  }
}

function cakeCount() {
  stroke(0);
  textSize(20);
  fill(0);
  text(tests.count,width-36,51);
}