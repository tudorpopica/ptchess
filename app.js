
const express = require("express");
const http = require("http");
const websocket = require("ws");
let stats = require('./stats');


let Game = require("./game");
const port = process.argv[2];
const app = express();

let share = require('./public/javascripts/messages.js');
const game = require("./game");




app.use(express.static((__dirname, 'public')));


app.get("/game", function(req, res){
  res.sendFile('game.html', {root: "./public"});
});

app.get("/*", function(req, res){
  res.sendFile("splash.html", {root: "./public"})
});


let websockets = {}; //Array which holds all the current games that are running/waiting/aborted.
let connectionID = 0;
let currentGame = new Game(stats.gamesStarted++);


const server = http.createServer(app);
const wss = new websocket.Server({ server });

wss.on("connection", function (ws) {
    
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  con.send(playerType === "WHITE" ? share.S_PLAYER_WHITE : share.S_PLAYER_BLACK);
  


  if(currentGame.hasTwoConnectedPlayers()){
    let gameObj = websockets[con.id];
    
    gameObj.playerA.send(JSON.stringify(share.O_STARTING));
    currentGame = new Game(stats.gamesStarted++);
  }else{
    con.send(JSON.stringify(share.O_WAITING));
  }
    /*
     * let's slow down the server response time a bit to 
     * make the change visible on the client side
     */ 
    ws.on("message", function incoming(message) {
      let mes = JSON.parse(message);

      let gameObj = websockets[con.id];
      let isPlayerA = gameObj.playerA == con ? true : false;
      
      if(mes.type == "GAME-ABORTED"){
        if(isPlayerA){
          gameObj.playerB.send(message);
        }else{
          gameObj.playerA.send(message);
        }
        stats.gamesAborted++;
        gameObj.playerA.close();
        gameObj.playerB.close();
      }      
      if (isPlayerA){
        if (mes.type == share.T_WHITE_MOVE){
          gameObj.playerB.send(message);
        }else if(mes.type == share.T_GAME_WON_BY){
          gameObj.playerAState = mes.data;
          if(gameObj.playerAState == gameObj.playerBState){
             stats.gamesCompleted++;
             gameObj.playerB.close();
             gameObj.playerA.close();
          }
        }else if(mes.type == share.T_STALEMATE){
          gameObj.playerAState = mes.data;
            if(gameObj.playerAState == gameObj.playerBState){
              stats.gamesCompleted++;
               gameObj.playerB.close();
               gameObj.playerA.close();
          }     
        } 
      } else {
          if (mes.type == share.T_BLACK_MOVE) {
              gameObj.playerA.send(message);
          }else if(mes.type == share.T_GAME_WON_BY){
            gameObj.playerBState = mes.data;
            if(gameObj.playerAState == gameObj.playerBState){
               stats.gamesCompleted++;
               gameObj.playerA.close();
               gameObj.playerB.close();
            }
          }else if(mes.type == share.T_STALEMATE){
            gameObj.playerBState = mes.data;
            if(gameObj.playerAState == gameObj.playerBState){
              stats.gamesCompleted++;
               gameObj.playerA.close();
               gameObj.playerB.close();
          }
        }
      }
      

      console.log("[LOG] "+ mes.from + " " + mes.to+ "[GAME ID] "+gameObj.id);
      
    });
    let test = 0;
});

server.listen(port);