// import { MESSAGE_TYPE } from "../Common/Messages";
var MESSAGE_TYPE = require('../Common/Messages');
import { ClientCommService } from "../ClientCommService";
import { TIME_LIMIT, ALARM_LIMIT, PLAYERS } from "../Common/Constants";
import { myTurn } from "../GameVars";
var gameVars = require("GameVars");

//--------Defining global variables----------

//--------Defining global variables----------

function copyObject(object) {
    if (!object) {
        trace("undefined object in copyObject:", object);
        return object;
    }
    return JSON.parse(JSON.stringify(object));
}

if (!trace) {
    var trace = function () {
        console.trace(JSON.stringify(arguments));
    };
}

function initHandlers() {
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, onStartGame);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CONFIRM_INIT_HANDS, onAskPlayer);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_CLAIM_PASS, onPass);
    ServerCommService.addRequestHandler(MESSAGE_TYPE.CS_RESTART_GAME, onInit);
}

function onStartGame() {
    startGame();
}

function onAskPlayer(params, room) {
    askPlayer(params, room);
}

function onPass(params, room) {
    pass(params, room);
}

function onInit() {
    init();
}

function init() {
    startGame();
}

function startGame() {
    gameVars.values = [
        'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r',
        'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p',
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
        'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o',
        't', 'm', 'v', 'w', 'l', 'v', 'm', 't'];
    gameVars.ck = false;
    gameVars.cr1 = false;
    gameVars.cr2 = false;
    gameVars.cl = false;
    gameVars.myTurn = true;
    gameVars.moveable = false;
    gameVars.moveTarget = "";
    gameVars.moveScopes = [];

    ServerCommService.send(
        MESSAGE_TYPE.SC_DRAW_BOARD,
        {
            board: gameVars.values,
            // currentPlayer: gameVars.myTurn ? 0 : 1,
        },
        [0, 1]
    );
}

// finish the game or mission
function gameOver() {
}

function askPlayer() {
    trace("askPlayer:", gameVars.myTurn);
    TimeoutManager.clearNextTimeout();
}

export const ServerCommService = {
    callbackMap: {},
    init() {
        this.callbackMap = {};
    },
    addRequestHandler(messageType, callback) {
        this.callbackMap[messageType] = callback;
    },
    send(messageType, data, users) {
        // TODO: Make fake code here to send message to client side
        // Added timeout bc there are times that UI are not updated properly if we send next message immediately
        // If we move to backend, we can remove this timeout
        setTimeout(function () {
            ClientCommService.onExtensionResponse({
                cmd: messageType,
                params: data,
                users: users,
            });
        }, 100);
    },
    onReceiveMessage(messageType, data, room) {
        const callback = this.callbackMap[messageType];
        trace("S - onReceiveMessage", messageType, data, room);
        if (callback) {
            callback(data, room);
        }
    },
};
ServerCommService.init();

const TimeoutManager = {
    timeoutHandler: null,
    nextAction: null,

    setNextTimeout(callback, timeLimit) {
        this.timeoutHandler = setTimeout(
            function () {
                return callback();
            },
            timeLimit ? timeLimit * 1000 : (TIME_LIMIT + ALARM_LIMIT) * 1000
        );
    },

    clearNextTimeout() {
        if (this.timeoutHandler) {
            clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    },
};

export const FakeServer = {
    initHandlers() {
        initHandlers();
    },
    init() {
        init();
    },
    startGame() {
        startGame();
    },
};
