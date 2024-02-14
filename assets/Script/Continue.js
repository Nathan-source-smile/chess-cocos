import { ClientCommService } from "./ClientCommService";
export default cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Button,
        parent: cc.Node,
    },

    onLoad() { },

    start() {
    },

    onUserClickButton() {
        ClientCommService.sendRestartGame(0);
        this.parent.active = false;
    }
});