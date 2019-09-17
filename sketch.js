var scoreElem;

var frogX = 250;
var frogY = 250;
var FROG_WIDTH = 20;
var FROG_HEIGHT = 40;

var SPACING = 50;

var VEHICLE_DENSITY = 15;

var level = 0;
var highscore = 0;

var vehicles = [];

var colors = ['#b21f35','#d82735','#ff7435','#ffa135','#ffcb35','#fff735','#00753a','#009e47',
				'#16dd36','#0052a5','#0079e7','#06a9fc','#681e7e','#7d3cb5','#bd7af6'];
var color;

var gameState = true;

var noPlayer = false;
//var frogAITimer = 0;
var buffer = level*3.5 + 20;

function setup(){
	createCanvas(500, 500);
	frameRate(25);

	rectMode(CENTER);

	updateLevel();
}

function draw(){
	background(0);
	stroke(255);

	if (level == 0){
		color = random(colors);
	}

	if (noPlayer/* && frameCount%4==0*/){
		frogAI();
	}
	updateFrog();
	updateLevel();
	updateVehicles();
	checkGame();
}

function frogAI(){
	/*if (frogAITimer==1) {
		frogAITimer = 0;*/
		buffer = level*3.5 + 20;
		if(frogY == 500 && frogX != 250){
			if(frogX > 250){
				frogX -=SPACING;
			}
			if(frogX < 250){
				frogX += SPACING;
			}
		}else{
		var forwardCollisions = 0;
		for (var i = 0; i < vehicles.length; i++){
			forwardCollisions += vehicles[i].checkAIFront();
		}
		var rightCollisions = 0;
		for (var i = 0; i < vehicles.length; i++){
			rightCollisions += vehicles[i].checkAIRight();
		}
		var leftCollisions = 0;
		for (var i = 0; i < vehicles.length; i++){
			leftCollisions += vehicles[i].checkAILeft();
		}

		if (forwardCollisions == 0) { // not blocked by top = UP
			frogY -= SPACING;
		} else if (rightCollisions > 0 && leftCollisions == 0 && frogX-SPACING>=0) { // blocked by top and right = LEFT
			frogX -= SPACING;
		} else if (leftCollisions > 0 && rightCollisions == 0 && frogX+SPACING<=500) { // blocked by top and left = RIGHT
			frogX += SPACING;
		} else if (leftCollisions > 0 && rightCollisions > 0) { // surrounded on top, left, right = BACKWARDS
			frogY += SPACING;
		} else if (leftCollisions > 0 && frogX+SPACING>500) { // surrounded and up against the right wall = BACKWARDS
			frogY += SPACING;
		} else if (rightCollisions > 0 && frogX-SPACING<0) { // surrounded and up against the left wall = BACKWARDS
			frogY += SPACING;
		}
	}
	/*}

	frogAITimer++;*/
}

function checkGame(){
	for (var i = 0; i < vehicles.length; i++) {
		vehicles[i].check();
	}
}

function endGame(){
	noLoop();
	document.getElementById("score").innerHTML = level;
	document.getElementById("gameOver").innerHTML = "R to Restart.";
	gameState = false;
}

function updateFrog(){
	rect(frogX, frogY, FROG_WIDTH, FROG_HEIGHT);
}

function updateLevel(){
	if (frogY == 0){
		frogY = 500;
		level++;
		document.getElementById("score").innerHTML = level;
		if (level > highscore) {
			highscore = level;
			document.getElementById("highscore").innerHTML = highscore;
		}
		vehicles.length = 0;
		generate();
	}
}

function updateVehicles(){
	fill(color);
	stroke(color);
	for (var i = 0; i < vehicles.length; i++){
		vehicles[i].move();
		vehicles[i].display();
	}
	stroke('#ffffff');
	fill('#ffffff');
}

function generate(){
	color = random(colors);
	for (var i = 0; i < VEHICLE_DENSITY; i++){
		vehicles.push(new Vehicle())
	}
	document.getElementById("instructions").innerHTML = "";
	document.getElementById("instructions2").innerHTML = "";
}

// vehicle class
function Vehicle() {
	if (random()<.5) {
		this.x = random(-250, 500);
		this.direction = 'right';
	} else {
		this.x = random(0, 750);
		this.direction = 'left';
	}
	this.y = SPACING*round(random(1, 9));
	this.width = 50;
	this.height = 40;
	this.speed = level;


	this.move = function(){
		if (this.direction == 'right') {
			this.x += this.speed;
			if (this.x > 750){
				this.x = random(-250, 0);
			}
		} else if (this.direction == 'left') {
			this.x -= this.speed;
			if (this.x < -250){
				this.x = random(500, 750);
			}
		}
	};

	this.display = function(){
		rect(this.x, this.y, this.width, this.height);
	};

	this.check = function(){
		if ((frogX < ((this.x)+(this.width/2)+(FROG_WIDTH/2))) && (frogX > ((this.x)-(this.width/2)-(FROG_WIDTH/2))) && this.y == frogY){
			endGame();
		}
	};

	this.checkAIFront = function(){
		var xDistance = this.x - frogX
		var rowAbove = frogY - SPACING;
		if (this.direction == 'right'){
			if ((xDistance<=(FROG_WIDTH/2+this.width/2)) && (xDistance>=(-1*(FROG_WIDTH/2+this.width/2+buffer))) && (this.y==rowAbove)){
				return 1;
			}
		} else if (this.direction == 'left'){
			if ((xDistance>=(-1*(FROG_WIDTH/2+this.width/2))) && (xDistance<=(FROG_WIDTH/2+this.width/2+buffer)) && (this.y==rowAbove)){
				return 1;
			}
		}
		return 0;
	};

	this.checkAIRight = function(){
		var xDistance = this.x - frogX;
		if (this.direction == 'left'){
			if ((xDistance>=(FROG_WIDTH/2+this.width/2)) && (xDistance<=(FROG_WIDTH/2+this.width/2+buffer)) && (this.y==frogY)){
				return 1;
			}
		}
		return 0;
	};

	this.checkAILeft = function(){
		var xDistance = this.x - frogX;
		if (this.direction == 'right'){
			if ((xDistance<=(-1*(FROG_WIDTH/2+this.width/2))) && (xDistance>=(-1*(FROG_WIDTH/2+this.width/2+buffer))) && (this.y==frogY)){
				return 1;
			}
		}
		return 0;
	};

};

function keyPressed(){
	switch (keyCode) {
		case 37: // left arrow
		if (frogX > 0) {frogX -= SPACING;}
		break;
		case 39: // right arrow
		if (frogX < 500) {frogX += SPACING;}
		break;
		case 38: // up arrow
		frogY -= SPACING;
		break;
		case 40: // down arrow
		if (frogY < 500) {frogY += SPACING;}
		break;
		case 82:
		gamestate = true;
		level = 0;
		frogX = 250;
		frogY = 250;
		vehicles.length = 0;
		document.getElementById("score").innerHTML = "0";
		document.getElementById("gameOver").innerHTML = "";
		loop();
		break;
	}
}
