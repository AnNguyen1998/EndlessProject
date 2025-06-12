const Emitter = require('Emitter');
const { Game } = require('EventKeys');
const RoomController = require('RoomController');
const GameData = require('GameData');

cc.Class({
    extends: require('PopupItem'),
    name: "GameResultPopup",

    properties: {
        titleLabel: cc.Label,
        starNodes: [cc.Node],
        coinLabel: cc.Label,
        playAgainButton: cc.Button,
        exitButton: cc.Button,
    },

    onLoad() {
        this._super();
        this.exitButton.node.on('click', this.onExit, this);
    },

    showStar(isWin, stars = 0, coins = 0) {
        this.titleLabel.string = isWin ? "VICTORY" : "GAME OVER";

        for (let i = 0; i < this.starNodes.length; i++) {
            const star = this.starNodes[i];
            if (star) {
                star.color = i < stars ? cc.Color.YELLOW : cc.Color.GRAY;
            }
        }

        this.coinLabel.string = coins;
        this.node.active = true;
    },


    onExit() {
        this.hide();
        Emitter.instance.emit(Game.SCENE_CHANGE, "Chapter");
    },

    onDestroy() {
     
        this._super();
    },
});