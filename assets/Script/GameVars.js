var gameVars = {
  values: [
    'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
    'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
    't', 'm', 'v', 'w', 'l', 'v', 'm', 't'],
  ck: false,
  cr1: false,
  cr2: false,
  cl: false,
  myTurn: true,
  moveable: false,
  moveTarget: "",
  moveScopes: [],
};

module.exports = gameVars;