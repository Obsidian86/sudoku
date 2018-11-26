class lockedCols extends deepFind{
    lockedCols(){ 
        let curTarg = this.start;
        let mainTrack = 0 
        while(mainTrack < 9){ 
        let curHead = curTarg;
        let allNums = [1,2,3,4,5,6,7,8,9];
        //this.colorCell(curHead.cell, "blue");
         
        for(let i=0; i<this.sectionMap.length; i++){ 
            if(!Array.isArray(curHead.value)){  
                allNums = allNums.filter(num => num !== parseInt(curHead.value) ); 
            }
            curHead = curHead[this.sectionMap[i]];
        }
        
        let limit = 20;  
        while(allNums.length > 0){
            
            let checkNum = allNums[0];
            let foundCount = [0,0,0];
            curHead = curTarg;
            /*
            for(let cols=0; cols<3; cols++){
                let colHead = curHead; 
                for(let i=0; i<3; i++){  
                    if(Array.isArray(colHead.value)){ 
                        let findNum = colHead.value.filter(num => checkNum === parseInt(num));
                        if(findNum > 0){  
                            foundCount[cols]++; 
                         } 
                    } 
                    colHead = colHead.down;
                }
                curHead = curHead.right;
            } */
            //if(foundCount < 2){ 
                // DELETE ALL COLUMNS HERE
                // DELETE ALL COLUMNS HERE
                // DELETE ALL COLUMNS HERE
              //  console.log("SOMETHING FOUND " + checkNum + " in " + curTarg.cell);  
               //break;
            //}
            
            foundCount = [0, 0, 0]; 
            curHead = curTarg;
            for( let rows = 0; rows < 3; rows++){
                let rowHead = curHead;
                for( let i=0; i<3; i++){
                    //this.colorCell(rowHead.cell, "red");
                    if(Array.isArray(rowHead.value)){ 
                        let findNum = rowHead.value.filter(num => checkNum === parseInt(num));
                        if(findNum > 0){  
                            foundCount[rows]++; 
                         } 
                    } 
                    rowHead = rowHead.right;
                }
                curHead = curHead.down;
            } 
            //Removes first number in array
            allNums.shift(); 

            //temp - avoids forever loop
            limit--;
            if(limit === 0){ break; }
        } 
        
 
        //Moves curTarg
        if(mainTrack === 2 || mainTrack === 5){
            curTarg = curTarg.down.down.down;
            curTarg = this.rootLeft(curTarg);
         } else{
            curTarg = curTarg.next.next.next;
         }
        mainTrack++; 
      }
    }
}