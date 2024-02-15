var global = require("./global");
import Tile from "./Tile";

export default cc.Class({
    extends: cc.Component,

    properties: {
        _tiles: [],
    },


    onLoad() { },

    start() {
    },

    drawBoard(board) {
        this.node.removeAllChildren();
        this._tiles.forEach((tile) => {
            tile.node.destroy();
        });
        this._tiles = [];
        board.forEach((tile, i) => {
            const tileNode = cc.instantiate(global.scenes['gameScene'].tilePrefab);
            const tileComponent = tileNode.getComponent(Tile);
            tileComponent.setTile(tile, i);
            this.node.addChild(tileNode);
            this._tiles.push(tileComponent);
        });
    },

    setAvailCells(scopes) {
        this._tiles.forEach((tile) => {
            if (scopes.includes(tile._id)) {
                tile.mask.active = true;
            } else {
                tile.mask.active = false;
            }
        });
    },

    clearAvailCells() {
        this._tiles.forEach((tile) => {
            tile.mask.active = false;
        });
    },

    update(dt) { },
});
