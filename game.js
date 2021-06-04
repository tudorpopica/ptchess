
let game = function(gameID) {
    
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    this.playerAState = null;
    this.playerBState = null;
    this.playerAName = null;
    this.playerBName = null;
  };


  
  game.prototype.gamesIdentification = 0;
  game.prototype.gamesWaiting = 0;
  game.prototype.gamesStarted = 0;

  game.prototype.transitionStates = {};
  game.prototype.transitionStates["0 JOINT"] = 0;
  game.prototype.transitionStates["1 JOINT"] = 1;
  game.prototype.transitionStates["2 JOINT"] = 2;
  game.prototype.transitionStates["WHITE"] = 4; //A won
  game.prototype.transitionStates["BLACK"] = 5; //B won
  game.prototype.transitionStates["ABORTED"] = 6;


  game.prototype.addPlayer = function(p) {
    if(this.playerA == null || this.gameState =="0 JOINT"){
        this.playerA = p;
        this.gameState = "1 JOINT";
        return 'WHITE';
    }else if(this.playerB == null || this.gameState == "1 JOINT"){
        this.playerB = p;
        this.gameState = "2 JOINT";
        return 'BLACK';
    }else{
        return "GAME FULL";
    }
}

game.prototype.hasTwoConnectedPlayers = function(){
    return this.gameState == "2 JOINT";
}
 
module.exports = game;