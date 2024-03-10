let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let birdwidth=34;
let birdHeight=24;
let birdX=boardWidth/8;
let birdY=boardHeight/2;


let bird= {
     x: birdX,
     y: birdY,
     height:birdHeight,
     width: birdwidth



}

let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;




window.onload = function(){
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext("2d");

    birdImg= new Image();
    birdImg.src="./flappybird.png";
    birdImg.onload= function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg=new Image();
    topPipeImg.src="./toppipe.png";
    bottomPipeImg=new Image();
    bottomPipeImg.src="./bottompipe.png";
    requestAnimationFrame(update);
    setInterval(placepipes,1500);
    document.addEventListener("keydown",moveBird);
    document.addEventListener("click",movclick);
}


//main game function which operates the control..
function update(){
    
    requestAnimationFrame(update);
    if(gameOver)
        return;
    context.clearRect(0,0,board.width,board.height);
    //generating new bird
    velocityY+=gravity;
    bird.y=Math.max(bird.y+velocityY,0);
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y>boardHeight)
        gameOver=true;
    //generating pipes..
    for(let i=0;i<pipeArray.length;i++){
        pipeArray[i].x+=velocityX;
        context.drawImage(pipeArray[i].img,pipeArray[i].x,pipeArray[i].y,pipeArray[i].width,pipeArray[i].height);
        if(!pipeArray[i].passed && bird.x>pipeArray[i].x+pipeArray[i].width){
            score+=0.5;
            pipeArray[i].passed=true;
        }

        if(detectCollision(bird,pipeArray[i]))
            gameOver=true;

    }

    while(pipeArray.length>0 && pipeArray[0].x<-pipeWidth){
        pipeArray.shift();
    }

    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placepipes(){
    //topheight places the pipe accurately here (0,0) denotes the top left corner of the board now initially pipeY
    //is 0, now hence topheight varies from (-3*pipeHeight/4) to (-1*pipeHeight/4)
    if(gameOver)
        return;
    let topheight=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let topPipe={
        img: topPipeImg,
        x: pipeX,
        y: topheight,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }

    pipeArray.push(topPipe);

    let bottomPipe={
        img: bottomPipeImg,
        x: pipeX,
        y: topheight+pipeHeight+pipeHeight/4,
        width: pipeWidth,
        height: pipeHeight,
        passed: false

    }

    pipeArray.push(bottomPipe);







}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.code== "click") {
        //jump
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }

}

function movclick(e) {
   
        //jump
        
        velocityY = -6;

        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }

    
    

}
