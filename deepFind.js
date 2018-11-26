class deepFind{

    constructor(){
        this.boardArray = [];
        this.solvedPuzzle = [];
        this.solved = false;
    }

    buildStartArray(curTarg){
        this.boardArray.push( Array.isArray(curTarg.value) ? curTarg.value.filter(sq => sq !== "") :  parseInt(curTarg.value));
        if(curTarg.next){
            this.buildStartArray(curTarg.next);
        }else{
            return null;
        }
    }

    deepFind( board ){
        let curTarg = board.start;
        this.buildStartArray(curTarg);

        let bruteSolve = (array, curSquare, col, row) => {  
            if(curSquare > array.length){ return array; } 
            if(this.solved){ 
                return null;
            }

 
            //find next array
            for(let i=curSquare; i<81; i++){

                if( i === 80 && !Array.isArray(array[80])){
                    this.solved = true;
                    this.solvedPuzzle = array;
                    return null;
                }

                if(Array.isArray(array[i])){
                    if(array[i].length === 0){ return null; } 
                    array[i].forEach(tryNum =>{
                        let tArray = [...array]; 
                        tArray[i] = parseInt(tryNum); 
                        //delete row  
                        let rootRow = i-col;
                        for(let j=rootRow; j<rootRow+9; j++ ){ 
                            if(Array.isArray(tArray[j])){ 
                                tArray[j] = tArray[j].filter(num => {
                                    return(num !== tryNum);
                                }); 
                            }
                        }
                        //deletecolumn
                        for(let j=col; j<81; j=j+9){
                            if(Array.isArray(tArray[j])){
                                tArray[j] = tArray[j].filter(num => num !== tryNum); 
                            }
                        }  
                        //deletesection 
                        let rootSec = (curCol, curRow, squareNum) =>{  
                            let subCol = curCol % 3; 
                            let subRow = curRow % 3;  
                            let secStart = squareNum - subCol; 
                            secStart = (secStart) - (subRow * 9);
                           return secStart;
                        } 
 
                        let sectionScan = rootSec(col, row, i);  

                        let secTrack = 0;
                        for(let j=0; j < 9; j++){ 
                            if(Array.isArray(tArray[sectionScan])){
                                tArray[sectionScan] = tArray[sectionScan].filter(num => num !== tryNum); 
                            }
                            secTrack++;
                            sectionScan++;
                            if(secTrack === 3){
                                secTrack = 0;
                                sectionScan = sectionScan + 6;
                            }

                        }


                        bruteSolve(tArray, i, col, row); 
                    });
                    break;
                }

                col++;
                if( col > 8 ){
                    col = 0;
                    row++;
                }

            } //End find next array
        } // End brute Solve
 
        bruteSolve(this.boardArray, 0, 0, 0);
        if( this.solvedPuzzle.length > 0){ console.log(this.solvedPuzzle); }
        
        let updateObs = this.start;
        let arrTrack = 0;
        while(updateObs){
            updateObs.value = this.solvedPuzzle[arrTrack];
            updateObs = updateObs.next;
            arrTrack++;
        }
        
        this.drawBoard();  
    }
}