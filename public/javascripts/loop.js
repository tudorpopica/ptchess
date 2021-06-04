//@ts-check

//importing library
const { Chess } = require('chess.js');
const game = require('../../game');
let chess = new Chess();


//variables

let boardElement;
let board;
let allowedMoves;
let highlightedSquares;
let player;
let specialMove;
let playerType;
let you;
let opponent;

///setting up drag and drop events;
//

window.allowDrop = function allowDrop(ev) {  
        ev.preventDefault();
    };

window.drag = function drag(ev){
    //when we first pick up.
        showValidMoves(ev.target.parentElement.id);
        ev.dataTransfer.setData('text', ev.target.id);
    };
    
window.drop = function drop(ev){
        ev.preventDefault();
        //clearing the circles
        
        //this is where we need to validate the move
        let currentSquareID;
        //check if it is a square or a piece
        if(ev.target.className == 'WHITE' || ev.target.className == 'BLACK' || ev.target.className == 'circle'){
            currentSquareID = ev.target.parentElement.id;
        }else{
            currentSquareID = ev.target.id;
        }
       
        let data = ev.dataTransfer.getData('text'); //should be the original piece
        if(validMove(data, currentSquareID)){
            let OriginalSquareID = document.getElementById(data).parentElement.id;
            movePiece(OriginalSquareID, currentSquareID);
            console.log(chess.ascii());
        };
        
    };

function currentPlayer(){
    this.turn = 'WHITE';
}


//CHECKMATE
function chessChecks(){
    if(chess.in_checkmate()) {
        console.log(player.turn + 'WINS THE GAME');
        let message = messages.O_GAME_WON_BY;
        message.data = player.turn;
        websocket.send(JSON.stringify(message));
        setDragState(playerType, 'false');
    } else if(chess.in_stalemate()) {
        console.log('game is over, it is a draw');
        let message = messages.O_STALEMATE;
        setDragState(playerType, 'false');
        websocket.send(JSON.stringify(message));
    } else if(chess.in_check()) {
        console.log(player.turn + ' is currently in CHECK');
    }//need to add some more checks to the server side implementation. 
}


function switchTurn(){
    chessChecks();
    if(chess.turn() == 'w'){
        player.turn = "WHITE";
        if(player.turn == playerType){
            setDragState('WHITE', 'true');
        }else{
            setDragState('BLACK', 'false');
        }
        // if(player.turn == "WHITE"){
        //     setDragState(playerType, 'true');
            
        // }else{
        //     setDragState(playerType, 'false');
        // }
        // player.turn = 'WHITE';
    }else if(chess.turn() == 'b'){
        player.turn = 'BLACK';
        if(player.turn == playerType){
            setDragState("BLACK", 'true');
        }else{
            setDragState("WHITE", 'false');
        }        
    }
}


function setDragState(classname, state){
    let pieces = document.getElementsByClassName(classname);
    let piece;
    for(piece of pieces){
        piece.setAttribute('draggable', state);
    }
}



//VALIDATE ALL MOVES OF PIECE
function showValidMoves(squareID){
    allowedMoves = chess.moves({square:squareID});
    let move;
    highlightedSquares = [];
    for(move of allowedMoves){
        //insetad just change the color of the square. 
        let circle = document.createElement('div');
        circle.className = 'circle';
        if(move == 'O-O'){
            let squarCastle = 'g'+squareID.charAt(1);
            let currentStyle = board.getSquare(squarCastle).element.getAttribute('style');
            board.getSquare(squarCastle).element.setAttribute('style','background-color: green');
            highlightedSquares.push({
                square: board.getSquare(squarCastle),
                styleValue: currentStyle
            });
        }else if(move == 'O-O-O'){
            let squarCastle = 'c'+squareID.charAt(1);
            let currentStyle = board.getSquare(squarCastle).element.getAttribute('style');
            board.getSquare(squarCastle).element.setAttribute('style','background-color: green');
            highlightedSquares.push({
                square: board.getSquare(squarCastle),
                styleValue: currentStyle
            });
        }else{
            let currentStyle = board.getSquare(move).element.getAttribute('style');
            board.getSquare(move).element.setAttribute('style','background-color: green');
            highlightedSquares.push({
                square: board.getSquare(move),
                styleValue: currentStyle
            });
        }

        // let  circle = document.createElement('div');
        // circle.className = 'circle';
        // board.getSquare(move).element.appendChild(circle);
    }
}

window.closeValidMoves =function closeValidMoves(){
    let x;
    for(x of highlightedSquares){
        x.square.element.setAttribute('style', x.styleValue);
    }
    // var circles = document.getElementsByClassName('circle');
    // while(circles[0]){
    //     circles[0].parentNode.removeChild(circles[0]);
    // }
    
}



function validMove(pieceID, target){
    let squareID = document.getElementById(pieceID).parentElement.id;
    allowedMoves = chess.moves({square: squareID});
    let convertedArray= [];
    for(let i = 0; i < allowedMoves.length; i++){
        if(allowedMoves[i]=='O-O'){
            if(player.turn == 'WHITE'){
                convertedArray[i] = "g1";
            }else{
                convertedArray[i] = "g8";
            }
            specialMove = 'O-O';
        }else if(allowedMoves[i] == 'O-O-O'){
            if(player.turn == 'WHITE'){
                convertedArray[i] = 'c1';
            }else{
                convertedArray[i] = 'c8';
            }
            specialMove = 'O-O-O';
        }else{
            convertedArray[i] = (allowedMoves[i].match(/[a-h][1-9]/))[0];
        }        
    }
    if(convertedArray.includes(target)){
        return true;
    }else{
        return false;
    }

}



//squares
function Square(id, element) {
    this.id = id;
    this.element = element;
    this.piece = null;//contains no pieces when initialized;
    this.element.setAttribute('ondrop', 'drop(event)');
    this.element.setAttribute('ondragover', 'allowDrop(event)');


    this.hasPiece = function(){
        if(this.piece != null){
            return true;
        }else{
            return false;
        }
    }
}

function chessPiece(pieceType, element, color){
    const piece = {
        'PAWN': '♟',
        'KNIGHT': '♞',
        'BISHOP': '♝',
        'ROOK': '♜',
        'QUEEN': '♛',
        'KING': '♚'
    };
    this.element = element;
    this.element.innerHTML = piece[pieceType];
    this.element.setAttribute('draggable', 'true'); //testing purpose
    this.element.setAttribute('ondragstart', 'drag(event)') //testing purpose;
    this.element.setAttribute('ondragend', 'closeValidMoves()') //testing purpose;
    this.type = pieceType;
    this.element.className = color;
}

//THIS is a board object and holds the properties of a board. 

function Board(){
    this.Xindex = 0;
    this.Yindex = 0;
//a map created in order to conver a letter into a number for indexing in the 2d Array
    this.map = [];
    this.map['a'] = 0;
    this.map['b'] = 1;
    this.map['c'] = 2;
    this.map['d'] = 3;
    this.map['e'] = 4;
    this.map['f'] = 5;
    this.map['g'] = 6;
    this.map['h'] = 7;

//creating a 2d array for the board
    this.squares = [[],[],[],[],[],[],[],[]];

    this.addSquare = function(square){
        // @ts-ignore
        if(this.Xindex < 8){
            // @ts-ignore
            if(this.Yindex<8){
                // @ts-ignore
                this.squares[this.Xindex][this.Yindex] = square;
                // @ts-ignore
                this.Yindex++;
            }else{
                // @ts-ignore
                this.Xindex++;
                this.Yindex = 0;
                // @ts-ignore
                this.squares[this.Xindex][this.Yindex] = square;
                this.Yindex++;
            }
        }else{
            console.log('ERROR TOO MANY ITEMS');
        }
    }

    //literally for getting the square stored in the bored.
    this.getSquare = function(input){
        let result = input.match(/[a-h][1-9]/);
        let id = result[0];
        let mapID = this.map[id.charAt(0)];
        let numberID = 8-id.charAt(1);
        return this.squares[numberID][mapID];

    }
}



function generateBoardElement(){
    boardElement = document.querySelector('.board');
    board = new Board();

    let alphabet = "abcdefgh";
    for(let i= 8; i > 0; i--){
        
        // let column = document.createElement('div');

        // column.id = letter;
        // column.className = 'column';
        // board.appendChild(column);

        for(let j = 0; j< alphabet.length;j++){
            let squareElement = document.createElement('div'); 
            let letter = alphabet.charAt(j);

            let combo = letter+i;
            
            squareElement.id= combo;
            squareElement.innerHTML = combo;
            squareElement.className = 'square';

            let square = new Square(combo, squareElement);
            board.addSquare(square);

            boardElement.appendChild(squareElement);
        }
    }

    player = new currentPlayer();

    /**
     * Below was a test to see if you can move html elements from one node to another. 
     * -- It was a success --
     */
    

    // let button = document.querySelector('button');
    // button.onclick = function(){
    //     movePiece('b2', 'b3'); 
    //     movePiece('b7', 'b10');       
    // }

    //piece creation test
    
}

//websocket
const websocket = new WebSocket('ws://localhost:4000');
websocket.onopen = function(event) {
    this.send(JSON.stringify({from: 'a0', to:'a3'}));
    
};

//ABORT GAME IS DONE BELOW
let button  = document.getElementById('abort');
button.onclick = function(){
    if(websocket.readyState !== WebSocket.CLOSED){
        let message = messages.O_GAME_ABORTED;
        websocket.send(JSON.stringify(message));
        setDragState(playerType, 'false');
        alert('GAME HAS BEEN ABORTED')
    }
}




websocket.onmessage = function(message){
    let move = JSON.parse(message.data);
    console.log(move);
    if(move.type == "PLAYER-TYPE"){
        playerType = move.data;
        if(playerType == 'WHITE'){
            alert("YOU ARE WHITE");
            setDragState('WHITE', 'true');
            setDragState('BLACK', 'false');
        }else{
            alert("YOU ARE BLACK");
            setDragState('BLACK', 'true');
            setDragState('WHITE', 'false');
        }
        console.log(playerType);
    }else if(move.type == "GAME_OVER") {
        alert("Good Game! " + move.data + " won!");
        // endGame(move.type);
    } else if(move.type == 'WHITE-MOVE') {
        specialMove = move.specialMove;
        movePiece(move.from, move.to);
    } else if(move.type == 'BLACK-MOVE') {
        specialMove = move.specialMove;
        movePiece(move.from, move.to);
    }else if(move.type == "GAME-ABORTED"){
        setDragState(playerType, 'false');
        alert('GAME WAS ABORTED BY OPPONENT!\n please look for a new game!');

    }else if(move.type == "WAITING"){
        alert("Waiting for new plater to join");
        setDragState(playerType, 'false');
    }else if(move.type == "STARTING"){
        alert("Starting Game");
        setDragState(playerType, 'true');
    }
}




// function endGame(player){
//     let gameover = document.createElement('div');
//     let body = document.getElementsByTagName('body')[0]; 
//     gameover.innerHTML = "Good Game!" + player + "won!";
//     body.appendChild(gameover);
// }

//valid moves to make for a specific object. 


//moving pieces from one div to another on Chessboard; 

function movePiece(from, to) { 
let oldParent;
let newParent;
        if(specialMove != null){
            if(specialMove == 'O-O'){
                if(player.turn == 'WHITE'){
                    if(from == 'e1' && to == 'g1'){
                        oldParent = board.getSquare('h1').element;
                        newParent = board.getSquare('f1').element;
                        newParent.appendChild(oldParent.childNodes[1]);
                        board.getSquare('f1').piece = board.getSquare('h1').piece;
                        board.getSquare('h1').piece =null;
                    }                  
                }else{
                    if(from == 'e8' && to == 'g8'){
                        oldParent = board.getSquare('h8').element;
                        newParent = board.getSquare('f8').element;
                        newParent.appendChild(oldParent.childNodes[1]);
                        board.getSquare('f8').piece = board.getSquare('h8').piece;
                        board.getSquare('h8').piece =null;
                    }                       
                }
            } else if(specialMove == "O-O-O"){
                if(player.turn == "WHITE"){
                    if(from == 'c1' && to == 'd1'){
                        oldParent = board.getSquare('a1').element;
                        newParent = board.getSquare('d1').element;
                        newParent.appendChild(oldParent.childNodes[1]);
                        board.getSquare('d1').piece = board.getSquare('a1').piece;
                        board.getSquare('a1').piece =null;
                    }                  
                } else {
                    if(from == 'c8' && to == 'd8'){
                        oldParent = board.getSquare('a8').element;
                        newParent = board.getSquare('d8').element;
                        newParent.appendChild(oldParent.childNodes[1]);
                        board.getSquare('d8').piece = board.getSquare('a8').piece;
                        board.getSquare('a8').piece =null;     
                    }
                }
            }           
        }
  //////NORMAL MOVES BELOW
            oldParent = board.getSquare(from).element;
            newParent = board.getSquare(to).element;
            chess.move({from: from, to: to});/////
            if(board.getSquare(to).hasPiece()){
                newParent.removeChild(board.getSquare(to).piece.element);
            }
            newParent.appendChild(oldParent.childNodes[1]);
            board.getSquare(to).piece = board.getSquare(from).piece;
            board.getSquare(from).piece = null;
            if(playerType == player.turn){
                if(playerType == "WHITE"){
                    let message = messages.O_WHITE_MOVE;
                    message.from = from;
                    message.to = to;
                    message.specialMove = specialMove;
                    websocket.send(JSON.stringify(message));
                } else {
                    let message = messages.O_BLACK_MOVE;
                    message.from = from;
                    message.to = to;
                    message.specialMove = specialMove;
                    websocket.send(JSON.stringify(message));
                }
            }          
            specialMove = null;
    switchTurn();
}

//creating and generating pieces

function createPiece(type, color, id){
    let div = document.createElement('div');
    div.id = id;
    div.className = color;
    return new chessPiece(type,div,color);
}

function addPiece(location, pieceType, color,id){
    let square = board.getSquare(location);
    let piece = createPiece(pieceType, color,id);
    square.piece = piece;
    square.element.appendChild(piece.element);
}


function initialPieceGeneration(){
    //white square
    
    //first row
    addPiece('a8', 'ROOK', 'BLACK','BR1');
    addPiece('b8', 'KNIGHT', 'BLACK','BN1');
    addPiece('c8', 'BISHOP', 'BLACK','BB1');
    addPiece('d8', 'QUEEN', 'BLACK', 'BQ1');
    addPiece('e8', "KING", 'BLACK', 'BK1');
    addPiece('f8', 'BISHOP', 'BLACK', 'BB2');
    addPiece('g8', 'KNIGHT', 'BLACK', 'BN2');
    addPiece('h8', 'ROOK', 'BLACK', 'BR2');

    //second row
    addPiece('a7', 'PAWN', 'BLACK', 'BP1');
    addPiece('b7', 'PAWN', 'BLACK', 'BP2');
    addPiece('c7', 'PAWN', 'BLACK', 'BP3');
    addPiece('d7', 'PAWN', 'BLACK', 'BP4');
    addPiece('e7', 'PAWN', 'BLACK', 'BP5');
    addPiece('f7', 'PAWN', 'BLACK', 'BP6');
    addPiece('g7', 'PAWN', 'BLACK', 'BP7');
    addPiece('h7', 'PAWN', 'BLACK', 'BP8');



    //second final row
    addPiece('a2', 'PAWN', 'WHITE', 'WP1');
    addPiece('b2', 'PAWN', 'WHITE', 'WP2');
    addPiece('c2', 'PAWN', 'WHITE', 'WP3');
    addPiece('d2', 'PAWN', 'WHITE', 'WP4');
    addPiece('e2', 'PAWN', 'WHITE', 'WP5');
    addPiece('f2', 'PAWN', 'WHITE', 'WP6');
    addPiece('g2', 'PAWN', 'WHITE', 'WP7');
    addPiece('h2', 'PAWN', 'WHITE', 'WP8');

    //last row
    addPiece('a1', 'ROOK', 'WHITE', 'WR1');
    addPiece('b1', 'KNIGHT', 'WHITE', 'WN1');
    addPiece('c1', 'BISHOP', 'WHITE', 'WB1');
    addPiece('d1', 'QUEEN', 'WHITE', 'WQ1');
    addPiece('e1', "KING", 'WHITE', 'WK1');
    addPiece('f1', 'BISHOP', 'WHITE', 'WB2');
    addPiece('g1', 'KNIGHT', 'WHITE','WN2');
    addPiece('h1', 'ROOK', 'WHITE','WR2');


    //making sure all black pieces are disabled.  
}

//initial color

generateBoardElement();
initialPieceGeneration();