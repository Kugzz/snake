const canvas = document.getElementById("snakegame");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startbutton");
const unit = 20;

const ws = new WebSocket("ws://localhost:3000");

let gameOn = false;
let moveTo = 'd';
let inputObject = {
    gameOn: false,
    moveTo: 'd'
}
let gameObject = {
    snake: {
        x: 0,
        y: 0,
        width: unit,
        height: unit,
        direction: "right",
        vel: unit, 
        parts: []
    },
    apple: {
        x: 0,
        y: 0,
    }
};

let packageGame = () => {
    inputObject.gameOn = gameOn;
    inputObject.moveTo = moveTo; 
}

let updateGameData = ({data}) => {
    gameObject = JSON.parse(data);
}

let drawCanvas = () => {
    ctx.beginPath();

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "red";
    ctx.fillRect(gameObject.apple.x, gameObject.apple.y, unit, unit);

    ctx.fillStyle = "green";
    ctx.fillRect(gameObject.snake.x, gameObject.snake.y, unit, unit);

    for(let part of gameObject.snake.parts){
        ctx.fillRect(part.x, part.y, unit, unit);
    }
    ctx.fill();
    ctx.closePath();
}

let registerUserInput = (e) => {
    if(e.key == 'w' && gameObject.snake.direction == "down") return;
    if(e.key == 's' && gameObject.snake.direction == "up") return;
    if(e.key == 'a' && gameObject.snake.direction == "right") return;
    if(e.key == 'd' && gameObject.snake.direction == "left") return;

    moveTo = e.key;
} 

let main = () => {

    packageGame();
    ws.send(JSON.stringify(inputObject));
    drawCanvas();

    if(gameOn) setTimeout(main, 100);
}

let startGame = () => {
    if(gameOn){
        //gameOn = false;
        //return;
    }
    gameOn = true;
    main();
}

ws.addEventListener("message", updateGameData);

window.addEventListener("keydown", registerUserInput); 
window.addEventListener("mousedown", startGame);
