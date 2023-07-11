//board
let board;
let boardWidth = 500;
let boardHeight = 700;
let context;
let counter=0;
let health = 3;
let gameover = false;
let highestScore = 0;

// bullet
let bullet = null;
let bulletSpeed = 5;
let bulletWidth = 20;
let bulletHeight = 20;
let bulletImg;

// herocar
let carWidth = 100;
let carHeight = 100;
let carX = boardWidth / 2.5;
let carY = boardHeight / 1.15;
let carImg;
let enemyCarImg;

let car = {
  x: carX,
  y: carY,
  width: carWidth,
  height: carHeight
};

let enemyCars = [];
let barricades = [];

window.onload = function () {
  board = document.getElementById('board');
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext('2d');

  // load car image
  carImg = new Image();
  carImg.src = "./images/car1.png";
  enemyCarImg = new Image();
  enemyCarImg.src = "./images/car2.png";
  barrImg = new Image();
  barrImg.src = "./images/barricade.png"
  carImg.onload = function () {
    context.drawImage(carImg, car.x, car.y, car.width, car.height);
  };

  document.addEventListener("keydown", moveCar);
  

// fire bullet
  document.addEventListener("keydown", fireBullet);

  // Generate enemy cars at random intervals
  setInterval(generateEnemyCar, Math.random() * 2000 + 1000);
  // Generate barricade at random intervals
  setInterval(generateBarricade,Math.random()*2000 + 1000);


  // Load the highest score from local storage
getHighestScore();
  // Start the game loop
  gameLoop();

  
};

function moveCar(e) {
  if (e.keyCode === 37 || e.keyCode === 65) {
    car.x -= 25;
    if (car.x < 0) {
      car.x = 0;
    }
  } else if (e.keyCode === 39 || e.keyCode === 68) {
    car.x += 25;
    if (car.x + car.width > boardWidth) {
      car.x = boardWidth - car.width;
    }
  }
  if (e.keyCode ===38 || e.keyCode === 87 ){
    car.y-=25;
    if(car.y < 0){
      car.y = 0;
    }
  }
  if (e.keyCode === 40 || e.keyCode === 83){
    car.y+=25;
    if (car.y + car.height > boardHeight){
      car.y = boardHeight - car.height; 
    }
  }

  // Clear the canvas
  context.clearRect(0, 0, board.width, board.height);

  // Redraw the car at the updated position
  context.drawImage(carImg, car.x, car.y, car.width, car.height);
}




// fire bullet
function fireBullet(e) {
  if (e.keyCode === 32) {
    // Check if a bullet is already fired
    if (bullet !== null) {
      return;
    }

    // Create a new bullet object
    bullet = {
      x: car.x + car.width / 2 - bulletWidth / 2,
      y: car.y - bulletHeight,
      width: bulletWidth,
      height: bulletHeight
    };
    fireBulletsound();
  }
}

function moveBullet() {
  // Check if a bullet is fired
  if (bullet !== null) {
    // Update the bullet position
    bullet.y -= bulletSpeed;

    // Check if the bullet goes beyond the canvas boundaries
    if (bullet.y + bullet.height < 0) {
      // Reset the bullet
      bullet = null;
    }
  }
}

function generateEnemyCar() {
  let enemyCarWidth = 100;
  let enemyCarHeight = 100;
  let enemyCarX = Math.random() * (boardWidth - enemyCarWidth);
  let enemyCarY = -enemyCarHeight;

  let enemyCar = {
    x: enemyCarX,
    y: enemyCarY,
    width: enemyCarWidth,
    height: enemyCarHeight
  };

  enemyCars.push(enemyCar);
}

function drawEnemyCars() {
  for (let i = 0; i < enemyCars.length; i++) {
    let enemyCar = enemyCars[i];

    enemyCar.y += 5; // Adjust the speed of enemy cars

    context.drawImage(enemyCarImg, enemyCar.x, enemyCar.y, enemyCar.width, enemyCar.height);

    // Check collision between hero car and enemy car
    if (collisionDetection(car, enemyCar)) {
      // Handle collision
      console.log("Collision detected!");
      // collision sound
      collisionsound();
      // Remove the enemy car from the array
      enemyCars.splice(i,1);
      i--;
      //Decrease the health 
      if(health<= 0){
        console.log("Stop the game here.");
        //Gameover 
        gameOver();
      }
      else{
        health -=1;
      } 
    }
    

    // Check collision between bullet and enemy car
    if (bullet !== null && collisionDetection(bullet, enemyCar)) {
      // Handle collision
      console.log("Bullet collided with enemy car!");
      // Remove the enemy car from the array
      enemyCars.splice(i, 1);
      i--;
      // Reset the bullet
      bullet = null;
      // Increase the counter
      counter++;
    }

    // ...

    // Remove enemy car if it goes beyond the canvas
    if (enemyCar.y > boardHeight) {
      enemyCars.splice(i, 1);
      i--;
      counter +=1;
      console.log(counter);
    }
  }
}

// generate barricade
function generateBarricade(){
  let barricadeWidth = 100;
  let barricadeHeight = 100;
  let barricadeX = Math.random() * (boardWidth - barricadeWidth);
  let barricadeY = -barricadeHeight;

  let barricade = {
    x: barricadeX,
    y: barricadeY,
    width: barricadeWidth,
    height: barricadeHeight
  };

  barricades.push(barricade);
}
// draw barricade
function drawBarricade(){
  for(let i=0; i<barricades.length ; i++){
    let barricade = barricades[i];
    barricade.y +=5;

    context.drawImage(barrImg, barricade.x,barricade.y, barricade.width, barricade.height)

    if (collisionDetection(car, barricade)) {
      // Handle collision
      console.log("Collision detected!");
      collisionsound();
      // Remove the enemy car from the array
      barricades.splice(i,1);
      i--;
      //Decrease the health 
      if(health<= 0){
        console.log("Stop the game here.");
        //Gameover 
        gameOver();
      }
      else{
        health -=1;
      } 
    }
    
  }

 
}

// Restart the game
function restartGame() {
  // Reset game variables
  counter = 0;
  health = 3;
  gameover = false;
  enemyCars = [];
  barricades = [];

    // Remove restart button and highest score
    let restartButton = document.querySelector("button");
    let highestScoreText = document.querySelector(".highest-score");
    restartButton.parentNode.removeChild(restartButton);
    highestScoreText.parentNode.removeChild(highestScoreText);
  
    // Start the game loop
  gameLoop();
}


// Create a CSS class for the restart button and highest score
const restartButtonClass = "restart-button";
const highestScoreClass = "highest-score";

// Add the restart button
function addRestartButton() {
  // Create the restart button
  let restartButton = document.createElement("button");
  restartButton.innerText = "Restart";
  restartButton.classList.add(restartButtonClass);
  restartButton.addEventListener("click", restartGame);
  document.body.appendChild(restartButton);
}

// Style the restart button
function styleRestartButton() {
  let restartButton = document.querySelector("." + restartButtonClass);
  restartButton.style.position = "absolute";
  restartButton.style.top = boardHeight / 2 + 50 + "px";
  restartButton.style.left = boardWidth / 2 - 75 + "px";
  restartButton.style.width = "150px";
  restartButton.style.height = "50px";
  restartButton.style.backgroundColor = "red";
  restartButton.style.color = "white";
  restartButton.style.fontSize = "24px";
  restartButton.style.border = "none";
  restartButton.style.borderRadius = "10px";
  restartButton.style.cursor = "pointer";

  let highestScoreText = document.querySelector("." + highestScoreClass);
  highestScoreText.style.position = "absolute";
  highestScoreText.style.top = boardHeight / 2 - 50 + "px";
  highestScoreText.style.left = boardWidth / 2 - 100 + "px";
  highestScoreText.style.fontSize = "48px";
  highestScoreText.style.color = "white";
}

// gameover function 
function gameOver(){
  gameover = true;
   // Clear the canvas
   context.clearRect(0, 0, board.width, board.height);

   // Display game over message
   context.font = "30px Arial";
   context.fillStyle = "Red";
   context.fillText("Game Over - Score: " + counter, boardWidth / 2 - 100, boardHeight / 2);
 

  // Check if the current score is higher than the highest score
  if (counter > highestScore) {
    highestScore = counter;
    // Save the new highest score to local storage
    saveHighestScore();
  }

  // Display highest score
  let highestScoreText = document.createElement("div");
  highestScoreText.classList.add(highestScoreClass);
  highestScoreText.innerText = "Highest Score: " + highestScore;
  document.body.appendChild(highestScoreText);

  // Display highest score
  context.font = "20px Arial";
  context.fillStyle = "White";
  context.fillText(
    "Highest Score: " + highestScore,
    boardWidth / 2 - 90,
    boardHeight / 2 + 30
  );
   // Display restart button
   addRestartButton();
  styleRestartButton();
  
 }
 
 // Restart the game
 function restartGame() {
   // Reset game variables
   counter = 0;
   health = 3;
   gameover = false;
   enemyCars = [];
   barricades = [];
 
   // Remove restart button
   let restartButton = document.querySelector("button");
  let highestScoreText = document.querySelector(".highest-score");
  restartButton.parentNode.removeChild(restartButton);
  highestScoreText.parentNode.removeChild(highestScoreText);
   // Start the game loop
   gameLoop();
}

// Save the highest score to local storage
function saveHighestScore() {
  localStorage.setItem("highestScore", highestScore);
}

// Retrieve the highest score from local storage
function getHighestScore() {
  const savedHighestScore = localStorage.getItem("highestScore");
  if (savedHighestScore) {
    highestScore = parseInt(savedHighestScore);
  }
}


function collisionDetection(car1, car2) {
  // Implement your collision detection logic here
  // For example, you can use bounding box collision detection
  return (car1.x < car2.x + car2.width &&
         car1.x + car1.width > car2.x &&
         car1.y < car2.y + car2.height &&
         car1.y + car1.height > car2.y);    
}

// fireBullet sound
function fireBulletsound(){
  var audio = new Audio("./audio/bulletfire.mp3");
  audio.play();
}
// collision sound
function collisionsound(){
  var audio = new Audio("./audio/carcollision.mp3");
  audio.play();
}

// Update the canvas at a fixed frame rate
function gameLoop() {
  // Move the bullet
  moveBullet();

  // Clear the canvas
  context.clearRect(0, 0, board.width, board.height);

  // Draw the player car
  context.drawImage(carImg, car.x, car.y, car.width, car.height);

  // Draw the bullet if fired
  if (bullet !== null) {
    // context.fillStyle = "red";
    bulletImg = new Image();
    bulletImg.src = "./images/fire.png";
    context.drawImage(bulletImg,bullet.x, bullet.y, bullet.width, bullet.height);

    // context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  }

    // Draw the enemy cars and check collisions
    drawEnemyCars();

    // Barricade
    drawBarricade();

      // Stop the game
  if(gameover){
    return;
  }

  // Draw the counter on the canvas
  context.font = "24px Arial";
  context.fillStyle = "white";
  context.fillText("Score: " + counter, 10, 30);

  // Draw the health on the canvas
  context.font = "24px Arial";
  context.fillStyle = "white";
  context.fillText("Health:" + health, 10,60);

   // Draw the highest score on the canvas
   context.font = "24px Arial";
   context.fillStyle = "white";
   context.fillText("Highest Score: " + highestScore, 10, 90);

  requestAnimationFrame(gameLoop);
}
