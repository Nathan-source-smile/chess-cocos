import { ClientCommService } from "./ClientCommService";
import GlobalData from "./Common/GlobalData";
var global = require("./global");
import PlayerHand from "./PlayerHand";

export default cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        id: -1,
        
        _value: 0,
        _tile: null,
    },

    onLoad() {
    },

    setTile(tile) {
        this._id = tile.id;
        this._type = tile.type;
        this._semiType = tile.semiType;
        this._tile = tile;

        var spriteName = "";
        this.background.spriteFrame = GlobalData.imgAtlas.getSpriteFrame("tiles-" + spriteName);
    },

    onClickTile() {
        let playerHand = this.node.getParent()?.getParent()?.getComponent(PlayerHand);
        if (playerHand) {
            if (playerHand.player === global.scenes['gameScene']._currentPlayer && !playerHand._click) {
                console.log(this._id);
                playerHand._click = true;
                ClientCommService.sendClaimDiscard(this._tile, global.scenes['gameScene']._currentPlayer);
            }
        }
    },

    update(dt) { },
});
