class sudoku extends lockedCols{
    constructor(startData){
        super(); 
        this.cols = 0;
        this.rows = 0;
        this.solved = false;
        this.changes = 1;
        this.lastCell;
        this.sectionMap = ["right", "right", "down", "left", "left", "down", "right", "right", "right"];
        this.initializeBoard(startData);
    }
    
    initializeBoard(startData){
        for(let i=0; i< startData.length; i++){
            if(!this.start){
                let newCell = {
                    cell: `s${this.cols}${this.rows}`, 
                    value: startData[i] === "" ? [1,2,3,4,5,6,7,8,9] : startData[i],
                    left: null,
                    right: null,
                    prev: null,
                    next: null,
                    down: null,
                    up: null
                } 
                this.start = newCell;
                this.lastCell = newCell;
            } else {
                let newCell = {
                    cell: `s${this.cols}${this.rows}`, 
                    value: startData[i] === "" ? [1,2,3,4,5,6,7,8,9] : startData[i],
                    left: this.cols === 0 ? null : this.lastCell,
                    prev: this.lastCell,
                    next: null,
                    right: null,
                    down: null,
                    up: this.rows > 0 ? this.lastCell.prev.prev.prev.prev.prev.prev.prev.prev : null
                }
                if(this.rows > 0){this.lastCell.prev.prev.prev.prev.prev.prev.prev.prev.down = newCell;}
                if(this.cols > 0){this.lastCell.next = newCell;}
                if(this.cols !== 0){ this.lastCell.right = newCell; }
                
                this.lastCell.next = newCell;
                this.lastCell = newCell;
            }
            this.cols++;
            if(this.cols > 8){
                this.cols = 0;
                this.rows++;
            }
         }
    }

    drawBoard(){
        let prevHTML = document.getElementById("gBoard").innerHTML;
        document.getElementById("gBoard").innerHTML = "";
        let html = ""; 
        let curTarg = this.start;  
        while(curTarg){ 
            html += `<div class="square" id="${curTarg.cell}">`;
            if(Array.isArray(curTarg.value)){
                for( let i=0; i<curTarg.value.length; i++){
                    html += `<p class="tests">${curTarg.value[i]}</p>`;
                }
            } else{ 
                html += `<p class="answer">${curTarg.value}</p>`;
            }
            html += `</div>`;
            curTarg = curTarg.next; 
        } 
        document.getElementById("gBoard").innerHTML = html;
        if( html === prevHTML){ return 0} else{ return 1 } 
    };  
    colorCell(thisCell, color){
        document.getElementById(thisCell).style.backgroundColor = color;
    };
    rootLeft(targ){
        targ = targ;
        let hasTarg = targ;
        while(targ){ 
            hasTarg = targ.left === null ? hasTarg : targ.left;
            targ = targ.left;
        } 
        return hasTarg; 
    };
    rootTop(targ){
        targ = targ;
        let hasTarg = targ;
        while(targ){ 
            hasTarg = targ.up === null ? hasTarg : targ.up;
            targ = targ.up;
        } 
        return hasTarg; 
    };
    eliminateLines(){
        let curTarg = this.start;
        while(curTarg){
            if(!isNaN(curTarg.value)){
                let eliminateNum = curTarg.value;
                let goRight = this.rootLeft(curTarg); 
                while(goRight){ 
                    if(Array.isArray(goRight.value)){ goRight.value[eliminateNum -1] = "" }
                    goRight = goRight.right;
                } 
                let goDown = this.rootTop(curTarg); 
                while(goDown){ 
                    if(Array.isArray(goDown.value)){ goDown.value[eliminateNum -1] = "" }
                    goDown = goDown.down;
                }
            }

            curTarg = curTarg.next;
        }
    };
    eliminateSection(){
        let curTarg = this.start;
        let mainTrack = 0;

        while(mainTrack < 9){  
            let eliminateNums = [];
            let sectionTrack = curTarg; 
            for(let i=0; i<this.sectionMap.length; i++){
                if( !isNaN(sectionTrack.value) ){ eliminateNums.push(sectionTrack.value) } 
                sectionTrack = sectionTrack[`${this.sectionMap[i]}`]; 
            } 
            sectionTrack = curTarg;
            for(let i=0; i<this.sectionMap.length; i++){
                if( Array.isArray(sectionTrack.value) ){ eliminateNums.forEach(elim => { sectionTrack.value[elim -1] = "" }); } 
                sectionTrack = sectionTrack[`${this.sectionMap[i]}`]; 
            }  
            if(mainTrack === 2 || mainTrack === 5){
                curTarg = curTarg.down.down.down;
                curTarg = this.rootLeft(curTarg);
             } else{
                curTarg = curTarg.next.next.next;
            }
            mainTrack++;
        } 
    };
    extractAnswers(){
        let curTarg = this.start;
        while(curTarg){
            if(Array.isArray(curTarg.value)){
                let trys = 0;
                let lastTry;
                curTarg.value.forEach(element => {
                    if(element !== ""){ 
                        trys++;
                        lastTry = element;
                    }
                });
                if(trys === 1){
                    curTarg.value = lastTry;
                }
            }
            curTarg = curTarg.next;
        }
    };
    onlyInCol(){
        let curTarg = this.start;
        while(curTarg){
            let numbersCheck = {} 
            
            let rowTrack = curTarg;  
            while(rowTrack){
                if(Array.isArray(rowTrack.value)){
                    for(let i=0; i<rowTrack.value.length; i++){
                        if(rowTrack.value[i] !== ""){
                            if( numbersCheck[rowTrack.value[i]] ){
                                numbersCheck[rowTrack.value[i]] = "x";
                            } else {
                                numbersCheck[rowTrack.value[i]] = rowTrack.cell;
                            } 
                        }
                      }
                }
                rowTrack = rowTrack.down;
            } 
            for(let num in numbersCheck){  
                let updateTarg = numbersCheck[num];
                if(updateTarg !== "x"){
                    let updateTrack = this.rootTop(curTarg); 
                    while(updateTrack){ 
                        if(updateTrack.cell === updateTarg){
                            updateTrack.value = num;
                        }
                        updateTrack = updateTrack.down;
                    }
                }
            }

            curTarg = curTarg.right;
        }
    }
    onlyInRow(){
        let curTarg = this.start;
        while(curTarg){
            let numbersCheck = {} 
            let rowTrack = curTarg;  
            while(rowTrack){
                if(Array.isArray(rowTrack.value)){
                    for(let i=0; i<rowTrack.value.length; i++){
                        if(rowTrack.value[i] !== ""){
                            if( numbersCheck[rowTrack.value[i]] ){
                                numbersCheck[rowTrack.value[i]] = "x";
                            } else {
                                numbersCheck[rowTrack.value[i]] = rowTrack.cell;
                            } 
                        }
                      }
                }
                rowTrack = rowTrack.right;
            } 
            for(let num in numbersCheck){  
                let updateTarg = numbersCheck[num];
                if(updateTarg !== "x"){
                    let updateTrack = this.rootLeft(curTarg); 
                    while(updateTrack){ 
                        if(updateTrack.cell === updateTarg){
                            updateTrack.value = num;
                        }
                        updateTrack = updateTrack.right;
                    }
                }
            }

            curTarg = curTarg.down;
        }
    }
    onlyInSection(){
        let curTarg = this.start;
        let mainTrack = 0;

        while(mainTrack < 9){  
            let numbersCheck = {};
            let sectionTrack = curTarg; 
            for(let i=0; i<this.sectionMap.length; i++){
                if( Array.isArray(sectionTrack.value) ){
                    for(let i=0; i<sectionTrack .value.length; i++){
                        if(sectionTrack .value[i] !== ""){
                            if( numbersCheck[sectionTrack .value[i]] ){
                                numbersCheck[sectionTrack .value[i]] = "x";
                            } else {
                                numbersCheck[sectionTrack .value[i]] = sectionTrack .cell;
                            } 
                        }
                      }
                } 
                sectionTrack = sectionTrack[`${this.sectionMap[i]}`]; 
            } 
            sectionTrack = curTarg;
             
            for(let number in numbersCheck){
                sectionTrack = curTarg;
                for(let i=0; i<this.sectionMap.length; i++){
                    if( sectionTrack.cell === numbersCheck[number]) {
                        sectionTrack.value = number;
                    }
                    sectionTrack = sectionTrack[`${this.sectionMap[i]}`]; 
                }
            }

            if(mainTrack === 2 || mainTrack === 5){
                curTarg = curTarg.down.down.down;
                curTarg = this.rootLeft(curTarg);
             } else{
                curTarg = curTarg.next.next.next;
            }
            mainTrack++;
        } 
    };
    checkAnswer(){
        let curTarg = this.start;
        let color = ["red", "green", "blue", "yellow", "purple", "orange", "gray", "pink", "lightgreen"];
        let trackRow = 0;
        let errors = 0;
        while(curTarg){
            let rowSum = 0;  
            let rowTrack = curTarg;
            while(rowTrack){
                this.colorCell(rowTrack.cell, color[trackRow]);
                if(Array.isArray(rowTrack.value)){
                    errors++;
                }else{
                    rowSum = parseInt(rowSum) + parseInt(rowTrack.value);
                }
                rowTrack = rowTrack.right;
            }
            if(rowSum !== 45){ errors++ }; 
            trackRow++;
            if(errors === 0){
                curTarg = curTarg.down;
            } else {
                break;
            }
        }
        curTarg = this.start;
        trackRow = 0
        while(curTarg){
            let colSum = 0;  
            let colTrack = curTarg;
            while(colTrack){
                this.colorCell(colTrack.cell, color[trackRow]);
                if(Array.isArray(colTrack.value)){
                    errors++;
                }else{
                    colSum = parseInt(colSum) + parseInt(colTrack.value);
                }
                colTrack = colTrack.down;
            }
            if(colSum !== 45){ errors++ }; 
            trackRow++;
            if(errors === 0){
                curTarg = curTarg.right;
            } else {
                break;
            }
        }

        if( errors === 0){ 
            this.solved = true;
            return true;
        } else{
            return false;
        }
    }
    eliminateGroup(){
        this.eliminateSection();    
        this.eliminateLines();
    }
    gameLoop(){  
       while(this.changes > 0){  
            this.eliminateGroup();
            this.onlyInRow();   
            
            this.eliminateGroup();  
            this.onlyInCol();

            this.eliminateGroup();
            this.onlyInSection();

            this.eliminateGroup();
            this.extractAnswers();
 
            this.changes = this.drawBoard();  
        };
        this.lockedCols();
        this.deepFind(this); 
    }; 
}