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
        label1: cc.Label,
        label2: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    setWinnerName(winner) {
        let loseMessage = "%WINNER% has won.";
        loseMessage = lang.translateText(loseMessage, "lose_label_1");
        loseMessage = loseMessage.replace("%WINNER%", winner)
        this.label1.string = loseMessage;
        this.label2.string = lang.translateText("Try again for better luck", "lose_label_2");;
    },

    onClick() {
        ClientCommService.sendRestartGame(0);
    },

    update(dt) { },
});
