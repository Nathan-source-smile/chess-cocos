import { loadImgAtlas } from "./AssetLoader";
import { FakeServer } from "./Server/FakeServer";
import { ClientCommService } from "./ClientCommService";
import TopBar from "./TopBar";
import GlobalVariables from "./GlobalVariables";
import { TIME_LIMIT, TOTAL_TILES } from "./Common/Constants";
import GlobalData from "./Common/GlobalData";
import Player from "./Player";
import Board from "./Board";
import EndRound from "./EndRound";
import EndGame from "./EndGame";
import WinNotification from "./WinNotification";
import LoseNotification from "./LoseNotification";
import StartRound from "./StartRound";
import StartSmallGame from "./StartSmallGame";

var Audio = require("./Audio.js");
var lang = require("./lang.js");
var global = require("./global.js");

cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,
        topBar: TopBar,
        player1: Player,
        player2: Player,
        board: Board,
        tilePrefab: cc.Prefab,

        notification: cc.Node,
        winNotification: WinNotification,
        loseNotification: LoseNotification,

        _currentPlayer: -1,
        _players: [],

        isMobile: false,
        coinsChangePerSecond: 0,
        isGameFinished: false,
        playerLoadingAttempCounter: 0,
        numPlayers: 0,
    },

    // use this for initialization
    onLoad: function () {
        global.loadingScene = false;
        global.scenes['currentScene'] = this;
        global.scenes['gameScene'] = global.scenes['currentScene'];
        // console.log(global.scenes['gameScene'], global.scenes['currentScene'], global.loadingScene);

        this._time = cc.director.getTotalTime();
        this._players = [this.player1, this.player2];

        lang.translateScene(cc.director.getScene(), ["continue", "accept", "pass"]);
        if (global.soundtrack) {
            Audio.playMusic(global.soundtrack);
        }

        this.loadSkin();
        this.loadLogo();
        loadImgAtlas()
            .then(() => {
                FakeServer.initHandlers();
                FakeServer.init();
                this._players.forEach((player, index) => {
                    player.avatar.setUsername('player' + (index + 1));
                });
            })
            .catch((error) => {
            });
    },

    start1(winds) {
        this._players.forEach((player, index) => {
        });
        // Listen for the 'finished' event        
    },

    setActivePlayer(gameBoardOrder, timeout) {
        this._players.forEach((player) => { player.avatar.stopCountDown(); player.avatar.deactivate(); });
        this._players[gameBoardOrder].avatar.activate();
        this._players[gameBoardOrder].avatar.startCountDown(timeout);
        this._players[gameBoardOrder].hand._click = false;
    },

    stopPlayer(gameBoardOrder) {
        this._players[gameBoardOrder].avatar.stopCountDown();
        this._players[gameBoardOrder].avatar.deactivate();
    },

    askPlayer(currentPlayer, drawCard, deckCardsNum, discardCard, discardPlayer) {
        this._currentPlayer = currentPlayer;
        this.setActivePlayer(currentPlayer, TIME_LIMIT);
        this._players[currentPlayer].setDrawCard(drawCard);
        this.board.clearBoard(deckCardsNum);
        if (discardCard) {
            this._players[discardPlayer].addDiscardCard(discardCard);
        }
    },

    endGameF(windsList, winners, winner) {
        this.notification.active = true;
        this.endRound.node.active = false;
        this.endGame.node.active = true;
        this.winNotification.node.active = false;
        this.loseNotification.node.active = false;
        this.endGame.setWinners(windsList, winners);

        this.scheduleOnce(() => {
            this.endGame.node.active = false;
            if (winner.indexOf(0) !== -1) {
                this.winNotification.node.active = true;
                this.winNotification.setAmount(2000);
                Audio.playEffect ("gameWinner");
            } else {
                this.loseNotification.node.active = true;
                this.loseNotification.setWinnerName("player" + (winner[0] + 1));
                Audio.playEffect ("gameLooser");
            }
        }, 5);
    },

    loadSkin() {
        this.loadBackground();
    },

    // Game common functions:
    loadBackground() {
        const spriteSheetPath = global.themeSpriteSheet.replace("%%SKIN%%", global.skin);
        let self = this;
        cc.loader.loadRes(spriteSheetPath, cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                console.log("Error loading background sprite sheet", spriteSheetPath);
                return;
            }
            let backgroundPath = global.gameSceneBackgroundFile;
            if (self.isMobile) {
                backgroundPath += "Mobile";
            }
            var spriteFrame = atlas.getSpriteFrame(backgroundPath);

            let backgroundSprite = cc.director.getScene().getChildByName('Canvas').getChildByName('sceneBackground').getComponent(cc.Sprite);
            backgroundSprite.spriteFrame = spriteFrame;
        });
    },

    loadLogo() {
        const spriteSheetPath = global.langSpriteSheet.replace("%%LANG%%", global.cookie_lang);
        let self = this;
        cc.loader.loadRes(spriteSheetPath, cc.SpriteAtlas, function (err, atlas) {
            if (err) {
                console.log("Error loading lang sprite sheet", spriteSheetPath);
                return;
            }
            var spriteFrame = atlas.getSpriteFrame("logoTop");

            let logoSprite = cc.director.getScene().getChildByName('Canvas').getChildByName('TopBar').getChildByName('topLogo').getComponent(cc.Sprite);
            logoSprite.spriteFrame = spriteFrame;
        });
    },

    finishGame(winnerOrder, credits) {
        this.isGameFinished = true;
        Audio.stopMusic();
        if (winnerOrder == global.myOrder) {
            this.showWinNotification(credits);
            if (credits > 0) {
                this.setCreditsChange(credits);
                global.scenes['roomScene'].updateBrowserCredits(global.credits);
            }
        }
        else {
            var winnerTeam = 1;
            if (winnerOrder == 1) {
                winnerTeam = 2;
            }
            var winnerTeamName = "Team " + winnerTeam;
            this.showLoseNotification(winnerTeamName);
        }
        global.SfsDisconnectReason = global.SfsDisconnectReasons.gameFinished;
        global.scenes['roomScene'].closeSfsConnection();
    },


    hideSurrenderDisplay() {
        this.surrenderDisplayNode.active = false;
    },

    showSurrenderDisplay() {
        this.surrenderDisplayNode.active = true;
    },

    // called every frame
    update: function (dt) {
    },

});