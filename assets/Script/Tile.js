import { ClientCommService } from "./ClientCommService";
import { ROUNDS } from "./Common/Constants";
import GlobalData from "./Common/GlobalData";
var global = require("./global");

export default cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        mask: cc.Node,
        label: cc.Label,
        id: -1,

        _value: 0,
        _user: -1,
    },

    onLoad() {
    },

    setTile(tile, i) {
        this._id = i;
        this._value = tile;
        if (['t', 'm', 'v', 'w', 'l', 'o'].includes(this._value))
            this._user = 0;
        else if (['r', 'n', 'b', 'q', 'k', 'p'].includes(this._value))
            this._user = 1;

        this.label.string = this._value;

        var spriteName = "";
        this.background.spriteFrame = GlobalData.imgAtlas.getSpriteFrame("tiles-" + spriteName);
    },

    onClickTile() {
        console.log(this._id, this._value);
        if (this._user === global.scenes['gameScene']._currentPlayer
            && (global.scenes['gameScene']._round === ROUNDS.START_STEP || global.scenes['gameScene']._round === ROUNDS.SELECT_UNIT)) {
            global.scenes['gameScene']._round = ROUNDS.SELECT_UNIT;
            global.scenes['gameScene']._selectPosition = this._id;
            ClientCommService.sendSelectTile(this._id);
        } else if (global.scenes['gameScene']._round === ROUNDS.SELECT_UNIT) {
            if (global.scenes['gameScene']._availablePositions.includes(this._id)) {
                global.scenes['gameScene']._targetPosition = this._id;
                ClientCommService.sendClaimMove(global.scenes['gameScene']._selectPosition, global.scenes['gameScene']._targetPosition);
                // global.scenes['gameScene']._round = ROUNDS.MOVE_UNIT;
            }
        }
    },

    update(dt) { },
});
