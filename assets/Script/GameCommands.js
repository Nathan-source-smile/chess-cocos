// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

/*
import("./Common/Messages.js").then((mod2) => {
    console.log("Imported:","MESSAGE_TYPE",mod2);
    console.log(mod2.MESSAGE_TYPE); // true
    MESSAGE_TYPE = mod2.MESSAGE_TYPE;
  });*/

var global = require("global");
var messages = require("./Common/Messages.js");
var GameCommands = {

    handleCommand: function (cmd, params){
       
      var playerOrder = -1;
      var order = -1;
      var cards = "";
      var dealer = -1;
      var round_count = -1;
      var availableActionsString;
      var availableActions;
      var state;

            switch (cmd) {
                case "RESUME_GAME":
                    //var gameId =  params.getUtfString("gameId");
                    var scores =  params.getIntArray("scores");
                    var playerCardsString =  params.getUtfString("cards");
                    var playerCards =  JSON.parse(playerCardsString);
                    var teamPoints = params.getIntArray("mission_score");
                    console.log ("TEAM POINTS", teamPoints);
                    var teamCoins = params.getIntArray("teamCoins"); 
                    var roundBets = params.getIntArray("roundBets");
                    var gameState = params.getInt("gameState");
                    var isPoints = params.getInt("isPoint");
                    var dealer = params.getInt("dealer");
                    var userOrder = params.getInt("userOrder");
                    var secsLeft = params.getInt("timeOut");
                    global.scenes['gameScene'].resumeGame (playerCards, teamPoints, teamCoins, roundBets,gameState,isPoints, userOrder, secsLeft, dealer);
                                  //global.scenes['gameScene'].resumeGame(localColor, usersColors, currentPlayer, startRolls, tabsPositions, playerRolls,gameId, scores);
                    break;
                case "UPDATE_SCORE":
                    var colorIndex = params.getInt("color");
                    var score =  params.getInt("score");
                    global.scenes['gameScene'].setPlayerScore(colorIndex,score);
                    break;
                case "TAKE_TURN":
                    var order = params.getInt("order");
                    var timeOut =  params.getInt("timeOut");
                    global.scenes['gameScene'].takeTurn(order,timeOut);
                    break;
                case "START_ROLL":
                    var rollColors = params.getDoubleArray("rollColors");
                    var timeOut =  params.getInt("timeOut");
                    //console.log("START_ROLL", rollColors,  timeOut);
                    var gameId =  params.getUtfString("gameId");
                    global.scenes['gameScene'].startRoll(rollColors,timeOut,gameId);
                    break;              
                case "START_ROLL_TIE":
                    var tieColors = params.getDoubleArray("tieColors");
                    global.scenes['gameScene'].startRollTie(tieColors);
                    break;              
                case "START_ROLL_WINNER":
                    var winnerColor = params.getInt("winnerColor");
                    var winnerName = params.getUtfString("winnerName");
                    global.scenes['gameScene'].startRollWinner(winnerColor, winnerName);
                    break;              
                case "FINISH_GAME":
                    var winnerOrder = params.getInt("winnerOrder");
                    var credits = params.getInt("credits");
                    global.scenes['gameScene'].finishGame(winnerOrder, credits);
                    break;

                case messages.MESSAGE_TYPE.SC_NEW_ROUND:
                    global.scenes['gameScene'].newRound();
                    break;

                case messages.MESSAGE_TYPE.SC_SET_CARDS:
                    order = params.getInt ('order');
                    cards = params.getDoubleArray ('cards');
                    global.scenes['gameScene'].setPlayerCards(order, cards);
                    break;
            
                case messages.MESSAGE_TYPE.SC_ADD_CARDS:
                    order = params.getInt ('order');
                    cards = params.getDoubleArray ('cards');
                    var discard = params.getBool ('discard');
                    console.log (order, cards, discard);
                    
                    global.scenes['gameScene'].addPlayerCards(order, cards, discard);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_MUS_CLAIM:
                    order = params.getInt ('order');
                    console.log ("Received Mus claim from SFS for player", order);
                    round_count = params.getInt ('round_count');
                    dealer = params.getInt ('dealer');
                    global.scenes['gameScene'].doMusClaim(order);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_MUS_ALARM:
                    order = params.getInt ('order');
                    var mus = params.getBool ('mus');
                    global.scenes['gameScene'].doMusAlarm(order, mus);
                break;
        
                case messages.MESSAGE_TYPE.SC_DEALER_CHANGED:
                    var dealer = params.getInt ('dealer');
                    global.scenes['gameScene'].dealerChanged(dealer);
                break;
        
                case messages.MESSAGE_TYPE.SC_DISPLAY_DISCARD:
                    global.scenes['gameScene'].doDisplayDiscard();
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_MUS_DISCARD:
                    order = params.getInt ('order');
                    global.scenes['gameScene'].doDiscard(order);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_DISCARD_ALARM:
                    order = params.getInt ('order');
                    cards = params.getIntArray ('cards');
                    global.scenes['gameScene'].doDiscardAlarm(order, cards);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_BIG:
                    console.log ("SC_DO_BIG", params);
                    order = params.getInt ('order');
                    availableActionsString = params.getUtfString ('availableActions');
                    availableActions = JSON.parse (availableActionsString);
                    state = params.getInt ('state');
                    global.scenes['gameScene'].doBig(order, availableActions, state);
                break;
        
                case messages.MESSAGE_TYPE.SC_REMOVE_DISCARDED:
                    global.scenes['gameScene'].removeDiscardedCardsFromTable();
                break;

                case messages.MESSAGE_TYPE.SC_SHOW_CARDS:
                    var allCardsString = params.getUtfString ("cards");
                    var allCards = JSON.parse (allCardsString);
                    global.scenes['gameScene'].showCards(allCards);
                break;
                        
                case messages.MESSAGE_TYPE.SC_DO_SMALL:
                    order = params.getInt ('order');
                    availableActionsString = params.getUtfString ('availableActions');
                    availableActions = JSON.parse (availableActionsString);
                    state = params.getInt ('state');
                    global.scenes['gameScene'].doSmall(order, availableActions, state);
                break;
        
                case messages.MESSAGE_TYPE.SC_EVAL_PAIRS:
                    order = params.getInt ('order');
                    global.scenes['gameScene'].evalPairs(order);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_PAIRS:
                    order = params.getInt ('order');
                    availableActionsString = params.getUtfString ('availableActions');
                    availableActions = JSON.parse (availableActionsString);
                    state = params.getInt ('state');
                    global.scenes['gameScene'].doPairs(order, availableActions, state);
                break;
        
                case messages.MESSAGE_TYPE.SC_EVAL_GAME:
                    order = params.getInt ('order');
                    global.scenes['gameScene'].evalGame(order);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_GAME:
                    order = params.getInt ('order');
                    availableActionsString = params.getUtfString ('availableActions');
                    availableActions = JSON.parse (availableActionsString);
                    state = params.getInt ('state');
                    global.scenes['gameScene'].doGame(order, availableActions, state);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_POINTS:
                    order = params.getInt ('order');
                    availableActionsString = params.getUtfString ('availableActions');
                    availableActions = JSON.parse (availableActionsString);
                    state = params.getInt ('state');
                    global.scenes['gameScene'].doPoints(order, availableActions, state);
                break;
        
                case messages.MESSAGE_TYPE.SC_SHARE_POINT:
                    order = params.getInt ('order');
                    var coins_historyString = params.getUtfString ('coins_history');
                    var coins_history = JSON.parse (coins_historyString);
                    var points = params.getBool ('points');
                    var total_coins = params.getIntArray ('total_coins');
                    global.scenes['gameScene'].sharePoints(order, coins_history, total_coins, points);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_END_ROUND:
                    var coins_historyString = params.getUtfString ('coins_history');
                    var coins_history = JSON.parse (coins_historyString);
                    var round_coins = params.getIntArray ('round_coins');
                    var total_coins = params.getIntArray ('total_coins');
                    var endMission = params.getBool ("endMission");
                    var mission_score = params.getIntArray ('mission_score');
                    var points = params.getBool ('points');
                    var winner = params.getInt ('winner');
                    var win_cardsString = params.getUtfString ('win_cards');
                    var win_cards = JSON.parse (win_cardsString);
                    var allIn = params.getInt ('allIn');
                    global.scenes['gameScene'].doEndRound(coins_history, round_coins, total_coins, endMission, mission_score, points, winner, win_cards, allIn);
                break;
        
                case messages.MESSAGE_TYPE.SC_DO_ALARM:
                    order = params.getInt ('order');
                    var content = params.getUtfString ('content');
                    var coin = params.getInt ('coin');
                    global.scenes['gameScene'].doAlarm(order, content, coin);
                break;
        
                case messages.MESSAGE_TYPE.SC_SEND_POINT:
                    var userOrders = params.getIntArray ('userOrders');
                    var coins = params.getIntArray ('coins');
                    var state = params.getInt ('state');
                    global.scenes['gameScene'].setPoints(userOrders, coins, state);
                break;
            
      }
    },

    // update (dt) {},
}
module.exports = GameCommands;