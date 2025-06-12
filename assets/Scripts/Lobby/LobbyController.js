const Emitter = require('Emitter');
const { Popup, Game } = require('EventKeys');

cc.Class({
    extends: cc.Component,

    onSettingsClick() {
        Emitter.instance.emit(Popup.SHOW_SETTING_POPUP);
    },

    onUpgradeClick() {
        Emitter.instance.emit(Popup.SHOW_UPGRADE_POPUP);
    },

    hideUpgradePopup() {
        Emitter.instance.emit(Popup.HIDE_UPGRADE_POPUP);
    },

    onClickPlayButton() {
        Emitter.instance.emit(Game.SCENE_CHANGE, "Chapter");
    }
    
});
