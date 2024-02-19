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

    setText() {
        let checkMateMessage = "JAQUE MATE!";
        checkMateMessage = lang.translateText(checkMateMessage, "checkmate_label");
        this.message.string = checkMateMessage;
    },

    update(dt) { },
});
