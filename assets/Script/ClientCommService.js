// import { MESSAGE_TYPE } from "./Common/Messages";
import { ServerCommService } from "./Server/FakeServer";
var global = require("./global");
var MESSAGE_TYPE = require('../Script/Common/Messages');

export const ClientCommService = {
    onExtensionResponse(event) {
        const messageType = event.cmd;
        const params = event.params;

        console.log("C - onExtensionResponse", event.cmd, event.params);

        switch (messageType) {
            case MESSAGE_TYPE.SC_START_GAME:
                global.scenes['gameScene'].start1(params.p1Score, params.p2Score);
                break;
            case MESSAGE_TYPE.SC_DRAW_BOARD:
                global.scenes['gameScene'].drawBoard(params.board, params.target);
                break;
            case MESSAGE_TYPE.SC_ASK_PLAYER:
                global.scenes['gameScene'].askPlayer(params.currentPlayer, params.remainTime);
                break;
            case MESSAGE_TYPE.SC_AVAIL_CELLS:
                global.scenes['gameScene'].setAvailCells(params.scopes);
                break;
            case MESSAGE_TYPE.SC_CONFIRM_MOVE:
                global.scenes['gameScene'].confirmMove(params.currentPlayer, params.p1Score, params.p2Score);
                break;
            case MESSAGE_TYPE.SC_CHECK:
                global.scenes['gameScene'].showCheck();
                break;
            case MESSAGE_TYPE.SC_ALERT:
                global.scenes['gameScene'].showAlert(params.kingP, params.attackP);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                global.scenes['gameScene'].endGame(params.winner, params.checkMate, params.p1Score, params.p2Score, params.time);
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendSelectTile(pos) {
        this.send(MESSAGE_TYPE.CS_SELECT_TILE, { pos: pos }, 1);
    },

    sendClaimMove(selectPos, targetPos) {
        this.send(MESSAGE_TYPE.CS_CLAIM_MOVE, { selectPos, targetPos }, 1);
    },

    sendClaimPass(player) {
        this.send(MESSAGE_TYPE.CS_CLAIM_PASS, { player: player }, 1);
    },

    sendRestartGame(player) {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, { player: player }, 1);
    },

    sendCommand(type, params) {
        this.send(type, params, 1);
    }
};
