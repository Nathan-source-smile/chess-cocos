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
                global.scenes['gameScene'].start1(params.winds);
                break;
            case MESSAGE_TYPE.SC_DRAW_BOARD:
                global.scenes['gameScene'].drawBoard(params.board);
                break;
            case MESSAGE_TYPE.SC_ASK_PLAYER:
                global.scenes['gameScene'].askPlayer(params.currentPlayer, params.drawCard, params.deckCardsNum, params.discardCard, params.discardPlayer);
                break;
            case MESSAGE_TYPE.SC_END_GAME:
                global.scenes['gameScene'].endGameF(params.windsList, params.winners, params.winner);
                break;
        }
    },

    send(messageType, data, room) {
        ServerCommService.onReceiveMessage(messageType, data, room);
    },

    sendClaimPass(player) {
        this.send(MESSAGE_TYPE.CS_CLAIM_PASS, { player: player });
    },

    sendRestartGame(player) {
        this.send(MESSAGE_TYPE.CS_RESTART_GAME, { player: player }, 1);
    },

    sendCommand(type, params) {
        this.send(type, params, 1);
    }
};
