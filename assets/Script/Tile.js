import { ClientCommService } from "./ClientCommService";
import { ROUNDS } from "./Common/Constants";
import GlobalData from "./Common/GlobalData";
var global = require("./global");

export default cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Sprite,
        mask: cc.Node,
        selected: cc.Node,
        released: cc.Node,
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

        let spriteName = "";
        if (['t', 'm', 'v', 'w', 'l', 'o'].includes(this._value)) {
            this._user = 0;
            switch (this._value) {
                case 't':
                    spriteName = 'white-rook';
                    break;
                case 'm':
                    spriteName = 'white-knight';
                    break;
                case 'v':
                    spriteName = 'white-bishop';
                    break;
                case 'w':
                    spriteName = 'white-queen';
                    break;
                case 'l':
                    spriteName = 'white-king';
                    break;
                case 'o':
                    spriteName = 'white-pawn';
                    break;
            }
        }
        else if (['r', 'n', 'b', 'q', 'k', 'p'].includes(this._value)) {
            this._user = 1;
            switch (this._value) {
                case 'r':
                    spriteName = 'black-rook';
                    break;
                case 'n':
                    spriteName = 'black-knight';
                    break;
                case 'b':
                    spriteName = 'black-bishop';
                    break;
                case 'q':
                    spriteName = 'black-queen';
                    break;
                case 'k':
                    spriteName = 'black-king';
                    break;
                case 'p':
                    spriteName = 'black-pawn';
                    break;
            }
        }

        this.label.string = this._value;


        this.background.spriteFrame = GlobalData.imgAtlas.getSpriteFrame("fichas-" + spriteName);
    },

    onClickTile() {
        // console.log(this._id, this._value);
        if (!global.scenes['gameScene']._endGame
            && this._user === global.scenes['gameScene']._currentPlayer
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

    update(dt) {
    },
});
