// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ClientCommService } from "./ClientCommService";
var lang = require("./lang.js");

export default cc.Class({
    extends: cc.Component,

    properties: {
        message: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setAmount(credits) {
        let winMessage = "You win %AMOUNT% toros!";
        winMessage = lang.translateText(winMessage, "win_label");
        winMessage = winMessage.replace("%AMOUNT%", "<color=#582C14>" + credits + "</color>");
        this.message.string = winMessage;
    },

    onClick() {
        ClientCommService.sendRestartGame(0);
    },

    update(dt) { },
});
