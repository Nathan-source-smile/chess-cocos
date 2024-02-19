const { TOTAL_TIME } = require("./Common/Constants");

var gameVars = {
  values: [
    'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    't', 'm', 'v', 'w', 'l', 'v', 'm', 't'], // board

  // for my side
  ck: false, // to check the first move of king
  cr1: false, // to check the first move of left rook
  cr2: false, // to check the first move of right rook
  cl: false,

  // for enemy's side
  cke: false, // to check the first move of king
  cr1e: false, // to check the first move of left rook
  cr2e: false, // to check the first move of right rook
  cle: false,

  myTurn: true, // player1 is true, player2 is false
  moveable: false,
  moveTarget: "", // selected Tile
  moveScopes: [], // available areas with string

  winner: -1, // you: 0, enemy: 1

  player1_remainTime: TOTAL_TIME,
  player2_remainTime: TOTAL_TIME,
  currentTime: null,
  checkMate: false,
  endGame: false,
};

module.exports = gameVars;