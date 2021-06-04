(function(exports){

  /*
   * Client to server: game is complete, the winner is ...
   */
  exports.T_GAME_WON_BY = "GAME-WON-BY";
  exports.O_GAME_WON_BY = {
    type: exports.T_GAME_WON_BY,
    data: null
  };

  exports.T_NAME = "NAME";
  exports.O_NAME = {
    type: exports.T_NAME,
    data: null
  }

  exports.T_WAITING = "WAITING";
  exports.O_WAITING = {
    type: exports.T_WAITING,
  }

  exports.T_STARTING = 'STARTING';
  exports.O_STARTING = {
    type: exports.T_STARTING
  }
    /*
   * Server to client: abort game (e.g. if second player exited the game)
   */
  exports.O_GAME_ABORTED = {
    type: "GAME-ABORTED"
  };
  exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    /*
   * Server to client: set as player A
   */
  exports.T_PLAYER_TYPE = "PLAYER-TYPE";
  exports.O_PLAYER_WHITE = {
    type: exports.T_PLAYER_TYPE,
    data: "WHITE"
  };
  exports.S_PLAYER_WHITE = JSON.stringify(exports.O_PLAYER_WHITE);

  /*
   * Server to client: set as player B
   */
  exports.T_PLAYER_TYPE = 'PLAYER-TYPE';
  exports.O_PLAYER_BLACK = {
    type: exports.T_PLAYER_TYPE,
    data: "BLACK"
  };
  exports.S_PLAYER_BLACK = JSON.stringify(exports.O_PLAYER_BLACK);

   /*
   * Server to Player A & B: game over with result won/loss
   */
  exports.T_STALEMATE = "STALEMATE";
  exports.O_STALEMATE = {
    type: exports.T_STALEMATE,
  }

  
  exports.T_GAME_OVER = "GAME-OVER";
  exports.O_GAME_OVER = {
    type: exports.T_GAME_OVER,
    data: null
  };

    /**
     * Player WHITE to server OR server to Player BLACK: this is the move
     */
  exports.T_WHITE_MOVE = 'WHITE-MOVE';
  exports.O_WHITE_MOVE = {
      type: exports.T_WHITE_MOVE,
      from: null,
      to: null,
      specialMove: null
  };
//   exports.S_WHITE_MOVE = JSON.stringify(exports.O_WHITE_MOVE);
  /**
   * Player BLACK to server OR server to Player WHITE: this is the move
   */
  exports.T_BLACK_MOVE = 'BLACK-MOVE';
  exports.O_BLACK_MOVE = {
      type: exports.T_BLACK_MOVE,
      from: null,
      to: null,
      specialMove: null
  };
//   exports.S_BLACK_MOVE = JSON.stringify(exports.O_BLACK_MOVE);

})(typeof exports === 'undefined' ? this.messages = {} : exports);
//if exports is undefined, we are on the client; else the server