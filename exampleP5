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

let tests = {
  angle:0.0,
  number:20,
  wow:[],
  speed:[],
  hitByMouse:[],
  x:[],
  y:[],
  count:0,
};

let mouseFace = {
  headWidth:37,
  headLength:40,
  
  eyeLX: 8,
  eyeRX: 7,
  eyeY: 2,
  
  leftLid: 7,
  rightLid: 8,
  
  smileY:6,
  blushX:11,
  blushY:3,
  hair:10,
  
  smileR: 10,
  smileL:170
};

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  initialShape();
}
             

function draw() {
  background(255,200,200);
  backDots();
  testsStay(); 
  mouseShape();
  rollover();
  cakeCount();
}

function backDots() {
  for(e = 0;e<height;e+=30) {
    for(r = 0; r<width;r+=30) {
      stroke(80+e,80+e,80+e);
      strokeWeight(2);
      noFill();
      ellipse(r,e,5,5);
      ellipse();
    }
  }
}

function mouseShape() {
  noStroke();
  fill(200);
  //body
  quad(mouseX-10,mouseY+15, mouseX-15,mouseY+30, mouseX+10,mouseY+15, mouseX+15,mouseY+30);
  fill(omgColors.r,omgColors.g,omgColors.b);
  //face
  ellipse(mouseX,mouseY,mouseFace.headWidth,mouseFace.headLength); 
  fill(0);
  //eyes
  ellipse(mouseX-mouseFace.eyeLX,mouseY-2,4,4);//left eye
  stroke(0);
  strokeWeight(1);
  noFill();
  arc(mouseX - mouseFace.leftLid, mouseY, 10, 10, radians(215), radians(320));//left lid
  fill(0);
  noStroke();
  ellipse(mouseX+mouseFace.eyeRX,mouseY-2,4,4);//right eye
  stroke(0);
  strokeWeight(1);
  noFill();
  arc(mouseX + mouseFace.rightLid, mouseY, 10, 10, radians(215), radians(320));//right lid
  
  //smile
  stroke(255,0,0);
  arc(mouseX, mouseY+mouseFace.smileY, 15, 15, radians(mouseFace.smileR), radians(mouseFace.smileL));
  //blush
  noStroke();
  fill(255, 200, 200);
  ellipse(mouseX-mouseFace.blushX,mouseY+mouseFace.blushY,5,5); //left-blush 
  ellipse(mouseX+mouseFace.blushX,mouseY+mouseFace.blushY,5,5);//right-blush
  //hair
  fill(0);
  arc(mouseX,mouseY-10,mouseFace.headWidth,mouseFace.headLength,radians(180),radians(0));
  fill(testColors.r,testColors.g,testColors.b);
}

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
    tests.x[i] = random(-50, width); 
    tests.y[i] = random(-50,height-100);
    tests.speed[i] = random(0.50,1.75);
    tests.hitByMouse[i] = false;
    drawShape(tests.x[i],tests.y[i],tests.speed[i]);
  }
}

function testsStay() {
  for (i=0; i<tests.number; i++) {
    if(tests.hitByMouse[i] === false) {
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

function rollover() {
  	let wot = random(25,50);
    for (i=0; i<tests.number; i++) {
    let d = dist(mouseX,mouseY,tests.x[i],tests.y[i])
    if (d < 20) {
      //face
      fill(255);
      ellipse(mouseX,mouseY,mouseFace.headWidth,mouseFace.headLength); 
      fill(0);
      //eyes	
      ellipse(mouseX-mouseFace.eyeLX,mouseY-2,4,4);//left eye
      stroke(0);
      strokeWeight(1);
      noFill();
      arc(mouseX - mouseFace.leftLid, mouseY, 10, 10, radians(215), radians(320));//left lid
      fill(0);
      noStroke();
      ellipse(mouseX+mouseFace.eyeRX,mouseY-2,4,4);//right eye
      stroke(0);
      strokeWeight(1);
      noFill();
      arc(mouseX + mouseFace.rightLid, mouseY, 10, 10, radians(215), radians(320));//right lid

      //smile
      noStroke();
      fill(255,0,0);
      ellipse(mouseX, mouseY+mouseFace.smileY+3, 15, 15);
      //blush
      fill(255, 200, 200);
      ellipse(mouseX-mouseFace.blushX,mouseY+mouseFace.blushY,5,5); //left-blush 
      ellipse(mouseX+mouseFace.blushX,mouseY+mouseFace.blushY,5,5);//right-blush
      //hair
      fill(0);
      arc(mouseX,mouseY-10,mouseFace.headWidth,mouseFace.headLength,radians(180),radians(0));
      fill(testColors.r,testColors.g,testColors.b);
      //exclamatory
      if (tests.count >= 0 && tests.count <= 7 ) {
    		//shine
      	noFill();
      	stroke(104, 255, 247);
      	ellipse(mouseX+50,mouseY,20,20);//bubble 1
        ellipse(mouseX+40,mouseY-10,30,30); //bubble 2
        ellipse(mouseX+30,mouseY+5,10,10); //bubble 3
  		} else if (tests.count > 7 && tests.count <= 10 ){
        textSize(12);
      	fill(0);
      	text('omg',mouseX+30,mouseY);
      }	else if (tests.count >10 && tests.count <= 17) {
        text('please no',mouseX+30,mouseY);
  		} else if (tests.count > 18) {
        text('dead',mouseX+30,mouseY);
      }
    }
  }
}

function mousePressed() {
  for (i=0; i<tests.number; i++) {
    let d = dist(mouseX,mouseY,tests.x[i],tests.y[i])
    if (d < 30) {
      	tests.hitByMouse[i] = true;
				//splice(tests.wow[i],1);
      	// splice(tests.speed[i],1);
      	// splice(tests.x[i],1);
      	// splice(tests.y[i],1);

      	tests.count += 1;
      	mouseFace.headWidth += 10;
      	mouseFace.headLength += 10;
      	
      	//mouseFace.eyeLX += 1;
      	mouseFace.eyeRX += 1;
      	mouseFace.eyeY += 1;
      	mouseFace.eyeLX += 1;
      	
    		mouseFace.leftLid += 1;
      	mouseFace.rightLid += 1;
      	
      	mouseFace.smileY += 1;
      	mouseFace.blushX += 1;
      	mouseFace.blushY += 1;
      
      	// for (w=0; w<80; w+=20) {
      	// if (mouseFace.smileR < 100 && mouseFace.smileL <200); {
      	// mouseFace.smileR +=w;
      	// mouseFace.smileL +=w;
      	// }
      	// }
      
    }
  }
}
function cakeCount() {
  stroke(0);
  textSize(20);
  fill(0);
  text(tests.count,width-36,51);
  //text('cakes',width-60,70);
}

function tooMuchCake() {
//   if (tests.count > 10 ) {
    
//   } elif (tests.count >15) {
//   }
}




