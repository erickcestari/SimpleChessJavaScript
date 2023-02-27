const canvas = document.querySelector('.myCanvas')
const context = canvas.getContext("2d");
const canvasWidth = canvas.clientWidth
const canvasHeight = canvas.clientHeight
const disLine = canvasWidth / 8
const allPieces = []
let rect = canvas.getBoundingClientRect()
let indexY = 0
let indexX = 0
let player = 1
let control = undefined;
const audio = new Audio('pieces/pedra.mp3');
let whiteRock = true;
let blackRock = true;
/*
console.log(canvas.offsetWidth)
console.log(canvas.clientLeft)
console.log(canvas.clientTop)
console.log(disLine)
*/
table = function()
{
    
    let letters = ['a','b','c','d','e','f','g','h']
    for(let i = 0; i < 8; i++)
    {
        
        for(let j= 0; j <8; j++){
            let x1 = j * disLine
            let y1 = i * disLine
            let x2 = x1 + disLine - disLine * j
            let y2 = y1 + disLine - disLine * i
            const squareIndex = (i *8 + j ) + 1
            if((squareIndex + i)% 2 == 0){
                
                context.fillStyle = '#255';
                if(indexY == i && indexX == j) context.fillStyle = 'red';
                context.fillRect(x1 , y1, x2, y2);
            
            }
            else
            {
                context.fillStyle = '#fff';
                if(indexY == i && indexX == j) context.fillStyle = 'red';
                context.fillRect(x1 , y1, x2, y2);
            }
            if(j == 7)
            {
                context.font = "16px Roboto sans-serif";
                
                i % 2 == 0 ? context.fillStyle = 'white' : context.fillStyle = "#255";
                context.textAlign = "center";
                context.fillText(i, x1 + disLine - 10, y1 + disLine - 80);
            }
            if(i == 7){
                context.font = "16px Roboto sans-serif bold";
                j % 2 == 0 ? context.fillStyle = 'white' : context.fillStyle = "#255";
                context.textAlign = "center";
                context.fillText(letters[j], x1 + disLine - 10, y1 + disLine - 10);
            }
        }
    }
}

class Pieces{
    id = allPieces.length
    img = new Image()
    x = 0;
    y = 0;
    source = 'pieces/king.png'
    type = 0
    check(){
        for(i of allPieces){
            if(i.x == indexX && indexY == i.y && this.type != i.type)
            {
                delete allPieces.splice(allPieces.indexOf(i),1)   
                return true
                
            }
            else if(i.x == indexX && indexY == i.y && this.type == i.type){
                return false
            }
            
        }
        return true;
    }
    draw(){
        if(control == this.id){
            let x2 = this.x * disLine + disLine - disLine * this.x
            let y2 = this.y  * disLine+ disLine - disLine * this.y
            context.fillStyle = 'lightgreen';
            context.fillRect(this.x  * disLine, this.y * disLine, x2, y2);

        }
        this.img.src = this.source
        context.drawImage(this.img, this.x * disLine, this.y * disLine, 100, 100);
    }
    move(){
        
        
    }
    
}
class King extends Pieces{
    x = 4
    dirTower = undefined
    leftTower = undefined
    checkRock(){
        if(this.type == 0 && blackRock == false) return false;
        if(this.type == 1 && whiteRock == false) return false;
        if(Math.abs(indexX - this.x) == 1) return false;
        if(Math.abs(indexX - this.x) >=3) return false
        if(this.x == indexX) return false;
        if(this.y != indexY) return false
        for(i of allPieces){
            
            if(indexX - this.x == 2){
                for(let l = this.x + 1; l < indexX + 1; l++){
                    if(i.x == l && i.y == this.y) return false;
                }
            }
            else if (this.x -indexX == 2){
                for(let l = this.x - 1; l > indexX - 2; l--){
                    if(i.x == l && i.y == this.y) return false;
                }
            }
            
        }
        return true;
    }
    move(){
        if(indexY == this.y && indexX == this.x && this.type == player){
            control = this.id;
            console.log(player)
        }
        if(control == this.id && this.type == player){
            
            let dis = Math.sqrt(Math.pow((this.x - indexX),2) + Math.pow(this.y - indexY,2))
            if(Math.floor(dis)==1 && this.check())
            {
                audio.play();
                this.x = indexX
                this.y = indexY
                player = this.type == 0 ? 1:0
                this.type == 0 ? blackRock = false : whiteRock = false;
                
            }
            else if (this.checkRock()){
                if(indexX - this.x > 0){
                    audio.play();
                    audio.play();
                    this.x = this.x + 2;
                    this.dirTower.x = this.dirTower.x - 2
                    this.type == 0 ? blackRock = false : whiteRock = false;
                    player = this.type == 0 ? 1:0
                }
                else{
                    audio.play();
                    audio.play();
                    this.x = this.x - 2;
                    this.leftTower.x = this.leftTower.x + 3
                    this.type == 0 ? blackRock = false : whiteRock = false;
                    player = this.type == 0 ? 1:0
                }
            }
            
            
        }
    }
}

class Pawn extends Pieces{
    y = 1
    source = 'pieces/pawn.png'
    firstMove = true;
    check(){
        for(i of allPieces){
            let move = this.y + 2 == indexY && this.firstMove == true ? 2 : 1
            if(i.x == indexX && indexY == i.y && this.type == i.type)
            {  
                return false
                
            }
            if(i.x == indexX && indexY == i.y && this.type != i.type && i.y == this.y +move && this.x == i.x)
            {  
                return false
                
                
            }
            if(i.x == indexX && indexY == i.y && this.type != i.type && i.y == this.y -move && this.x == i.x)
            {  
                return false
                
            }
        }
        return true;
    }
    move(){
        if(indexY == this.y && indexX == this.x && this.type == player){
            control = this.id
        }
        if(control == this.id && this.type == player){
            let disy = this.type == 0 ? this.y + 1 : this.y -1;
            let change = this.type == 0 ? + 1 : -1;
            if(indexY == disy && this.check())
            {
                if(indexX != this.x)
                {
                    for(i of allPieces){
                        if(indexX == i.x && indexY == i.y && this.type != i.type && i.x + 1 == this.x){
                            delete allPieces.splice(allPieces.indexOf(i),1)  
                            audio.play();
                            this.x = indexX
                            this.y = indexY
                            player = this.type == 0 ? 1:0
                            this.firstMove = false;
                        }
                        else if (indexX == i.x && indexY == i.y && this.type != i.type && i.x - 1 == this.x){
                            delete allPieces.splice(allPieces.indexOf(i),1)  
                            audio.play();
                            this.x = indexX
                            this.y = indexY
                            player = this.type == 0 ? 1:0
                            this.firstMove = false;
                        }
                        ;
                    }
                }
                else{
                this.firstMove = false;
                audio.play();
                this.x = indexX
                this.y = indexY
                player = this.type == 0 ? 1:0
                }
            }
            else if (this.firstMove === true && disy + change  == indexY&& this.check()){
                audio.play();
                this.x = indexX
                this.y = indexY
                player = this.type == 0 ? 1:0
                this.firstMove = false;
            }
            
            
        }
        if(this.y == 7 || this.y == 0){
            delete allPieces.splice(allPieces.indexOf(this),1)  
            let queen = new Queen()
            queen.type = this.type;
            queen.source = this.type == 0 ? 'pieces/queen.png':'pieces/queenw.png'
            queen.y = this.y
            queen.x = this.x
            queen.id = this.id
            allPieces.push(queen)

        }
    }
}

class Tower extends Pieces{
    x = 0
    source = 'pieces/tower.png'
    check(){
        for(i of allPieces){
            if(indexX != this.x && indexY != this.y) {return false;}
            if(indexX == this.x && indexY == this.y) {return false;}
            //impedi ir para a direita
            for(let l = this.x + 1; l < indexX; l++){
                if(l == i.x && indexX != i.x && i.y == this.y) {return false; }
            }
            //impedi ir para baixo
            for(let c = this.y + 1 ; c < indexY; c++){
                if(c == i.y && indexY != i.y && i.x == this.x) { return false;}
            }
            for(let k = this.x - 1; k > indexX; k--){
                if(k == i.x && indexX != i.x && i.y == this.y) {return false;}
            }
            for(let a = this.y - 1; a > indexY; a--){
                if(a == i.y && indexY != i.y && i.x == this.x) {return false;}
            }
            if(indexX == i.x && indexY == i.y && this.type == i.type) return false;
            
        }
        return true;
    }
    move(){
        if(indexY == this.y && indexX == this.x && this.type == player){
            control = this.id;
        }
        
        if(control == this.id && this.type == player){
            if(this.check())
            {
                for(i of allPieces) if(indexX == i.x && indexY == i.y && this.type != i.type) delete allPieces.splice(allPieces.indexOf(i),1)
                audio.play();
                this.x = indexX
                this.y = indexY
                player = this.type == 0 ? 1:0
                this.type == 0 ? blackRock = false : whiteRock = false;
            }
            
            
        }
        
    }
}

class Knight extends Pieces{
    x = 1
    source = 'pieces/knight.png'
    check(){
        for(i of allPieces){
            if(indexX == this.x +1 && indexY == this.y + 2) return true
            if(indexX == this.x +1 && indexY == this.y - 2) return true
            if(indexX == this.x -1 && indexY == this.y + 2) return true
            if(indexX == this.x -1 && indexY == this.y - 2) return true

            if(indexX == this.x + 2 && indexY == this.y + 1) return true
            if(indexX == this.x + 2 && indexY == this.y - 1) return true
            if(indexX == this.x - 2 && indexY == this.y + 1) return true
            if(indexX == this.x - 2 && indexY == this.y - 1) return true
        }
        
        return false;
    }
    move(){
        if(indexY == this.y && indexX == this.x && this.type == player){
            control = this.id;
        }
        
        if(control == this.id && this.type == player){
            if(this.check())
            {
                let t = true
                for(i of allPieces) {
                    if(indexX == i.x && indexY == i.y && this.type != i.type)delete allPieces.splice(allPieces.indexOf(i),1)
                    if(indexX == i.x && indexY == i.y && this.type == i.type) {t = false ;}
                }
                if(t)
                {
                    audio.play();
                    this.x = indexX
                    this.y = indexY
                    player = this.type == 0 ? 1:0
                }
                
                
            }
            
            
        }
        
    }
}
class Bishop extends Pieces{
    x = 2
    source = 'pieces/bishop.png'
    check(){
        let test = true
        if(indexY == this.y && indexX == this.x) test = false;
        let squareIndex = (this.x  + this.y *8) + 1
        let clickedIndex = (indexX + indexY * 8) + 1
        console.log(squareIndex - clickedIndex)
        if(Math.abs(squareIndex - clickedIndex) % 9 == 0 && indexX != this.x && Math.abs(squareIndex - clickedIndex) != 49|| Math.abs(squareIndex - clickedIndex) % 7 == 0 &&indexX != this.x && Math.abs(squareIndex - clickedIndex) != 49)
        {
        for(i of allPieces){
            let counter = 0
            //direita baixo problema
            if(indexX > this.x && indexY > this.y)
            {
                for(let c = this.x ; c < indexX - 1; c++){
                    counter++
                    
                    if(this.y + counter == i.y && this.x + counter == i.x && i.id != this.id) {test = false;}
                    
                }
            }
            counter = 0
            //esquerda cima problema
            if(indexX < this.x && indexY < this.y)
            {
                
                for(let c = this.x ; c > indexX + 1 ; c--){
                    counter++
                    console.log('x' + (this.x - counter) + 'y' + (this.y - counter))
                    if(this.y  - counter == i.y && this.x - counter == i.x && i.id != this.id) {test = false;}
                    
                }
            }
            counter = 0
            //direita cima
            if(indexX > this.x && indexY < this.y)
            {
                for(let c = this.x ; c < indexX -1 ; c++){
                    counter++
                    
                    if(this.y - counter == i.y && this.x + counter == i.x && i.id != this.id) {test = false;}
                    
                }
            }
            //esquerda baixo
            counter = 0
            if(indexX < this.x && indexY > this.y)
            {
                for(let c = this.x ; c > indexX + 1 ; c--){
                    counter++
                    if(this.y  + counter == i.y && this.x - counter == i.x && i.id != this.id) {test = false;}
                    
                }
            }
            
        }
    }
    else return false
        
        return test;
    }
    move(){
        if(indexY == this.y && indexX == this.x && this.type == player){
            control = this.id;
        }
        
        if(control == this.id && this.type == player){
            if(this.check())
            {
                for(i of allPieces) if(indexX == i.x && indexY == i.y && this.type != i.type) delete allPieces.splice(allPieces.indexOf(i),1)
                audio.play();
                this.x = indexX
                this.y = indexY
                player = this.type == 0 ? 1:0
                
                
                
            }
            
            
        }
        
    }
}

class Queen extends Pieces{
    x = 3
    source = 'pieces/queen.png'
    check(){
        let test = true
        if(indexY == this.y && indexX == this.x) test = false;
        let squareIndex = (this.x  + this.y *8) + 1
        let clickedIndex = (indexX + indexY * 8) + 1
        console.log(clickedIndex)
        let t = false
        console.log(squareIndex)
        console.log(Math.abs(squareIndex - clickedIndex))
        
        for(i of allPieces){
            if(indexX == i.x && indexY == i.y && this.type == i.type) return false;
            if(indexX != this.x && indexY != this.y)
            {
                console.log('bispo')
                let squareIndex = (this.x  + this.y *8) + 1
                let clickedIndex = (indexX + indexY * 8) + 1
                if(Math.abs(squareIndex - clickedIndex) % 9 == 0 && indexX != this.x && Math.abs(squareIndex - clickedIndex) != 49|| Math.abs(squareIndex - clickedIndex) % 7 == 0 &&indexX != this.x && Math.abs(squareIndex - clickedIndex) != 49)
                {
                    console.log('bispo2')
                    let counter = 0
                    //direita baixo
                    if(indexX > this.x && indexY > this.y)
                    {
                        for(let c = this.x ; c < indexX - 1; c++){
                            counter++
                            
                            if(this.y + counter == i.y && this.x + counter == i.x && i.id != this.id) {test = false;}
                            
                        }
                    }
                    counter = 0
                    //esquerda cima
                    if(indexX < this.x && indexY < this.y)
                    {
                        for(let c = this.x ; c > indexX + 1 ; c--){
                            counter++
                            if(this.y  - counter == i.y && this.x - counter == i.x && i.id != this.id) {test = false;}
                            
                        }
                    }
                    counter = 0
                    //direita cima
                    if(indexX > this.x && indexY < this.y)
                    {
                        for(let c = this.x ; c < indexX -1 ; c++){
                            counter++
                            
                            if(this.y - counter == i.y && this.x + counter == i.x && i.id != this.id) {test = false;}
                            
                        }
                    }
                    //esquerda baixo
                    counter = 0
                    if(indexX < this.x && indexY > this.y)
                    {
                        for(let c = this.x ; c > indexX + 1 ; c--){
                            counter++
                            if(this.y  + counter == i.y && this.x - counter == i.x && i.id != this.id) {test = false;}
                            
                        }
                    }
                }
                else return false;
            }
            else
            {

                for(let l = this.x + 1; l < indexX; l++){
                    if(l == i.x && indexX != i.x && i.y == this.y) {return false; }
                }
                //impedi ir para baixo
                for(let c = this.y + 1 ; c < indexY; c++){
                    if(c == i.y && indexY != i.y && i.x == this.x) { return false;}
                }
                for(let k = this.x - 1; k > indexX; k--){
                    if(k == i.x && indexX != i.x && i.y == this.y) {return false;}
                }
                for(let a = this.y - 1; a > indexY; a--){
                    if(a == i.y && indexY != i.y && i.x == this.x) {return false;}
                }
                if(indexX == i.x && indexY == i.y && this.type == i.type) {return false;}
            }            
        
            
        }
        return test;
    }
    move(){
        if(indexY == this.y && indexX == this.x && this.type == player){
            control = this.id;
        }
        
        if(control == this.id && this.type == player){
            if(this.check())
            {
                for(i of allPieces) if(indexX == i.x && indexY == i.y && this.type != i.type) delete allPieces.splice(allPieces.indexOf(i),1)
                audio.play();
                this.x = indexX
                this.y = indexY
                player = this.type == 0 ? 1:0
                
                
                
            }
            
            
        }
        
    }
}



let blackPieces = []

let blackKing = new King()
allPieces.push(blackKing)
for(let i = 0; i < 8; i++){
    let pawn = new Pawn()
    pawn.x = i
    allPieces.push(pawn)
}

let blackTower = new Tower()
blackKing.leftTower = blackTower
allPieces.push(blackTower)

let blackTower2 = new Tower()
blackTower2.x = 7
blackKing.dirTower = blackTower2
allPieces.push(blackTower2)


blackKnight = new Knight()
allPieces.push(blackKnight)

blackKnight2 = new Knight()
blackKnight2.x = 6
allPieces.push(blackKnight2)

let blackBishop = new Bishop()
allPieces.push(blackBishop)

let blackBishop2 = new Bishop()
blackBishop2.x = 5
allPieces.push(blackBishop2)

let blackQueen = new Queen()
allPieces.push(blackQueen)


let whitePieces = []

let whiteKing = new King()
whiteKing.type = 1
whiteKing.y = 7
whiteKing.source = 'pieces/kingw.png'
allPieces.push(whiteKing)

for(let i = 0; i < 8; i++){
    let whitePawn = new Pawn()
    whitePawn.source = 'pieces/pawnw.png'
    whitePawn.type = 1
    whitePawn.x = i
    whitePawn.y = 6
    allPieces.push(whitePawn)
}


let whiteTower = new Tower()
whiteTower.type = 1;
whiteTower.y = 7
whiteTower.source = 'pieces/towerw.png'
whiteKing.leftTower = whiteTower
allPieces.push(whiteTower)

let whiteTower2 = new Tower()
whiteTower2.type = 1;
whiteTower2.y = 7
whiteTower2.x = 7
whiteTower2.source = 'pieces/towerw.png'
whiteKing.dirTower = whiteTower2
allPieces.push(whiteTower2)

let whiteKnight = new Knight()
whiteKnight.source = 'pieces/knightw.png'
whiteKnight.type = 1
whiteKnight.y = 7
allPieces.push(whiteKnight)

let whiteKnight2 = new Knight()
whiteKnight2.source = 'pieces/knightw.png'
whiteKnight2.type = 1
whiteKnight2.y = 7
whiteKnight2.x = 6
allPieces.push(whiteKnight2)

let whiteBishop = new Bishop()
whiteBishop.source = 'pieces/bishopw.png'
whiteBishop.y = 7
whiteBishop.type = 1
allPieces.push(whiteBishop)

let whiteBishop2 = new Bishop()
whiteBishop2.source = 'pieces/bishopw.png'
whiteBishop2.y = 7
whiteBishop2.type = 1
whiteBishop2.x = 5
allPieces.push(whiteBishop2)

let whiteQueen = new Queen()
whiteQueen.type = 1;
whiteQueen.source = 'pieces/queenw.png'
whiteQueen.y = 7
allPieces.push(whiteQueen)

allPieces.push(...whitePieces)
allPieces.push(...blackPieces)
setup = function(){
    table()
    for(i of allPieces){
        i.draw()
        i.move()
    }
    onmousedown = function(e){
        rect = canvas.getBoundingClientRect()
        let mousex = e.clientX - rect.left
        let mousey = e.clientY - rect.top
        indexX = Math.floor(mousex / disLine)
        indexY = Math.floor(mousey / disLine)
        if(indexX<0) indexX = 0
        if(indexX>7) indexX = 7
        if(indexY<0) indexY = 0
        if(indexY>7) indexY = 7
        
    }
    
}
setInterval(setup,100)
