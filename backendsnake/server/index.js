const WebSocket = require("ws");

const wss = new WebSocket.Server({port: 3000});

//snake
const unit = 20;
let gameOn = false;
let moveTo = 'd';
let appleExists = true;

let snake = {
    x: 0,
    y: 0,
    width: unit,
    height: unit,
    direction: "right",
    vel: unit, 
    parts: [],
};

let apple = {
    x: 0,
    y: 0,
}

let gameObject = {
    snake: snake,
    apple: apple
}

function gameEnd(){

    gameOn = false; 
}

function updateInput(data) {
    moveTo = data.moveTo;
    if(data.gameOn) startGame();
}

function packageGameData(){
    gameObject.snake = snake;
    gameObject.apple = apple;
}

function checkCollision(){
    for(let part of snake.parts){
        if(part.x == snake.x && part.y == snake.y){
            gameEnd();
        }
    }
    //jos menee yli rajojen
}

function checkApple(){
    if(snake.x == apple.x && snake.y == apple.y){
        snake.parts.push({x: 0, y:0})
        appleExists = false;
    }
}

function isLocationValid(tempX, tempY){
    let isValid = true;
    if(tempX * 20 == snake.x && tempY * 20 == snake.y) isValid = false;
    for(let part of snake.parts){
        if(tempX * 20 == snake.x && tempY * 20 == snake.y) isValid = false;
    }
    if(tempX == 20 || tempY == 20) isValid = false; 
    return isValid;
}

function generateApple(){
    let isLocationAllowed = false;
    let tempX;
    let tempY;
    while(!isLocationAllowed){
        tempX = Math.floor(Math.random()*20);
        tempY = Math.floor(Math.random()*20);
        isLocationAllowed = isLocationValid(tempX, tempY);
    }
    apple.x = tempX * 20;
    apple.y = tempY * 20;
    appleExists = true;
}

function createSnake(){
   snake.x = 100;
   for(let i = 80; i >= 0; i -= 20){
        snake.parts.push({x: i, y: 0});
   } 
}

function movePlayer(){

    for(let i = snake.parts.length - 1; i >= 0; i--){
        if(i == 0){
            snake.parts[i].x = snake.x;
            snake.parts[i].y = snake.y; 
        }
        else{
            snake.parts[i].x = snake.parts[i-1].x;
            snake.parts[i].y = snake.parts[i-1].y;
        }
    }

    switch(moveTo){
        case('w'):
        snake.y -= snake.vel;
        snake.direction = "up";
        break;

        case("s"):
        snake.y += snake.vel;
        snake.direction = "down";
        break;

        case("a"):
        snake.x -= snake.vel;
        snake.direction = "left";
        break;

        case("d"):
        snake.x += snake.vel;
        snake.direction = "right";
        break;
    }
}

function mainLoop(){
    if(!gameOn) return;
    
    checkApple();
    movePlayer();
    checkCollision();

    if(!appleExists) generateApple();

    packageGameData();

    setTimeout(mainLoop, 300);
}

function startGame(){
    if(gameOn) return;
    console.log("game started");
    gameOn = true;
    createSnake();
    generateApple();
    mainLoop();
}

//server

wss.on("connection", ws => {
    console.log("connected");

    //input objekti
    ws.on("message", (data) => {
        console.log(`vastaanotettu: ${data}`);
        inputObject = JSON.parse(data);
        updateInput(inputObject);
        ws.send(JSON.stringify(gameObject));
    }); 

    ws.on("close", () => {
        console.log("disconnected");
    });
})