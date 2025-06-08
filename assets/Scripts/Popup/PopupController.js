const SettingsPopup = require('./SettingsPopup');
const mEmitter = require('../EventEmitter/Emitter');
import { Popup } from '../EventEmitter/EventKeys';

cc.Class({
    extends: cc.Component,
    properties: {
        settingsPopup: SettingsPopup
    },
    onLoad() {
        cc.game.addPersistRootNode(this.node);
        mEmitter.instance.registerEvent(Popup.SHOW_SETTING_POPUP, this.showSettingsPopup.bind(this));
        mEmitter.instance.registerEvent(Popup.HIDE_SETTING_POPUP, this.hideSettingsPopup.bind(this));
    },
    showSettingsPopup() {
        this.settingsPopup.node.active = true;
    },
    hideSettingsPopup() {
        this.settingsPopup.node.active = false;
    },
    onDestroy() {
        mEmitter.instance.removeEvent(Popup.SHOW_SETTING_POPUP, this.showSettingsPopup);
        mEmitter.instance.removeEvent(Popup.HIDE_SETTING_POPUP, this.hideSettingsPopup);
    }
});
module.exports = PopupController; 