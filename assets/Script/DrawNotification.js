// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ClientCommService } from "./ClientCommService.js";
var lang = require("./lang.js");

export default cc.Class({
    extends: cc.Component,

    properties: {
        message: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setAmount(credits) {
        let drawMessage = "You win %AMOUNT% toros!";
        drawMessage = lang.translateText(drawMessage, "draw_label");
        drawMessage = drawMessage.replace("%AMOUNT%", "<color=#582C14>" + credits + "</color>");
        this.message.string = drawMessage;
    },

    onClick() {
        ClientCommService.sendRestartGame(0);
    },

    update(dt) { },
});
