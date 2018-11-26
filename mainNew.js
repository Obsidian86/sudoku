const boardSize = () =>{ 
    let size = window.innerWidth  < 950 ? 500 : window.innerWidth - 500;
    if(window.innerWidth  > 1200){ size = 750; } 
    document.getElementById("gBoard").style.width = size + "px";
    document.getElementById("gBoard").style.height = size + "px";
    document.getElementById("gBoard").style.fontSize = 16 + "px";
}

const inputBoard = () => {
    let board = ""; 
    let trackCol = 0;
    let trackRow = 0;
    for(let i=0; i<81; i++){
        board += `<div class="square" id="s${trackCol}${trackRow}"><input type="text" class="inputNumber" /></div>`;
        trackCol++;
        if(trackCol === 9){
            trackCol = 0;
            trackRow++;
        }
    }
    board += "<p class='clear'></p>";
    document.getElementById("gBoard").innerHTML = board;
}

document.getElementById("solve").addEventListener("click", () => {
    document.getElementById("solve").style.display = "none"; 
    let startArray = [];
    let numbers = document.getElementsByClassName("inputNumber");  
    for(let i=0; i<numbers.length; i++){
        if(numbers[i].value){
            startArray.push(parseInt(numbers[i].value));
        }else{
            startArray.push("");
        }
    }  
    let startGame = new sudoku(startArray); 
    startGame.gameLoop();
 
});

inputBoard();
boardSize();

window.addEventListener("resize", () => { boardSize(); });







