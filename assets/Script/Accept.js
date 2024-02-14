import { ClientCommService } from "./ClientCommService";
import Triple from "./Triple";
var global = require("./global");

export default cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        button: cc.Button,

        _player: -1,
        _result: null,
    },


    onLoad() { },

    start() {

    },

    set(str, result, player) {
        this._player = player;
        this.label.string = str;
        this._result = result;
        let tripleNode;
        let tripleComponent;
        switch (str) {
            case "PONG":
                tripleNode = cc.instantiate(global.scenes['gameScene'].triplePrefab);
                tripleComponent = tripleNode.getComponent(Triple);
                tripleComponent.setTiles(result);
                tripleNode.setScale(0.5, 0.5);
                tripleNode.getComponent(cc.Button).interactable = false;
                this.node.addChild(tripleNode);
                break;
            case "KONG":
                tripleNode = cc.instantiate(global.scenes['gameScene'].triplePrefab);
                tripleComponent = tripleNode.getComponent(Triple);
                tripleComponent.setTiles(result);
                tripleNode.setScale(0.5, 0.5);
                tripleNode.getComponent(cc.Button).interactable = false;
                this.node.addChild(tripleNode);
                break;
            case "P KONG":
                tripleNode = cc.instantiate(global.scenes['gameScene'].triplePrefab);
                tripleComponent = tripleNode.getComponent(Triple);
                tripleComponent.setTiles(result);
                tripleNode.setScale(0.5, 0.5);
                tripleNode.getComponent(cc.Button).interactable = false;
                this.node.addChild(tripleNode);
                break;
            case "CHOW":
                result.forEach((item, i) => {
                    tripleNode = cc.instantiate(global.scenes['gameScene'].triplePrefab);
                    tripleComponent = tripleNode.getComponent(Triple);
                    tripleComponent.setTiles(item);
                    tripleNode.setScale(0.5, 0.5);
                    if (result.length > 1) {
                        tripleNode.getComponent(cc.Button).interactable = true;
                    } else {
                        tripleNode.getComponent(cc.Button).interactable = false;
                    }
                    this.node.addChild(tripleNode);
                })
                break;
            case "PASS":
                break;
            default:
                return 0;
        }
    },

    onClick() {
        let str = this.label.string;
        global.scenes['gameScene'].stopPlayer(this._player);
        switch (str) {
            case "PONG":
                ClientCommService.sendClaimPong(this._player);
                break;
            case "KONG":
                ClientCommService.sendClaimKong(this._player);
                break;
            case "P KONG":
                ClientCommService.sendClaimPrivateKong(this._player);
                break;
            case "CHOW":
                ClientCommService.sendClaimChow(this._player, this._result[0]);
                break;
            case "PASS":
                ClientCommService.sendClaimPass(this._player);
                break;
            default:
                return 0;
        }
    },

    update(dt) { },
});
