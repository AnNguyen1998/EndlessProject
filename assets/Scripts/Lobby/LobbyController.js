const Emitter = require('Emitter');
const { Popup, Game } = require('EventKeys');
const SoundKeys = require('SoundKeys');
const PlayerData = require('PlayerTemplate');

cc.Class({
    extends: cc.Component,

    properties: {
        goldLabel: {
            default: null,
            type: cc.Label
        }
    },

    onLoad() {
        this.init();
    },

    init() {
        this.goldLabel.string = PlayerData.getGold();
    },

    onSettingsClick() {
        Emitter.instance.emit(Popup.SHOW_SETTING_POPUP);
    },

    onUpgradeClick() {
        Emitter.instance.emit(Popup.SHOW_UPGRADE_POPUP);
    },

    onClickPlayButton() {

        Emitter.instance.emit(Game.SCENE_CHANGE, "Chapter");
    },

    onClickSound() {
        Emitter.instance.emit(SoundKeys.CLICK);
    },

});
